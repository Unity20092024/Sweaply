"use client";
import { Menu, X, UserRound, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";
import { SweaplyLogo } from "@/components/branding/sweaply-logo";
const entries = [
  { label: "Home", href: "#home" },
  { label: "Our Services", href: "#services" },
  { label: "Find a Cleaner", href: "#cleaners" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Blog" },
  { label: "About Us" },
  { label: "Contact Us" },
  { label: "Sign In / Create Account", href: "/sign-in" },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <SweaplyLogo priority />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#services">Our Services</a>
          <a href="#cleaners">Find a Cleaner</a>
          <a href="#how-it-works">How It Works</a>
        </nav>
        <div className="header-actions">
          <Link className="sign-in" href="/sign-in">
            <UserRound size={18} />
            <span>Sign In</span>
          </Link>
          <button
            ref={trigger}
            className="icon-button menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Expanded navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              trigger.current?.focus();
            }
          }}
        >
          <div className="container">
            {entries.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <ArrowUpRight size={17} />
                </a>
              ) : (
                <span
                  key={item.label}
                  className="future-nav"
                  aria-disabled="true"
                >
                  {item.label}
                  <small>Coming soon</small>
                </span>
              ),
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
