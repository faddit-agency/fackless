import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";

export default async function MeRedirect() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirectTo=/me");
  redirect(`/profile/${profile.user_id}`);
}
