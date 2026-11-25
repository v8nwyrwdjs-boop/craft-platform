"use server";

import { redirect } from "next/navigation";
import { productBySlug } from "@/lib/catalog";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import type { WaitlistState } from "@/lib/waitlist";

/**
 * Запись в список: создаёт заявку enrollments(status = 'pending'). Заявка доступа не даёт:
 * уроки, сдачи и прогресс требуют status = 'active', а менять статус может только администратор.
 * Политика на вставку описана в supabase/migrations/202611250001_waitlist_pending_enrollment.sql;
 * пока владелец её не применил, ответ честный: "setup", а не выдуманный успех.
 */
export async function joinWaitlist(_previous: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const slug = String(formData.get("product") ?? "");
  const product = productBySlug(slug);
  if (!product || product.status === "idea") return { status: "error" };
  if (!hasSupabaseConfig()) return { status: "setup" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/products/${product.slug}`)}`);

  const { error } = await supabase.from("enrollments").insert({ student_id: user.id, program_slug: product.slug, status: "pending" });
  if (!error) return { status: "ok" };
  if (error.code === "23505") return { status: "already" };
  if (error.code === "42501") return { status: "setup" };
  return { status: "error" };
}
