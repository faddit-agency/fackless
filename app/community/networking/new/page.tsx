import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { getCategories } from "@/lib/queries";
import { createPageMetadata } from "@/lib/seo";
import { NetworkingForm } from "./networking-form";

export const metadata = createPageMetadata({
  title: "네트워킹 글 작성",
  path: "/community/networking/new",
  noIndex: true,
});

export default async function NewNetworkingPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirectTo=/community/networking/new");
  if (!profile.is_onboarded) redirect("/onboarding");

  const categories = await getCategories("networking");

  return (
    <div className="container py-10">
      <header className="mb-6 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          NETWORKING
        </p>
        <h1 className="text-2xl md:text-3xl font-bold">네트워킹 글 작성</h1>
        <p className="text-sm text-muted-foreground">
          함께 일할 파트너·동료를 찾는 글을 올려보세요.
        </p>
      </header>
      <NetworkingForm categories={categories} />
    </div>
  );
}

