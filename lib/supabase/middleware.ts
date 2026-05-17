import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function hasSupabaseSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => {
    const name = cookie.name.toLowerCase();
    return (
      name.includes("auth-token") ||
      name.startsWith("sb-") ||
      name.includes("supabase")
    );
  });
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/community/questions/new") ||
    pathname.startsWith("/community/feedback/new") ||
    pathname.startsWith("/community/networking/new");

  const needsProfile =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/onboarding") ||
    (pathname.startsWith("/community") && pathname.includes("/new"));

  // 비로그인 공개 탐색: Supabase 왕복 생략
  if (!isProtected && !needsProfile && !hasSupabaseSessionCookie(request)) {
    return response;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(
            cookiesToSet: { name: string; value: string; options: CookieOptions }[],
          ) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    if (
      user &&
      needsProfile &&
      pathname !== "/onboarding" &&
      !pathname.startsWith("/auth")
    ) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_onboarded, is_admin")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile?.is_onboarded && !pathname.startsWith("/login")) {
        const writeIntents =
          pathname.startsWith("/community") && pathname.includes("/new");
        if (writeIntents || pathname.startsWith("/admin")) {
          const url = request.nextUrl.clone();
          url.pathname = "/onboarding";
          return NextResponse.redirect(url);
        }
      }

      if (pathname.startsWith("/admin") && !profile?.is_admin) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }

    return response;
  } catch (error) {
    console.warn("[middleware] Supabase 호출 실패, 응답을 그대로 통과시킵니다.", error);
    return response;
  }
}
