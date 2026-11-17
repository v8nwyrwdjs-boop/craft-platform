"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { isValidLessonSlug } from "@/lib/curriculum";

export async function completeLesson(formData: FormData) {
  if (!hasSupabaseConfig()) redirect("/login");
  const lessonSlug = String(formData.get("lesson_slug") ?? "");
  const programSlug = "craft-foundation";
  if (!isValidLessonSlug(lessonSlug)) redirect("/learn?error=lesson");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: enrollment } = await supabase.from("enrollments").select("id").eq("student_id", user.id).eq("program_slug", programSlug).eq("status", "active").maybeSingle();
  if (!enrollment) redirect("/learn?locked=1");
  const { error } = await supabase.from("lesson_progress").upsert({
    student_id: user.id,
    program_slug: programSlug,
    lesson_slug: lessonSlug,
    status: "completed",
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "student_id,program_slug,lesson_slug" });
  if (error) redirect("/learn?error=progress");
  revalidatePath("/learn");
  redirect("/learn?completed=1");
}
