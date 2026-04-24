"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Sparkles } from "lucide-react"

// Dynamic import to avoid SSR issues with Konva
const ImageEditor = dynamic(
  () => import("@/components/image-editor").then((mod) => mod.ImageEditor),
  { ssr: false }
)

const SAMPLE_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    label: "Mountain Landscape",
  },
  {
    url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80",
    label: "Code Editor",
  },
  {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
    label: "Abstract Art",
  },
]

export default function Home() {
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url)
  const [inputUrl, setInputUrl] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const handleLoadImage = () => {
    if (inputUrl.trim()) {
      setImageUrl(inputUrl.trim())
      setIsEditing(true)
    }
  }

  const handleSampleImage = (url: string) => {
    setImageUrl(url)
    setInputUrl(url)
    setIsEditing(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Image Text Overlay Editor
          </h1>
          <p className="text-muted-foreground text-lg">
            Add draggable headlines, overlay text, and CTAs to your images
          </p>
        </div>

        {!isEditing ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* URL Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Load Your Image
                </CardTitle>
                <CardDescription>
                  Enter an image URL or choose from our samples below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLoadImage()}
                  />
                  <Button onClick={handleLoadImage} disabled={!inputUrl.trim()}>
                    Load
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sample Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Sample Images
                </CardTitle>
                <CardDescription>
                  Click any image to start editing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {SAMPLE_IMAGES.map((sample) => (
                    <button
                      key={sample.url}
                      onClick={() => handleSampleImage(sample.url)}
                      className="group relative aspect-video rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                    >
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-white text-sm font-medium">
                          {sample.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Back button and current image */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                ← Back to Image Selection
              </Button>
              <p className="text-sm text-muted-foreground truncate max-w-md">
                {imageUrl}
              </p>
            </div>

            {/* Editor */}
            <ImageEditor imageUrl={imageUrl} width={900} height={600} />
          </div>
        )}
      </div>
    </main>
  )
}
