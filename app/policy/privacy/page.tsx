import { PolicyDocument } from "@/components/legal/policy-document";
import { PageHero } from "@/components/layout/page-shell";
import { PRIVACY_POLICY } from "@/lib/legal-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "개인정보처리방침",
  description: "FACKLESS(패클스) 개인정보처리방침",
  path: "/policy/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="POLICY" title="개인정보처리방침" align="left" />
      <PolicyDocument
        title={PRIVACY_POLICY.title}
        intro={PRIVACY_POLICY.intro}
        sections={PRIVACY_POLICY.sections}
        hideHeader
      />
    </>
  );
}
