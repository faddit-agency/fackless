"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().min(2).max(40),
  phone: z.string().min(8).max(20),
  email: z.string().email(),
  role_type: z.enum([
    "designer",
    "pattern_maker",
    "factory",
    "brand",
    "general",
  ]),
  brand_stage: z.string().max(40).optional().or(z.literal("")),
  pain_point: z.string().max(2000).optional().or(z.literal("")),
  privacy_agreed: z.literal("true"),
});

export type ApplyResult =
  | { ok: true }
  | { ok: false; error: string };

export async function applyBootcamp(formData: FormData): Promise<ApplyResult> {
  const parse = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    role_type: formData.get("role_type"),
    brand_stage: formData.get("brand_stage") ?? "",
    pain_point: formData.get("pain_point") ?? "",
    privacy_agreed: formData.get("privacy_agreed") === "true" ? "true" : "",
  });
  if (!parse.success) {
    const issue = parse.error.issues[0];
    return {
      ok: false,
      error: issue?.message ?? "입력값을 확인해주세요.",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("bootcamp_applications").insert({
    user_id: user?.id ?? null,
    name: parse.data.name,
    phone: parse.data.phone,
    email: parse.data.email,
    role_type: parse.data.role_type,
    brand_stage: parse.data.brand_stage || null,
    pain_point: parse.data.pain_point || null,
    privacy_agreed: true,
  });
  if (error) {
    console.error("[applyBootcamp]", error);
    return { ok: false, error: "신청 처리 중 오류가 발생했습니다." };
  }

  return { ok: true };
}
