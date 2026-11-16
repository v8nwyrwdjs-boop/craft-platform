import { NextResponse } from "next/server";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const parsed = new URL(request.url);
  const code = parsed.searchParams.get("code");
  const next = parsed.searchParams.get("next") ?? "/dashboard";
  if (!hasSupabaseConfig() || !code) return NextResponse.redirect(new URL("/login?error=callback", parsed.origin));

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/login?error=callback", parsed.origin));
  return NextResponse.redirect(new URL(next.startsWith("/") ? next : "/dashboard", parsed.origin));
}
