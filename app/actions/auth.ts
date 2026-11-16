"use server";

import { redirect } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function signUp(formData: FormData) {
  const name = value(formData, "name");
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");
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
      emailRedirectTo: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + "/auth/callback",
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
    redirectTo: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + "/auth/callback?next=/account/reset-password",
  });
  if (error) redirect("/forgot-password?error=send");
  redirect("/forgot-password?success=sent");
}

export async function updatePassword(formData: FormData) {
  const password = value(formData, "password");
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
  const password = value(formData, "password");
  if (!hasSupabaseConfig()) redirect("/login?error=setup");
  if (!email || !password) redirect("/login?error=validation");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=credentials");
  redirect("/dashboard");
}

export async function signOut() {
  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
