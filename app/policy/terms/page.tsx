import { PolicyDocument } from "@/components/legal/policy-document";
import { PageHero } from "@/components/layout/page-shell";
import { TERMS_OF_SERVICE } from "@/lib/legal-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "이용약관",
  description: "FACKLESS(패클스) 서비스 이용약관",
  path: "/policy/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="POLICY" title="이용약관" align="left" />
      <PolicyDocument
        title={TERMS_OF_SERVICE.title}
        sections={TERMS_OF_SERVICE.sections}
        hideHeader
      />
    </>
  );
}
