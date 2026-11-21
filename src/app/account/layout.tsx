import "./account.css";
import { authConfig } from "@/lib/supabase/config";
import { requireCustomer } from "@/lib/auth/session";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "My Account | Sweaply",
  robots: { index: false, follow: false },
};
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (authConfig()) await requireCustomer();
  return children;
}
