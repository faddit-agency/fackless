"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z
    .string()
    .min(1, "아이디(이메일)를 입력해주세요")
    .email("이메일 형식으로 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
  redirectTo: z.string().optional(),
});

export type LoginResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

export async function emailLogin(formData: FormData): Promise<LoginResult> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo") ?? "/",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
    };
  }
  const supabase = createClient();
  const email = parsed.data.email.trim().toLowerCase();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });
  if (error) {
    return { ok: false, error: "아이디(이메일) 또는 비밀번호가 올바르지 않습니다." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인에 실패했습니다." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_onboarded")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    ok: true,
    redirectTo: profile?.is_onboarded
      ? parsed.data.redirectTo || "/"
      : "/onboarding",
  };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
