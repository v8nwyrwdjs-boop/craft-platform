"use server";

import { redirect } from "next/navigation";
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
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if ((url.protocol !== "https:" && !isLocal) || url.username || url.password) {
      throw new Error("NEXT_PUBLIC_SITE_URL must be a valid HTTPS origin");
    }
    return url.origin;
  }

  // Vercel provides a deployment-specific hostname. Do not trust the incoming
  // Host / X-Forwarded-Host headers for security-sensitive email links.
  const deploymentHost = process.env.VERCEL_URL;
  if (deploymentHost && /^[a-z0-9.-]+$/i.test(deploymentHost)) {
    return `https://${deploymentHost}`;
  }

  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  throw new Error("Set NEXT_PUBLIC_SITE_URL or deploy on Vercel before sending auth emails");
}

export async function signUp(formData: FormData) {
  const name = value(formData, "name");
  const email = value(formData, "email").toLowerCase();
  const password = rawValue(formData, "password");
  if (!hasSupabaseConfig()) redirect("/register?error=setup");
  if (name.length < 2 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || password.length < 8) {
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
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) redirect("/forgot-password?error=email");
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
