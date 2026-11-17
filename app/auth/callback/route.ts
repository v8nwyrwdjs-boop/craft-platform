import { NextResponse } from "next/server";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { safeInternalPath } from "@/lib/safe-internal-path";
import { getSiteOrigin } from "@/lib/site-url";

export async function GET(request: Request) {
  const parsed = new URL(request.url);
  const code = parsed.searchParams.get("code");
  const next = parsed.searchParams.get("next") ?? "/dashboard";
  const siteOrigin = getSiteOrigin();

  if (!hasSupabaseConfig() || !code) {
    return NextResponse.redirect(new URL("/login?error=callback", siteOrigin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=callback", siteOrigin));
  }

  const safeNext = safeInternalPath(next);
  return NextResponse.redirect(new URL(safeNext, siteOrigin));
}
