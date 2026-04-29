import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ job_id: string }> }
) {
  try {
    const { job_id } = await params
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not configured")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
      .from("generations")
      .select("status, results")
      .eq("job_id", job_id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      status: data?.status ?? "pending",
      results: data?.results ?? null,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ message }, { status: 500 })
  }
}
