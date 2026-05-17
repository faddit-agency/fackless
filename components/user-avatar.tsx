import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  nickname?: string | null;
  avatarUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

function getInitial(nickname?: string | null): string {
  if (!nickname) return "P";
  const trimmed = nickname.trim();
  if (!trimmed) return "P";
  return Array.from(trimmed)[0]?.toUpperCase() ?? "P";
}

export function UserAvatar({
  nickname,
  avatarUrl,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("bg-[#181818]", className)}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={nickname ?? "프로필"} />
      ) : null}
      <AvatarFallback
        className={cn(
          "bg-[#181818] text-white font-semibold uppercase",
          fallbackClassName,
        )}
      >
        {getInitial(nickname)}
      </AvatarFallback>
    </Avatar>
  );
}
