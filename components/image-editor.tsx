"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from "react-konva"
import type Konva from "konva"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Type, ImageIcon, Palette } from "lucide-react"

interface TextOverlay {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fill: string
  fontStyle: string
}

interface ImageEditorProps {
  imageUrl: string
  width?: number
  height?: number
  headline?: string
  overlayText?: string
  cta?: string
  /** Alternate CTA lines; shown as quick picks for the CTA overlay */
  ctaOptions?: string[]
}

function defaultOverlays(
  headline: string,
  overlayText: string,
  cta: string
): TextOverlay[] {
  return [
    {
      id: "headline",
      text: headline,
      x: 50,
      y: 50,
      fontSize: 48,
      fill: "#ffffff",
      fontStyle: "bold",
    },
    {
      id: "overlay",
      text: overlayText,
      x: 50,
      y: 150,
      fontSize: 32,
      fill: "#ffffff",
      fontStyle: "normal",
    },
    {
      id: "cta",
      text: cta,
      x: 50,
      y: 250,
      fontSize: 28,
      fill: "#ffcc00",
      fontStyle: "bold",
    },
  ]
}

export function ImageEditor({
  imageUrl,
  width = 800,
  height = 600,
  headline = "Your Headline Here",
  overlayText = "Overlay Text",
  cta = "Call to Action",
  ctaOptions,
}: ImageEditorProps) {
  const resolvedCtaOptions =
    ctaOptions && ctaOptions.length > 0 ? ctaOptions : [cta]
  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [stageSize, setStageSize] = useState({ width, height })

  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>(() =>
    defaultOverlays(headline, overlayText, cta)
  )

  // Keep canvas copy in sync when URL / parent props change
  useEffect(() => {
    setTextOverlays((prev) => {
      const nextDefaults = defaultOverlays(headline, overlayText, cta)
      return nextDefaults.map((d) => {
        const existing = prev.find((o) => o.id === d.id)
        return existing ? { ...existing, text: d.text } : d
      })
    })
  }, [headline, overlayText, cta])

  // Load image
  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl
    img.onload = () => {
      setImage(img)
      // Calculate aspect ratio and fit to canvas
      const aspectRatio = img.width / img.height
      let newWidth = width
      let newHeight = height
      
      if (aspectRatio > width / height) {
        newHeight = width / aspectRatio
      } else {
        newWidth = height * aspectRatio
      }
      
      setStageSize({ width: Math.round(newWidth), height: Math.round(newHeight) })
    }
  }, [imageUrl, width, height])

  // Handle transformer attachment
  useEffect(() => {
    if (selectedId && transformerRef.current && stageRef.current) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`)
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode])
        transformerRef.current.getLayer()?.batchDraw()
      }
    }
  }, [selectedId])

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
      transformerRef.current?.nodes([])
    }
  }, [])

  const updateOverlay = useCallback((id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays((prev) =>
      prev.map((overlay) => (overlay.id === id ? { ...overlay, ...updates } : overlay))
    )
  }, [])

  const handleDragEnd = useCallback((id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    updateOverlay(id, { x: e.target.x(), y: e.target.y() })
  }, [updateOverlay])

  const handleTransformEnd = useCallback((id: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target as Konva.Text
    const scaleX = node.scaleX()
    const overlay = textOverlays.find((o) => o.id === id)
    if (overlay) {
      updateOverlay(id, {
        x: node.x(),
        y: node.y(),
        fontSize: Math.round(overlay.fontSize * scaleX),
      })
      node.scaleX(1)
      node.scaleY(1)
    }
  }, [textOverlays, updateOverlay])

  const downloadImage = useCallback(() => {
    if (!stageRef.current) return

    // Hide transformer before export
    transformerRef.current?.nodes([])
    setSelectedId(null)

    setTimeout(() => {
      const uri = stageRef.current?.toDataURL({ pixelRatio: 2 })
      if (uri) {
        const link = document.createElement("a")
        link.download = "edited-image.png"
        link.href = uri
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }, 100)
  }, [])

  const selectedOverlay = textOverlays.find((o) => o.id === selectedId)

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Canvas Area */}
      <div className="flex-1">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Canvas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border border-border rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center"
              style={{ minHeight: stageSize.height + 40 }}
            >
              <Stage
                ref={stageRef}
                width={stageSize.width}
                height={stageSize.height}
                onClick={handleStageClick}
                onTap={handleStageClick}
                className="cursor-crosshair"
              >
                <Layer>
                  {image && (
                    <KonvaImage
                      image={image}
                      width={stageSize.width}
                      height={stageSize.height}
                    />
                  )}
                  {textOverlays.map((overlay) => (
                    <Text
                      key={overlay.id}
                      id={overlay.id}
                      text={overlay.text}
                      x={overlay.x}
                      y={overlay.y}
                      fontSize={overlay.fontSize}
                      fill={overlay.fill}
                      fontStyle={overlay.fontStyle}
                      fontFamily="sans-serif"
                      draggable
                      onClick={() => handleSelect(overlay.id)}
                      onTap={() => handleSelect(overlay.id)}
                      onDragEnd={(e) => handleDragEnd(overlay.id, e)}
                      onTransformEnd={(e) => handleTransformEnd(overlay.id, e)}
                      shadowColor="black"
                      shadowBlur={4}
                      shadowOffset={{ x: 2, y: 2 }}
                      shadowOpacity={0.5}
                    />
                  ))}
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 20 || newBox.height < 20) {
                        return oldBox
                      }
                      return newBox
                    }}
                    enabledAnchors={["middle-left", "middle-right"]}
                    rotateEnabled={false}
                  />
                </Layer>
              </Stage>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={downloadImage} className="gap-2">
                <Download className="h-4 w-4" />
                Download Image
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Panel */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Text Content Editor */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Type className="h-4 w-4" />
              Text Overlays
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {textOverlays.map((overlay) => (
              <div
                key={overlay.id}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedId === overlay.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedId(overlay.id)}
              >
                <Label className="text-xs text-muted-foreground capitalize mb-2 block">
                  {overlay.id === "cta" ? "CTA" : overlay.id}
                </Label>
                <Input
                  value={overlay.text}
                  onChange={(e) => updateOverlay(overlay.id, { text: e.target.value })}
                  className="text-sm"
                  placeholder={`Enter ${overlay.id} text`}
                />
                {overlay.id === "cta" && resolvedCtaOptions.length > 1 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {resolvedCtaOptions.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={overlay.text === option ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs max-w-full truncate"
                        title={option}
                        onClick={(e) => {
                          e.stopPropagation()
                          updateOverlay("cta", { text: option })
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Style Controls */}
        {selectedOverlay && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4" />
                Style: {selectedOverlay.id === "cta" ? "CTA" : selectedOverlay.id}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Font Size Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Font Size</Label>
                  <span className="text-sm text-muted-foreground font-mono">
                    {selectedOverlay.fontSize}px
                  </span>
                </div>
                <Slider
                  value={[selectedOverlay.fontSize]}
                  onValueChange={([value]) =>
                    updateOverlay(selectedOverlay.id, { fontSize: value })
                  }
                  min={12}
                  max={120}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Color Picker */}
              <div className="space-y-3">
                <Label className="text-sm">Text Color</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-border shadow-sm"
                    style={{ backgroundColor: selectedOverlay.fill }}
                  />
                  <Input
                    type="color"
                    value={selectedOverlay.fill}
                    onChange={(e) =>
                      updateOverlay(selectedOverlay.id, { fill: e.target.value })
                    }
                    className="w-full h-10 cursor-pointer"
                  />
                </div>
                {/* Color Presets */}
                <div className="flex flex-wrap gap-2">
                  {["#ffffff", "#000000", "#ffcc00", "#ff4444", "#44ff44", "#4444ff", "#ff44ff", "#44ffff"].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => updateOverlay(selectedOverlay.id, { fill: color })}
                        className="w-7 h-7 rounded-md border border-border shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Font Style Toggle */}
              <div className="space-y-3">
                <Label className="text-sm">Font Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={selectedOverlay.fontStyle === "normal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateOverlay(selectedOverlay.id, { fontStyle: "normal" })}
                    className="flex-1"
                  >
                    Normal
                  </Button>
                  <Button
                    variant={selectedOverlay.fontStyle === "bold" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateOverlay(selectedOverlay.id, { fontStyle: "bold" })}
                    className="flex-1 font-bold"
                  >
                    Bold
                  </Button>
                  <Button
                    variant={selectedOverlay.fontStyle === "italic" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateOverlay(selectedOverlay.id, { fontStyle: "italic" })}
                    className="flex-1 italic"
                  >
                    Italic
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedOverlay && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Click on a text overlay to edit its style</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
