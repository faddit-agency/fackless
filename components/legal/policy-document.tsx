import Link from "next/link";
import { LEGAL_LAST_UPDATED } from "@/lib/legal-content";

interface PolicySection {
  heading: string;
  body: string;
}

interface PolicyDocumentProps {
  title: string;
  intro?: string;
  sections: PolicySection[];
  hideHeader?: boolean;
}

export function PolicyDocument({
  title,
  intro,
  sections,
  hideHeader,
}: PolicyDocumentProps) {
  return (
    <div className="container py-8 md:py-10 pb-14">
      {!hideHeader ? (
        <header className="mb-10 space-y-3 border-b pb-8">
          <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            FACKLESS
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {intro ? (
            <p className="text-sm md:text-base text-muted-foreground leading-[1.3]">
              {intro}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">시행일: {LEGAL_LAST_UPDATED}</p>
        </header>
      ) : (
        <p className="text-xs text-muted-foreground mb-8">시행일: {LEGAL_LAST_UPDATED}</p>
      )}

      {hideHeader && intro ? (
        <p className="text-sm md:text-base text-muted-foreground leading-[1.3] mb-8">
          {intro}
        </p>
      ) : null}

      <article className="prose-fackless whitespace-pre-line">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>

      <footer className="mt-12 pt-6 border-t text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/policy/terms" className="hover:text-foreground underline">
          이용약관
        </Link>
        <Link href="/policy/privacy" className="hover:text-foreground underline">
          개인정보처리방침
        </Link>
        <Link href="/" className="hover:text-foreground">
          홈으로
        </Link>
      </footer>
    </div>
  );
}
