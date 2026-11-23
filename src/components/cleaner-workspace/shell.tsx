import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { SweaplyLogo } from "@/components/branding/sweaply-logo";
export function CleanerWorkspaceShell({
  children,
  navigation,
  preview = false,
}: {
  children: React.ReactNode;
  navigation: React.ReactNode;
  preview?: boolean;
}) {
  return (
    <div className="cleaner-workspace">
      <header className="market-header">
        <SweaplyLogo priority />
        <Link href="/" className="market-back">
          <ArrowLeft size={15} /> Back to home
        </Link>
      </header>
      <div className="workspace-layout">
        <aside className="workspace-sidebar">
          <span className="eyebrow">YOUR CLEANER WORKSPACE</span>
          {navigation}
          <div className="workspace-sidebar-note">
            <Sparkles size={24} />
            <p>
              A little care.
              <br />
              <strong>A little more possibility.</strong>
            </p>
          </div>
        </aside>
        <main id="main" className="workspace-main">
          {preview && (
            <aside className="workspace-demo">
              <strong>DEVELOPMENT DEMO · NOT A REAL CLEANER ACCOUNT</strong>
              <p>
                Fictional profiles and requests for UI testing only. No
                authentication, saved changes, real availability, or confirmed
                bookings. Everything resets when you reload.
              </p>
            </aside>
          )}
          {children}
        </main>
      </div>
      <footer className="workspace-footer">
        © {new Date().getFullYear()} Sweaply{" "}
        <span>
          {preview
            ? "UI preview only · no database connected"
            : "Cleaner accounts are not connected yet"}
        </span>
      </footer>
    </div>
  );
}
