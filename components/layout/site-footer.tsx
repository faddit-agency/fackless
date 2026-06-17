import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SITE_TAGLINE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <div className="container py-14 md:py-16 grid gap-10 md:grid-cols-4">
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="inline-flex">
            <BrandLogo className="h-[1.225rem]" />
          </Link>
          <p className="text-sm text-muted-foreground leading-[1.3]">
            {SITE_TAGLINE}
          </p>
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
            { label: "회원가입", href: "/signup" },
            { label: "로그인", href: "/login" },
          ]}
        />
      </div>
      <div className="bg-background/80">
        <div className="container py-5 space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <Link href="/policy/terms" className="underline hover:text-foreground">
              이용약관
            </Link>
            <Link href="/policy/privacy" className="underline hover:text-foreground">
              개인정보처리방침
            </Link>
          </div>
          <div className="text-[11px] text-muted-foreground leading-[1.3] space-y-1">
            <p>
              상호명: 패클스(FACKLESS) · 대표 이메일: hello@fackless.app · 문의:
              hello@fackless.app
            </p>
            <p>© {new Date().getFullYear()} FACKLESS. All rights reserved.</p>
          </div>
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
      <p className="text-sm font-bold tracking-tight">{title}</p>
      <ul className="space-y-2.5 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.href}>
            <Link className="hover:text-foreground transition" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
