import { randomUUID } from "crypto"
import { NextResponse } from "next/server"

type GenerateRequestBody = {
  prompt: string
  platform: string
  reference_image_base64?: string
}

type GenerateWebhookPayload = GenerateRequestBody & {
  job_id: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateRequestBody
    const { prompt, platform, reference_image_base64 } = body

    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (!webhookUrl) {
      throw new Error("N8N_WEBHOOK_URL is not configured")
    }

    const job_id = randomUUID()
    const payload: GenerateWebhookPayload = {
      job_id,
      prompt,
      platform,
      ...(reference_image_base64 ? { reference_image_base64 } : {}),
    }

    // Fire-and-forget webhook call. n8n continues processing asynchronously.
    void fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      console.error("Failed to trigger n8n webhook:", error)
    })

    return NextResponse.json({ job_id })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ message }, { status: 500 })
  }
}
