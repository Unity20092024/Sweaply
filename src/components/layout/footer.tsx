import { ArrowUpRight } from "lucide-react";
import { SweaplyLogo } from "@/components/branding/sweaply-logo";
const groups = [
  {
    title: "Explore",
    items: [
      ["Home", "#home"],
      ["Services", "#services"],
      ["Find a Cleaner", "#cleaners"],
      ["How It Works", "#how-it-works"],
      ["Blog", ""],
    ],
  },
  {
    title: "Company",
    items: [
      ["About Us", ""],
      ["Contact", ""],
      ["Become a Sweaply Cleaner", "/become-a-cleaner"],
    ],
  },
  {
    title: "Legal",
    items: [
      ["Privacy Policy", ""],
      ["Terms of Service", ""],
      ["Cancellation & Refund Policy", ""],
      ["Accessibility", ""],
    ],
  },
];
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <SweaplyLogo />
          <p>
            A little less to do.
            <br />A little more room for you.
          </p>
          <span className="location-label">MINNEAPOLIS–ST. PAUL, MN</span>
        </div>
        {groups.map((group) => (
          <div className="footer-group" key={group.title}>
            <h3>{group.title}</h3>
            {group.items.map(([label, href]) =>
              href ? (
                <a key={label} href={href}>
                  {label}
                </a>
              ) : (
                <span key={label} className="future-link" aria-disabled="true">
                  {label}
                  <span className="sr-only"> — coming soon</span>
                </span>
              ),
            )}
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Sweaply. All rights reserved.</span>
        <span>
          Thoughtfully clean. Locally connected. <ArrowUpRight size={14} />
        </span>
      </div>
      <p className="container footer-note">
        We’re getting ready to launch. Additional pages and account features are
        coming soon.
      </p>
    </footer>
  );
}
