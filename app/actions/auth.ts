"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { safeInternalPath } from "@/lib/safe-internal-path";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function rawValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

async function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    const url = new URL(configured);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS");
    }
    return url.origin;
  }
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (!host || !/^[a-z0-9.-]+(?::[0-9]{1,5})?$/i.test(host)) {
    throw new Error("Unable to determine the application URL");
  }
  const local = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  return `${local ? "http" : "https"}://${host}`;
}

export async function signUp(formData: FormData) {
  const name = value(formData, "name");
  const email = value(formData, "email").toLowerCase();
  const password = rawValue(formData, "password");
  if (!hasSupabaseConfig()) redirect("/register?error=setup");
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    redirect("/register?error=validation");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name },
      emailRedirectTo: (await siteUrl()) + "/auth/callback",
    },
  });
  if (error) redirect("/register?error=signup");
  if (data.session) redirect("/dashboard");
  redirect("/register?success=confirm");
}

export async function requestPasswordReset(formData: FormData) {
  const email = value(formData, "email").toLowerCase();
  if (!hasSupabaseConfig()) redirect("/forgot-password?error=setup");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect("/forgot-password?error=email");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: (await siteUrl()) + "/auth/callback?next=/account/reset-password",
  });
  if (error) redirect("/forgot-password?error=send");
  redirect("/forgot-password?success=sent");
}

export async function updatePassword(formData: FormData) {
  const password = rawValue(formData, "password");
  if (!hasSupabaseConfig()) redirect("/account/reset-password?error=setup");
  if (password.length < 8) redirect("/account/reset-password?error=password");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=reset-session");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect("/account/reset-password?error=update");
  redirect("/account/reset-password?success=updated");
}

export async function signIn(formData: FormData) {
  const email = value(formData, "email").toLowerCase();
  const password = rawValue(formData, "password");
  const requestedNext = value(formData, "next");
  const next = safeInternalPath(requestedNext);
  if (!hasSupabaseConfig()) redirect("/login?error=setup");
  if (!email || !password) redirect("/login?error=validation");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=credentials");
  redirect(next);
}

export async function signOut() {
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
