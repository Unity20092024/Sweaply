import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { SweaplyLogo } from "@/components/branding/sweaply-logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <SweaplyLogo priority />
        <Link href="/" className="auth-back">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </header>
      <main id="main" className="auth-grid">
        <div className="auth-form-column">
          {children}
          <p className="auth-privacy">
            <ShieldCheck size={15} /> A little peace of mind, from the very
            first step.
          </p>
        </div>
        <aside className="auth-story" aria-label="More room for life">
          <div className="auth-story-photo">
            <Image
              src="/images/living-room.jpg"
              alt="A bright, peaceful living room with natural daylight"
              fill
              sizes="(max-width: 900px) 1px, 50vw"
            />
          </div>
          <div className="auth-story-copy">
            <span className="eyebrow">
              <Sparkles size={14} /> A LITTLE LESS TO DO
            </span>
            <h2>
              More room
              <br />
              for what matters.
            </h2>
            <p>Your home. Your people. Your fresh start.</p>
            <span className="auth-city">MADE FOR MINNEAPOLIS–ST. PAUL</span>
          </div>
        </aside>
      </main>
      <footer className="auth-footer">
        © {new Date().getFullYear()} Sweaply{" "}
        <span>Clean home. Clear head. More you.</span>
      </footer>
    </div>
  );
}
