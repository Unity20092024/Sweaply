import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = authConfig();
  if (config) {
    const client = createServerClient(config.url, config.key, {
      cookieOptions: {
        httpOnly: true,
        secure: config.secure,
        sameSite: "lax",
        path: "/",
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values, headers) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          if (headers)
            Object.entries(headers).forEach(([key, value]) =>
              response.headers.set(key, value),
            );
        },
      },
    });
    // Refresh/verify signatures, never authorize from an unverified getSession().
    try {
      await client.auth.getClaims();
    } catch {
      /* Pages/actions independently verify identity and fail closed. */
    }
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
export const config = {
  matcher: [
    "/account/:path*",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/auth/:path*",
  ],
};
