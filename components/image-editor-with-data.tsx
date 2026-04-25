"use client"

import { ImageEditor } from "@/components/image-editor"

export interface ImageEditorWithDataProps {
  imageUrl: string
  headline: string
  overlayText: string
  cta: string
  ctaOptions: string[]
}

export function ImageEditorWithData({
  imageUrl,
  headline,
  overlayText,
  cta,
  ctaOptions,
}: ImageEditorWithDataProps) {
  const safeCtaOptions = Array.isArray(ctaOptions) && ctaOptions.length > 0 ? ctaOptions : [cta]

  return (
    <ImageEditor
      imageUrl={imageUrl}
      headline={headline}
      overlayText={overlayText}
      cta={cta}
      ctaOptions={safeCtaOptions}
    />
  )
}
