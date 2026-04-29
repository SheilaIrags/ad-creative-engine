"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { Sparkles, ArrowLeft } from "lucide-react"
import { ImageEditorWithData } from "@/components/image-editor-with-data"

type GenerationResult = {
  image_url?: string
  angle?: string
  headline?: string
  primary_text?: string
  overlay_text?: string
  cta?: string
  direction_name?: string
}

function EditorContent() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get("job_id")
  const variationIndexRaw = searchParams.get("variation_index")
  const variationIndex = variationIndexRaw ? Number(variationIndexRaw) : NaN

  const [isLoading, setIsLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState("")
  const [headline, setHeadline] = useState("")
  const [overlayText, setOverlayText] = useState("")
  const [cta, setCta] = useState("")
  const [ctaOptions, setCtaOptions] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      if (!jobId || !Number.isFinite(variationIndex)) {
        setErrorMessage("Missing job_id or variation_index.")
        setIsLoading(false)
        return
      }

      const res = await fetch(`/api/results/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.message || "Failed to load generation results")
      }

      let results = json?.results ?? []
      if (typeof results === "string") {
        results = JSON.parse(results)
      }

      const resultsArray = Array.isArray(results) ? (results as GenerationResult[]) : []
      const selected = resultsArray[variationIndex]

      const allCtas = Array.from(
        new Set(
          resultsArray
            .map((r) => r.cta)
            .filter((x): x is string => Boolean(x))
        )
      )
      const fallbackCtas = selected?.cta ? [selected.cta] : []

      if (!selected?.image_url) {
        if (!cancelled) {
          setErrorMessage("Could not find the selected variation.")
          setIsLoading(false)
        }
        return
      }

      if (!cancelled) {
        setImageUrl(selected.image_url || "")
        setHeadline(selected.headline || "")
        setOverlayText(selected.overlay_text || "")
        setCta(selected.cta || "")
        setCtaOptions(allCtas.length > 0 ? allCtas : fallbackCtas)
        setIsLoading(false)
      }
    }

    load()
      .catch((err) => {
        if (cancelled) return
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong")
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [jobId, variationIndex])

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{errorMessage}</p>
          <Link
            href={jobId ? `/results?job_id=${jobId}` : "/results"}
            className="text-primary hover:underline"
          >
            Go back to results
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="h-10 w-10 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading editor data...</p>
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
            href={jobId ? `/results?job_id=${jobId}` : "/results"}
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
