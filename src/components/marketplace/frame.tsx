import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SweaplyLogo } from "@/components/branding/sweaply-logo";
export function MarketplaceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="market-page">
      <header className="market-header">
        <SweaplyLogo priority />
        <Link href="/" className="market-back">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </header>
      <main id="main">{children}</main>
      <footer className="market-footer">
        <SweaplyLogo />
        <div>
          <Link href="/">
            Home <ArrowUpRight size={14} />
          </Link>
          <Link href="/become-a-cleaner">
            Become a cleaner <ArrowUpRight size={14} />
          </Link>
          <Link href="/cleaner/dashboard">
            Cleaner workspace <ArrowUpRight size={14} />
          </Link>
        </div>
        <p>© {new Date().getFullYear()} Sweaply · Minneapolis–St. Paul</p>
      </footer>
    </div>
  );
}
