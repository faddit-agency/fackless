"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateApplicationStatus(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!me?.is_admin) throw new Error("관리자 권한이 필요합니다.");

  const id = formData.get("application_id") as string;
  const status = formData.get("status") as string;
  if (!id || !status) return;

  await supabase
    .from("bootcamp_applications")
    .update({
      status: status as "pending" | "contacted" | "accepted" | "rejected",
    })
    .eq("id", id);
  revalidatePath("/admin/bootcamp-applications");
}
