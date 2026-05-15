"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BRAND_INTERESTS,
  BRAND_STAGES,
  DESIGNER_SPECIALTIES,
  FACTORY_ITEMS,
  PATTERN_ITEMS,
  ROLE_TYPES,
  type RoleType,
} from "@/lib/constants";
import { completeOnboarding } from "./actions";
import { cn } from "@/lib/utils";
import { AvatarUploader } from "./avatar-uploader";

const COMMON_INTERESTS = [
  "원단",
  "공장",
  "작업지시서",
  "원가",
  "브랜딩",
  "마케팅",
  "샘플",
  "정부지원",
];

interface Props {
  userId: string;
  initial: {
    nickname: string;
    avatar_url: string;
    bio: string;
    region: string;
    website_url: string;
    interests: string[];
    role_type: RoleType;
  };
}

export function OnboardingForm({ userId, initial }: Props) {
  const [role, setRole] = useState<RoleType>(initial.role_type);
  const [nickname, setNickname] = useState(initial.nickname);

  return (
    <form action={completeOnboarding} className="space-y-8">
      <input type="hidden" name="role_type" value={role} />

      <section className="space-y-3">
        <Label className="text-sm font-semibold">직군 선택</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {ROLE_TYPES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRole(option.value)}
              className={cn(
                "rounded-xl border px-3 py-3 text-sm font-medium transition",
                role === option.value
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "hover:border-foreground/30",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold">공통 정보</h2>
        <div className="space-y-1.5">
          <Label className="text-sm">프로필 이미지</Label>
          <AvatarUploader
            userId={userId}
            initialUrl={initial.avatar_url}
            nickname={nickname}
          />
        </div>
        <Field label="닉네임" required>
          <Input
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="패클스에서 사용할 닉네임"
            required
            minLength={2}
            maxLength={24}
          />
        </Field>
        <Field label="소개">
          <Textarea
            name="bio"
            defaultValue={initial.bio}
            placeholder="자기소개를 적어주세요."
          />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="지역">
            <Input
              name="region"
              defaultValue={initial.region}
              placeholder="서울 / 동대문 등"
            />
          </Field>
          <Field label="웹사이트/포트폴리오">
            <Input
              name="website_url"
              defaultValue={initial.website_url}
              placeholder="https://..."
            />
          </Field>
        </div>
        <ChipMultiSelect
          name="interests"
          label="관심 분야"
          options={COMMON_INTERESTS}
          initial={initial.interests}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold">{labelOf(role)} 추가 정보</h2>
        {role === "designer" && <DesignerFields />}
        {role === "pattern_maker" && <PatternFields />}
        {role === "factory" && <FactoryFields />}
        {role === "brand" && <BrandFields />}
        {role === "general" && <GeneralFields />}
      </section>

      <SubmitButton />
    </form>
  );
}

function labelOf(role: RoleType) {
  return ROLE_TYPES.find((r) => r.value === role)?.label ?? "";
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      variant="accent"
      disabled={pending}
      className="w-full md:w-auto"
    >
      {pending ? "저장 중..." : "패클스 시작하기"}
    </Button>
  );
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required ? <span className="text-destructive ml-1">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function ChipMultiSelect({
  name,
  label,
  options,
  initial,
}: {
  name: string;
  label: string;
  options: readonly string[];
  initial: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initial);

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:border-foreground/30",
              )}
            >
              #{option}
            </button>
          );
        })}
      </div>
      {selected.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
    </div>
  );
}

function DesignerFields() {
  return (
    <div className="space-y-4">
      <ChipMultiSelect
        name="specialty"
        label="전문 분야"
        options={DESIGNER_SPECIALTIES}
        initial={[]}
      />
      <Field label="포트폴리오 링크">
        <Input name="portfolio_url" placeholder="https://..." />
      </Field>
      <CheckboxField
        name="collaboration_available"
        label="협업/외주 가능"
      />
    </div>
  );
}

function PatternFields() {
  return (
    <div className="space-y-4">
      <ChipMultiSelect
        name="specialty_items"
        label="전문 품목"
        options={PATTERN_ITEMS}
        initial={[]}
      />
      <Field label="경력 (년)">
        <Input name="experience_years" type="number" min={0} max={50} />
      </Field>
      <CheckboxField name="sample_available" label="샘플 제작 가능" />
    </div>
  );
}

function FactoryFields() {
  return (
    <div className="space-y-4">
      <Field label="위치">
        <Input name="location" placeholder="예: 서울 성수, 의정부" />
      </Field>
      <ChipMultiSelect
        name="available_items"
        label="가능 품목"
        options={FACTORY_ITEMS}
        initial={[]}
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="최소 수량 (MOQ)">
          <Input name="moq" type="number" min={0} placeholder="예: 50" />
        </Field>
      </div>
      <Field label="주요 설비">
        <Textarea name="equipment" placeholder="보유 설비를 간단히 적어주세요." />
      </Field>
      <CheckboxField name="sample_available" label="샘플 제작 가능" />
    </div>
  );
}

function BrandFields() {
  return (
    <div className="space-y-4">
      <Field label="브랜드 단계">
        <select
          name="brand_stage"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          defaultValue=""
        >
          <option value="">선택해주세요</option>
          {BRAND_STAGES.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </select>
      </Field>
      <ChipMultiSelect
        name="brand_interests"
        label="관심 분야 (브랜드)"
        options={BRAND_INTERESTS}
        initial={[]}
      />
      <Field label="제작 예정 품목 (쉼표로 구분)">
        <Input
          name="planned_items"
          placeholder="예: 셔츠, 후드"
          onChange={(e) => {
            const wrapper = e.currentTarget.parentElement;
            if (!wrapper) return;
            wrapper
              .querySelectorAll("input[type=hidden][data-source=planned_items]")
              .forEach((node) => node.remove());
            e.currentTarget.value
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean)
              .forEach((value) => {
                const hidden = document.createElement("input");
                hidden.type = "hidden";
                hidden.name = "planned_items";
                hidden.value = value;
                hidden.dataset.source = "planned_items";
                wrapper.appendChild(hidden);
              });
          }}
        />
      </Field>
    </div>
  );
}

function GeneralFields() {
  return (
    <div className="space-y-3">
      <CheckboxField name="startup_planning" label="패션 창업을 준비 중입니다" />
      <CheckboxField name="newsletter_opt_in" label="실무 자료 수신 동의" />
    </div>
  );
}

function CheckboxField({ name, label }: { name: string; label: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => setChecked(value === true)}
      />
      <input
        type="hidden"
        name={name}
        value={checked ? "true" : "false"}
      />
      <span>{label}</span>
    </label>
  );
}
