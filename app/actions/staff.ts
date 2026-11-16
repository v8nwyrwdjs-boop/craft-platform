"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

async function staffContext(adminOnly = false) {
  if (!hasSupabaseConfig()) redirect("/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const role = user.app_metadata?.role;
  if (adminOnly ? role !== "admin" : !["admin", "mentor"].includes(role)) redirect("/dashboard");
  return { supabase, user };
}

export async function reviewSubmission(formData: FormData) {
  const { supabase, user } = await staffContext();
  const submissionId = String(formData.get("submission_id") ?? "");
  const body = String(formData.get("feedback") ?? "").trim();
  const status = String(formData.get("status") ?? "reviewing");
  if (!/^[0-9a-f-]{36}$/i.test(submissionId) || body.length < 2 || body.length > 10000 || !["reviewing", "revision_requested", "accepted"].includes(status)) {
    redirect("/admin?error=review");
  }

  const { data: submission } = await supabase.from("assignment_submissions").select("id,student_id").eq("id", submissionId).maybeSingle();
  if (!submission) redirect("/admin?error=missing");

  const { error: feedbackError } = await supabase.from("mentor_feedback").insert({
    submission_id: submission.id,
    student_id: submission.student_id,
    mentor_id: user.id,
    body,
  });
  if (feedbackError) redirect("/admin?error=feedback");

  const { error: statusError } = await supabase.from("assignment_submissions").update({ status }).eq("id", submission.id);
  if (statusError) redirect("/admin?error=status");
  revalidatePath("/admin");
  redirect("/admin?reviewed=1");
}

export async function activateEnrollment(formData: FormData) {
  const { supabase } = await staffContext(true);
  const studentId = String(formData.get("student_id") ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(studentId)) redirect("/admin?error=student-id");
  const { error } = await supabase.from("enrollments").upsert({
    student_id: studentId,
    program_slug: "craft-foundation",
    status: "active",
  }, { onConflict: "student_id,program_slug" });
  if (error) redirect("/admin?error=enrollment");
  revalidatePath("/admin");
  redirect("/admin?enrolled=1");
}
