"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

const DEBOUNCE_MS = 350;

interface LiveSearchInputProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
  /** url: URL q 파라미터 갱신(디바운스), local: 부모 state만 갱신 */
  mode?: "url" | "local";
  onQueryChange?: (query: string) => void;
}

export function LiveSearchInput({
  initialValue = "",
  placeholder = "검색",
  className,
  mode = "url",
  onQueryChange,
}: LiveSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const applyQuery = (nextValue: string) => {
    if (mode === "local") {
      onQueryChange?.(nextValue);
      return;
    }

    const trimmed = nextValue.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    if (mode === "local") {
      onQueryChange?.(nextValue);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => applyQuery(nextValue), DEBOUNCE_MS);
  };

  return (
    <div className={className}>
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
    </div>
  );
}
