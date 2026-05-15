import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageSquareWarning,
  PackageOpen,
  Users,
} from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/users", label: "회원 관리", icon: Users },
  { href: "/admin/posts", label: "게시글 관리", icon: FileText },
  { href: "/admin/resources", label: "자료실 관리", icon: PackageOpen },
  {
    href: "/admin/bootcamp-applications",
    label: "부트캠프 신청",
    icon: GraduationCap,
  },
  { href: "/admin/reports", label: "신고 관리", icon: MessageSquareWarning },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirectTo=/admin");
  if (!profile.is_admin) redirect("/");

  return (
    <div className="container py-8 grid gap-6 md:grid-cols-[220px,1fr]">
      <aside className="md:sticky md:top-20 md:self-start">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">
          ADMIN
        </p>
        <nav className="space-y-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
