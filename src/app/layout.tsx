import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Sweaply | Clean Spaces. Clear Minds.",
  description:
    "Professional standard, deep, and move-out home cleaning in Minneapolis–St. Paul. Meet Sweaply, your fresh start in the Twin Cities.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
