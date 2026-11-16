"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

const allowedOrigins = new Set(["own_idea", "direction", "concept"]);

export async function saveCatalogProject(formData: FormData) {
  if (!hasSupabaseConfig()) redirect("/register?error=setup");
  const originType = String(formData.get("origin_type") ?? "");
  const originSlug = String(formData.get("origin_slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!allowedOrigins.has(originType) || !/^[a-zA-Z0-9_-]{2,40}$/.test(originSlug) || title.length < 3 || title.length > 140) {
    redirect("/directions?error=invalid-project");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { error } = await supabase.from("student_projects").insert({
    student_id: user.id,
    title,
    origin_type: originType,
    origin_slug: originSlug,
  });
  if (error) redirect("/dashboard?error=save");
  revalidatePath("/dashboard");
  redirect("/dashboard?saved=1");
}

export async function createOwnProject(formData: FormData) {
  if (!hasSupabaseConfig()) redirect("/register?error=setup");
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 3 || title.length > 140) redirect("/dashboard?error=title");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");
  const { error } = await supabase.from("student_projects").insert({
    student_id: user.id,
    title,
    origin_type: "own_idea",
    origin_slug: null,
  });
  if (error) redirect("/dashboard?error=save");
  revalidatePath("/dashboard");
  redirect("/dashboard?saved=1");
}
