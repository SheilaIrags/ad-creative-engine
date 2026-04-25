import { NextResponse } from "next/server";

type GenerateRequestBody = {
  prompt: string;
  platform: string;
  reference_image_base64?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateRequestBody;
    const { prompt, platform, reference_image_base64 } = body;

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("N8N_WEBHOOK_URL is not configured");
    }

    const payload: GenerateRequestBody = {
      prompt,
      platform,
      ...(reference_image_base64 ? { reference_image_base64 } : {}),
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
