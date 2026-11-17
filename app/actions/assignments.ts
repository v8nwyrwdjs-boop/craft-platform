"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { isValidLessonForModule } from "@/lib/curriculum-validation";

export async function submitAssignment(formData: FormData) {
  if (!hasSupabaseConfig()) redirect("/login");
  const lessonSlug = String(formData.get("lesson_slug") ?? "");
  const moduleSlug = String(formData.get("module_slug") ?? "");
  const response = String(formData.get("response") ?? "").trim();
  if (!isValidLessonForModule(lessonSlug, moduleSlug) || response.length < 20 || response.length > 20000) {
    redirect(isValidLessonForModule(lessonSlug, moduleSlug) ? "/learn/" + moduleSlug + "?error=submission" : "/learn?error=lesson");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: enrollment } = await supabase.from("enrollments").select("id").eq("student_id", user.id).eq("program_slug", "craft-foundation").eq("status", "active").maybeSingle();
  if (!enrollment) redirect("/learn?locked=1");

  const { error } = await supabase.from("assignment_submissions").insert({
    student_id: user.id,
    program_slug: "craft-foundation",
    lesson_slug: lessonSlug,
    response,
  });
  if (error) redirect("/learn/" + moduleSlug + "?error=submission");
  revalidatePath("/learn/" + moduleSlug);
  redirect("/learn/" + moduleSlug + "?submitted=1");
}
