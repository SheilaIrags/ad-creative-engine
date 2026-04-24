"use client"

import Link from "next/link"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Upload, X, ArrowLeft, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "facebook", label: "Facebook" },
]

const LOADING_STEPS = [
  { message: "Analysing your brief...", duration: 2000 },
  { message: "Generating creative directions...", duration: 2500 },
  { message: "Creating your ads...", duration: 3000 },
]

export default function GeneratePage() {
  const [brief, setBrief] = useState("")
  const [platform, setPlatform] = useState("instagram")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setUploadedFileName(file.name)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const removeImage = useCallback(() => {
    setUploadedImage(null)
    setUploadedFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    setLoadingStep(0)
    setProgress(0)
  }, [])

  // Loading animation effect
  useEffect(() => {
    if (!isGenerating) return

    const totalDuration = LOADING_STEPS.reduce((acc, step) => acc + step.duration, 0)
    let elapsed = 0

    const progressInterval = setInterval(() => {
      elapsed += 50
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(newProgress)

      if (elapsed >= totalDuration) {
        clearInterval(progressInterval)
        // Reset after completion (in real app, would show results)
        setTimeout(() => {
          setIsGenerating(false)
          setProgress(0)
          setLoadingStep(0)
        }, 500)
      }
    }, 50)

    // Step progression
    let stepElapsed = 0
    let currentStep = 0
    const stepInterval = setInterval(() => {
      stepElapsed += 100
      const currentStepDuration = LOADING_STEPS[currentStep]?.duration || 0
      
      if (stepElapsed >= currentStepDuration && currentStep < LOADING_STEPS.length - 1) {
        currentStep++
        setLoadingStep(currentStep)
        stepElapsed = 0
      }
    }, 100)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [isGenerating])

  const canGenerate = brief.trim().length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px]" />
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
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      <main className="relative container mx-auto px-6 py-12 max-w-3xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Create Your Ads
          </h1>
          <p className="text-muted-foreground text-lg">
            Describe your vision and watch the magic happen
          </p>
        </div>

        {!isGenerating ? (
          <div className="space-y-8">
            {/* Brief Textarea */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Your Brief
              </label>
              <Textarea
                placeholder="Describe your product, target audience, and what makes it special..."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="min-h-[160px] bg-card border-border text-foreground placeholder:text-muted-foreground resize-none text-base"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Reference Image
                <span className="text-muted-foreground font-normal ml-2">(optional)</span>
              </label>
              
              {!uploadedImage ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-card/50"
                  )}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-medium">
                      Upload a reference image
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Drag and drop or click to browse
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative rounded-xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center gap-4 p-4">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={uploadedImage}
                        alt="Uploaded reference"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium truncate">
                        {uploadedFileName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Reference image uploaded
                      </p>
                    </div>
                    <button
                      onClick={removeImage}
                      className="h-8 w-8 rounded-full bg-muted hover:bg-destructive/20 flex items-center justify-center transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Platform Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Platform
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                      platform === p.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-card border border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Generate 5 ad angles
              </Button>
              {!canGenerate && (
                <p className="text-center text-sm text-muted-foreground mt-3">
                  Enter a brief to get started
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-20">
            {/* Animated sparkle icon */}
            <div className="relative mb-8">
              <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-primary/30 animate-ping" />
            </div>

            {/* Loading steps */}
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-4">
                {LOADING_STEPS.map((step, index) => (
                  <div
                    key={step.message}
                    className={cn(
                      "flex items-center gap-3 transition-all duration-300",
                      index === loadingStep
                        ? "opacity-100"
                        : index < loadingStep
                        ? "opacity-50"
                        : "opacity-30"
                    )}
                  >
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                        index < loadingStep
                          ? "bg-primary text-primary-foreground"
                          : index === loadingStep
                          ? "bg-primary/20 border-2 border-primary"
                          : "bg-muted border border-border"
                      )}
                    >
                      {index < loadingStep ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : index === loadingStep ? (
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      ) : null}
                    </div>
                    <span
                      className={cn(
                        "text-base transition-colors duration-300",
                        index === loadingStep
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.message}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
