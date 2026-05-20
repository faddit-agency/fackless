"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const schema = z
  .object({
    email: z
      .string()
      .min(1, "아이디(이메일)를 입력해주세요")
      .email("이메일 형식으로 입력해주세요"),
    password: z
      .string()
      .min(6, "비밀번호는 최소 6자 이상")
      .regex(/[a-zA-Z]/, "알파벳을 포함해주세요")
      .regex(/[0-9]/, "숫자를 포함해주세요"),
    password_confirm: z.string(),
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
    email: formData.get("email"),
    password: formData.get("password"),
    password_confirm: formData.get("password_confirm"),
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
  const email = normalizeEmail(data.email);
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", email)
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "이미 가입된 이메일입니다." };
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data: signup, error } = await supabase.auth.signUp({
    email,
    password: data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username: email,
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
