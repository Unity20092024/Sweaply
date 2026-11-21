import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authConfig } from "@/lib/supabase/config";
export async function GET(request: NextRequest) {
  const config = authConfig();
  const token = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  let destination = "/sign-in?notice=link-invalid";
  if (config && token && (type === "email" || type === "recovery")) {
    try {
      const client = await createClient();
      const { error } = await client.auth.verifyOtp({
        token_hash: token,
        type,
      });
      if (!error)
        destination = type === "recovery" ? "/reset-password" : "/account";
    } catch {
      /* Fail closed; never forward a token or untrusted destination. */
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
