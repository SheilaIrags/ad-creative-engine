"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { Sparkles, ArrowLeft } from "lucide-react"
import { ImageEditorWithData } from "@/components/image-editor-with-data"

function parseCtaOptions(raw: string | null, fallbackCta: string): string[] {
  if (!raw) return [fallbackCta]
  try {
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every((item): item is string => typeof item === "string")) {
      return parsed.length > 0 ? parsed : [fallbackCta]
    }
  } catch {
    // ignore malformed query param
  }
  return [fallbackCta]
}

function EditorContent() {
  const searchParams = useSearchParams()
  
  const imageUrl = searchParams.get("image_url") || ""
  const headline = searchParams.get("headline") || "Your Headline Here"
  const overlayText = searchParams.get("overlay_text") || "Overlay Text"
  const cta = searchParams.get("cta") || "Call to Action"
  const ctaOptions = parseCtaOptions(searchParams.get("cta_options"), cta)

  if (!imageUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No image provided</p>
          <Link
            href="/results"
            className="text-primary hover:underline"
          >
            Go back to results
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
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

      <main className="relative container mx-auto px-6 py-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/results"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Results</span>
          </Link>
        </div>

        {/* Page title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Edit Your Ad Creative
          </h1>
          <p className="text-muted-foreground">
            Customize the text, colors, and positioning. Download when ready.
          </p>
        </div>

        {/* Editor */}
        <ImageEditorWithData
          imageUrl={imageUrl}
          headline={headline}
          overlayText={overlayText}
          cta={cta}
          ctaOptions={ctaOptions}
        />
      </main>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="h-8 w-8 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  )
}
