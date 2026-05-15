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

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!hasSupabaseEnv()) return null;
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
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
