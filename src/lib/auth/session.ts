import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const requireCustomer = cache(async () => {
  const client = await createClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user || data.user.is_anonymous) redirect("/sign-in");
  return { client, user: data.user };
});
