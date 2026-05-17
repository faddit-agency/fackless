import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SITE_TAGLINE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-muted/30">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3 md:col-span-1">
          <Link href="/" className="inline-flex">
            <BrandLogo className="h-[1.225rem]" />
          </Link>
          <p className="text-sm text-muted-foreground">{SITE_TAGLINE}</p>
        </div>
        <FooterColumn
          title="콘텐츠"
          links={[
            { label: "뉴스", href: "/news" },
            { label: "실무 콘텐츠", href: "/articles" },
            { label: "무료 자료실", href: "/resources" },
          ]}
        />
        <FooterColumn
          title="커뮤니티"
          links={[
            { label: "질문 게시판", href: "/community/questions" },
            { label: "피드백 게시판", href: "/community/feedback" },
            { label: "네트워킹 게시판", href: "/community/networking" },
          ]}
        />
        <FooterColumn
          title="패클스"
          links={[
            { label: "부트캠프", href: "/bootcamp" },
            { label: "패딧 바로가기", href: "/faddit" },
            { label: "운영 정책", href: "/policy" },
          ]}
        />
      </div>
      <div className="border-t">
        <div className="container py-4 text-xs text-muted-foreground flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PACKLESS. All rights reserved.</p>
          <p>패션 브랜드 실무 커뮤니티 · 문의 hello@packless.app</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">{title}</p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.href}>
            <Link className="hover:text-foreground" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
