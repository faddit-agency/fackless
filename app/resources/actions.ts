"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function recordResourceDownload(
  resourceId: string,
): Promise<{ success: boolean; url?: string | null; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_onboarded")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile?.is_onboarded) {
    return { success: false, error: "온보딩을 먼저 완료해주세요." };
  }

  const { data: resource, error: resourceError } = await supabase
    .from("resources")
    .select("id, file_url, external_url, download_count, is_published")
    .eq("id", resourceId)
    .maybeSingle();
  if (resourceError || !resource || !resource.is_published) {
    return { success: false, error: "자료를 찾을 수 없습니다." };
  }

  const { error: logError } = await supabase
    .from("resource_downloads")
    .insert({ user_id: user.id, resource_id: resource.id });
  if (logError) {
    console.error("[recordResourceDownload:log]", logError);
  }

  await supabase
    .from("resources")
    .update({ download_count: (resource.download_count ?? 0) + 1 })
    .eq("id", resource.id);

  revalidatePath(`/resources/${resource.id}`);

  const url = resource.file_url ?? resource.external_url;
  return { success: true, url };
}
