"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowLeft, Download, RefreshCw, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for the generated ads
const MOCK_ADS = [
  {
    id: "1",
    angle: "Social Proof",
    headline: "Join 10,000+ Happy Customers",
    cta: "Start Free Trial",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=800&fit=crop",
  },
  {
    id: "2",
    angle: "Fear of Missing Out",
    headline: "Limited Time: 50% Off Today Only",
    cta: "Claim Your Discount",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=800&fit=crop",
  },
  {
    id: "3",
    angle: "Problem-Solution",
    headline: "Tired of Wasting Time? We Fixed It.",
    cta: "See How It Works",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=800&fit=crop",
  },
  {
    id: "4",
    angle: "Aspirational",
    headline: "Become the Best Version of Yourself",
    cta: "Transform Today",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop",
  },
  {
    id: "5",
    angle: "Direct Benefit",
    headline: "Save 10 Hours Every Week, Guaranteed",
    cta: "Get Started Now",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=800&fit=crop",
  },
]

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-square bg-muted animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-5 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        {/* Button skeletons */}
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-muted rounded-lg animate-pulse" />
          <div className="h-10 flex-1 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function AdCard({
  ad,
  onEdit,
  onRegenerate,
}: {
  ad: typeof MOCK_ADS[0]
  onEdit: () => void
  onRegenerate: () => void
}) {
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = () => {
    setIsRegenerating(true)
    // Simulate regeneration
    setTimeout(() => {
      setIsRegenerating(false)
      onRegenerate()
    }, 2000)
  }

  return (
    <div className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={ad.image}
          alt={ad.headline}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Angle badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold backdrop-blur-sm">
            {ad.angle}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            {ad.headline}
          </h3>
          <p className="text-sm text-muted-foreground">
            CTA: <span className="text-primary font-medium">{ad.cta}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={onEdit}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit & Download
          </Button>
          <Button
            onClick={handleRegenerate}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-muted"
            disabled={isRegenerating}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", isRegenerating && "animate-spin")} />
            {isRegenerating ? "..." : "Regenerate"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [ads, setAds] = useState<typeof MOCK_ADS>([])

  // Simulate loading then transition to results
  useEffect(() => {
    // Simulate the AI generation time (shorter for demo)
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
      setAds(MOCK_ADS)
      // Small delay before showing results for smooth transition
      setTimeout(() => setShowResults(true), 100)
    }, 4000) // 4 second loading simulation for demo

    return () => clearTimeout(loadingTimer)
  }, [])

  const handleEdit = (ad: typeof MOCK_ADS[0]) => {
    // Collect all CTAs from all ads
    const ctaOptions = ads.map((a) => a.cta)
    
    // Build URL with all the data
    const params = new URLSearchParams({
      image_url: ad.image,
      headline: ad.headline,
      overlay_text: ad.angle,
      cta: ad.cta,
      cta_options: JSON.stringify(ctaOptions),
    })
    
    window.location.href = `/editor?${params.toString()}`
  }

  const handleRegenerate = (adId: string) => {
    // In a real app, this would call the API to regenerate
    console.log("Regenerating ad:", adId)
  }

  const handleDownloadAll = () => {
    // In a real app, this would trigger a zip download
    console.log("Downloading all ads")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Ktizai</span>
          </Link>
        </nav>
      </header>

      <main className="relative container mx-auto px-6 py-8 md:py-12">
        {/* Top navigation bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/generate"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Brief</span>
          </Link>

          {!isLoading && (
            <Button
              onClick={handleDownloadAll}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          )}
        </div>

        {isLoading ? (
          /* Loading State */
          <div className="space-y-8">
            {/* Loading message */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-base font-medium text-foreground">
                  Generating your ads... this takes about 20 seconds
                </span>
              </div>
            </div>

            {/* Skeleton grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : (
          /* Results */
          <div className={cn(
            "space-y-8 transition-all duration-500",
            showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            {/* Success header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Your Ad Creatives Are Ready
              </h1>
              <p className="text-muted-foreground">
                5 unique angles generated. Edit, download, or regenerate any creative.
              </p>
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {ads.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onEdit={() => handleEdit(ad)}
                  onRegenerate={() => handleRegenerate(ad.id)}
                />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center pt-8">
              <Link href="/generate">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border text-foreground hover:bg-muted"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create More Ads
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
