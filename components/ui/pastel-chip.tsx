import { cn } from "@/lib/utils";
import {
  getPastelChipStyle,
  getResourceTypeChipStyle,
  type PastelChipStyle,
} from "@/lib/chip-colors";

interface PastelChipProps {
  label: string;
  className?: string;
  style?: PastelChipStyle;
  resourceType?: string;
}

export function PastelChip({
  label,
  className,
  style,
  resourceType,
}: PastelChipProps) {
  const colors =
    style ??
    (resourceType ? getResourceTypeChipStyle(resourceType) : getPastelChipStyle(label));

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors.bg,
        colors.text,
        className,
      )}
    >
      {label}
    </span>
  );
}
