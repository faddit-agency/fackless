import Link from "next/link";
import { Download, FileSpreadsheet, FileText, Figma, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/database.types";
import { formatNumber } from "@/lib/utils";

const ICONS = {
  pdf: FileText,
  excel: FileSpreadsheet,
  figma: Figma,
  notion: FileText,
  link: Link2,
  faddit_template: FileText,
};

const TYPE_LABEL: Record<Resource["resource_type"], string> = {
  pdf: "PDF",
  excel: "Excel",
  figma: "Figma",
  notion: "Notion",
  link: "링크",
  faddit_template: "패딧 템플릿",
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = ICONS[resource.resource_type] ?? FileText;
  return (
    <Link
      href={`/resources/${resource.id}`}
      className="group block rounded-xl border bg-card p-5 transition hover:border-foreground/20 hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="soft">{TYPE_LABEL[resource.resource_type]}</Badge>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatNumber(resource.download_count)}
            </span>
          </div>
          <h3 className="mt-2 font-semibold leading-snug line-clamp-2">
            {resource.title}
          </h3>
          {resource.description ? (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {resource.description}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
