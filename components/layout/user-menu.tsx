"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import type { HeaderProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { ROLE_TYPE_LABEL } from "@/lib/constants";

export function UserMenu({ profile }: { profile: HeaderProfile }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring">
        <UserAvatar
          nickname={profile.nickname}
          avatarUrl={profile.avatar_url}
          className="h-8 w-8"
          fallbackClassName="text-xs"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold">{profile.nickname}</p>
          <p className="text-xs text-muted-foreground">
            {ROLE_TYPE_LABEL[profile.role_type]}
            {profile.is_verified_expert ? " · 전문가" : ""}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/profile/${profile.user_id}`}>내 프로필</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/community/questions/new">질문 작성</Link>
        </DropdownMenuItem>
        {profile.is_admin ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">관리자</Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
