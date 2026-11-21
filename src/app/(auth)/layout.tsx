import { AuthShell } from "@/components/auth/auth-shell";
import "./auth.css";
export const dynamic = "force-dynamic";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthShell>{children}</AuthShell>;
}
