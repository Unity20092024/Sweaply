import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authConfig } from "@/lib/supabase/config";
import { safeNext } from "@/lib/auth/validation";
export async function GET(request: NextRequest) {
  const config = authConfig();
  const code = request.nextUrl.searchParams.get("code");
  let destination = "/sign-in?notice=link-invalid";
  if (config && code) {
    try {
      const client = await createClient();
      const { error } = await client.auth.exchangeCodeForSession(code);
      if (!error)
        destination = safeNext(request.nextUrl.searchParams.get("next"));
    } catch {
      /* Fail closed on expired, forged, or consumed codes. */
    }
  }
  const response = config
    ? NextResponse.redirect(new URL(destination, config.site))
    : new NextResponse(null, {
        status: 303,
        headers: { Location: destination },
      });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
