"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z
  .object({
    username: z
      .string()
      .min(4, "아이디는 4자 이상")
      .max(15, "아이디는 15자 이내")
      .regex(/^[a-zA-Z0-9_]+$/, "아이디는 영문/숫자/언더스코어만 가능합니다"),
    password: z
      .string()
      .min(6, "비밀번호는 최소 6자 이상")
      .regex(/[a-zA-Z]/, "알파벳을 포함해주세요")
      .regex(/[0-9]/, "숫자를 포함해주세요"),
    password_confirm: z.string(),
    email: z.string().email("이메일 형식이 올바르지 않습니다"),
    real_name: z.string().min(2, "실명을 입력해주세요").max(40),
    nickname: z
      .string()
      .min(2, "닉네임은 2자 이상")
      .max(20, "닉네임은 20자 이내"),
    terms_agreed: z.literal("true", {
      errorMap: () => ({ message: "약관에 동의해주세요" }),
    }),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["password_confirm"],
  });

export type SignupResult =
  | { ok: true; needsEmailConfirm: boolean }
  | { ok: false; error: string };

export async function emailSignup(formData: FormData): Promise<SignupResult> {
  const parsed = schema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    password_confirm: formData.get("password_confirm"),
    email: formData.get("email"),
    real_name: formData.get("real_name"),
    nickname: formData.get("nickname"),
    terms_agreed: formData.get("terms_agreed") === "true" ? "true" : "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.",
    };
  }
  const data = parsed.data;
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", data.username)
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "이미 사용 중인 아이디입니다." };
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data: signup, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username: data.username,
        nickname: data.nickname,
        real_name: data.real_name,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("registered")) {
      return { ok: false, error: "이미 가입된 이메일입니다." };
    }
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    needsEmailConfirm: !signup.session,
  };
}
