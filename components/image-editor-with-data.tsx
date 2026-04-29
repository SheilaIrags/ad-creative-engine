"use client"

import { ImageEditor } from "@/components/image-editor"

export interface ImageEditorWithDataProps {
  imageUrl: string
  headline: string
  overlayText: string
  cta: string
  headlineOptions?: string[]
  overlayOptions?: string[]
  ctaOptions: string[]
}

export function ImageEditorWithData({
  imageUrl,
  headline,
  overlayText,
  cta,
  headlineOptions,
  overlayOptions,
  ctaOptions,
}: ImageEditorWithDataProps) {
  const safeHeadlineOptions =
    Array.isArray(headlineOptions) && headlineOptions.length > 0
      ? headlineOptions
      : [headline]
  const safeOverlayOptions =
    Array.isArray(overlayOptions) && overlayOptions.length > 0
      ? overlayOptions
      : [overlayText]
  const safeCtaOptions = Array.isArray(ctaOptions) && ctaOptions.length > 0 ? ctaOptions : [cta]

  return (
    <ImageEditor
      imageUrl={imageUrl}
      headline={headline}
      overlayText={overlayText}
      cta={cta}
      headlineOptions={safeHeadlineOptions}
      overlayOptions={safeOverlayOptions}
      ctaOptions={safeCtaOptions}
    />
  )
}
