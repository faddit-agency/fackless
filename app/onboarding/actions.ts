"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const RoleEnum = z.enum([
  "designer",
  "pattern_maker",
  "factory",
  "brand",
  "general",
]);

const baseSchema = z.object({
  nickname: z.string().min(2, "닉네임은 최소 2자 이상").max(24),
  avatar_url: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
  region: z.string().max(60).optional().or(z.literal("")),
  website_url: z.string().url().optional().or(z.literal("")),
  interests: z.array(z.string()).default([]),
  role_type: RoleEnum,
});

const designerSchema = z.object({
  specialty: z.array(z.string()).default([]),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  collaboration_available: z.boolean().default(false),
});

const patternSchema = z.object({
  specialty_items: z.array(z.string()).default([]),
  experience_years: z.coerce.number().int().min(0).default(0),
  sample_available: z.boolean().default(false),
});

const factorySchema = z.object({
  location: z.string().max(80).optional().or(z.literal("")),
  available_items: z.array(z.string()).default([]),
  moq: z.coerce.number().int().min(0).optional(),
  equipment: z.string().max(300).optional().or(z.literal("")),
  sample_available: z.boolean().default(false),
});

const brandSchema = z.object({
  brand_stage: z.string().max(40).optional().or(z.literal("")),
  brand_interests: z.array(z.string()).default([]),
  planned_items: z.array(z.string()).default([]),
});

const generalSchema = z.object({
  startup_planning: z.boolean().default(false),
  newsletter_opt_in: z.boolean().default(false),
});

function parseBool(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true" || value === "1";
}

function parseArray(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .map((v) => String(v))
    .filter(Boolean);
}

export async function completeOnboarding(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/onboarding");

  const base = baseSchema.parse({
    nickname: formData.get("nickname"),
    avatar_url: formData.get("avatar_url") ?? "",
    bio: formData.get("bio") ?? "",
    region: formData.get("region") ?? "",
    website_url: formData.get("website_url") ?? "",
    interests: parseArray(formData, "interests"),
    role_type: formData.get("role_type"),
  });

  const updatePayload = {
    nickname: base.nickname,
    avatar_url: base.avatar_url || null,
    bio: base.bio || null,
    region: base.region || null,
    website_url: base.website_url || null,
    interests: base.interests,
    role_type: base.role_type,
    is_onboarded: true,
    updated_at: new Date().toISOString(),
  };

  const { error: profileError } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("user_id", user.id);
  if (profileError) {
    console.error("[completeOnboarding:profile]", profileError);
    throw new Error("프로필 저장 중 오류가 발생했습니다.");
  }

  if (base.role_type === "designer") {
    const data = designerSchema.parse({
      specialty: parseArray(formData, "specialty"),
      portfolio_url: formData.get("portfolio_url") ?? "",
      collaboration_available: parseBool(formData.get("collaboration_available")),
    });
    await supabase.from("designer_profiles").upsert(
      {
        user_id: user.id,
        specialty: data.specialty,
        portfolio_url: data.portfolio_url || null,
        collaboration_available: data.collaboration_available,
      },
      { onConflict: "user_id" },
    );
  } else if (base.role_type === "pattern_maker") {
    const data = patternSchema.parse({
      specialty_items: parseArray(formData, "specialty_items"),
      experience_years: formData.get("experience_years") ?? 0,
      sample_available: parseBool(formData.get("sample_available")),
    });
    await supabase.from("pattern_maker_profiles").upsert(
      {
        user_id: user.id,
        specialty_items: data.specialty_items,
        experience_years: data.experience_years,
        sample_available: data.sample_available,
      },
      { onConflict: "user_id" },
    );
  } else if (base.role_type === "factory") {
    const data = factorySchema.parse({
      location: formData.get("location") ?? "",
      available_items: parseArray(formData, "available_items"),
      moq: formData.get("moq") ?? undefined,
      equipment: formData.get("equipment") ?? "",
      sample_available: parseBool(formData.get("sample_available")),
    });
    await supabase.from("factory_profiles").upsert(
      {
        user_id: user.id,
        location: data.location || null,
        available_items: data.available_items,
        moq: data.moq ?? null,
        equipment: data.equipment || null,
        sample_available: data.sample_available,
      },
      { onConflict: "user_id" },
    );
  } else if (base.role_type === "brand") {
    const data = brandSchema.parse({
      brand_stage: formData.get("brand_stage") ?? "",
      brand_interests: parseArray(formData, "brand_interests"),
      planned_items: parseArray(formData, "planned_items"),
    });
    await supabase.from("brand_profiles").upsert(
      {
        user_id: user.id,
        brand_stage: data.brand_stage || null,
        interests: data.brand_interests,
        planned_items: data.planned_items,
      },
      { onConflict: "user_id" },
    );
  } else {
    const data = generalSchema.parse({
      startup_planning: parseBool(formData.get("startup_planning")),
      newsletter_opt_in: parseBool(formData.get("newsletter_opt_in")),
    });
    await supabase.from("general_profiles").upsert(
      {
        user_id: user.id,
        interests: base.interests,
        startup_planning: data.startup_planning,
        newsletter_opt_in: data.newsletter_opt_in,
      },
      { onConflict: "user_id" },
    );
  }

  revalidatePath("/");
  redirect("/");
}
