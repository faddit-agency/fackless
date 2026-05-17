import "server-only";
import { cache } from "react";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import type { Profile } from "@/lib/database.types";

export const getCurrentUser = cache(async () => {
  if (!hasSupabaseEnv()) return null;
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.warn("[getCurrentUser]", error);
    return null;
  }
});

export type HeaderProfile = Pick<
  Profile,
  | "user_id"
  | "nickname"
  | "avatar_url"
  | "role_type"
  | "is_verified_expert"
  | "is_admin"
>;

/** 헤더·네비용 — getUser 1회 + 최소 컬럼만 조회 */
export const getHeaderProfile = cache(async (): Promise<HeaderProfile | null> => {
  if (!hasSupabaseEnv()) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("profiles")
      .select(
        "user_id, nickname, avatar_url, role_type, is_verified_expert, is_admin",
      )
      .eq("user_id", user.id)
      .maybeSingle();
    return (data as HeaderProfile) ?? null;
  } catch (error) {
    console.warn("[getHeaderProfile]", error);
    return null;
  }
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!hasSupabaseEnv()) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    return (data as Profile) ?? null;
  } catch (error) {
    console.warn("[getCurrentProfile]", error);
    return null;
  }
});
