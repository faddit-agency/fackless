import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function ensureAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) throw new Error("관리자 권한이 필요합니다.");

  return { supabase, user, profile };
}
