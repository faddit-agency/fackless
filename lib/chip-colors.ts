/** 파스텔 칩 — 옅은 배경 + 같은 계열 텍스트 */
export const PASTEL_CHIP_PALETTE = [
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-cyan-100", text: "text-cyan-800" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
  { bg: "bg-lime-100", text: "text-lime-800" },
  { bg: "bg-pink-100", text: "text-pink-700" },
] as const;

export type PastelChipStyle = {
  bg: string;
  text: string;
};

const RESOURCE_TYPE_CHIPS: Record<string, PastelChipStyle> = {
  pdf: { bg: "bg-rose-100", text: "text-rose-700" },
  excel: { bg: "bg-emerald-100", text: "text-emerald-700" },
  figma: { bg: "bg-fuchsia-100", text: "text-fuchsia-700" },
  notion: { bg: "bg-slate-100", text: "text-slate-700" },
  link: { bg: "bg-sky-100", text: "text-sky-700" },
  faddit_template: { bg: "bg-amber-100", text: "text-amber-800" },
};

function hashLabel(label: string): number {
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash * 31 + label.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getPastelChipStyle(label: string): PastelChipStyle {
  const normalized = label.trim().toLowerCase();
  const index = hashLabel(normalized) % PASTEL_CHIP_PALETTE.length;
  return PASTEL_CHIP_PALETTE[index]!;
}

export function getResourceTypeChipStyle(resourceType: string): PastelChipStyle {
  return RESOURCE_TYPE_CHIPS[resourceType] ?? getPastelChipStyle(resourceType);
}

/** 콘텐츠 목록 카드 공통 배경 */
export const CONTENT_CARD_CLASS =
  "block rounded-xl bg-muted/40 p-5 transition hover:bg-muted/55 hover:shadow-sm";
