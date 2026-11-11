import Image from "next/image";
import Link from "next/link";

/** Shared official artwork for site layouts and future authentication screens. */
export function SweaplyLogo({ priority = false }: { priority?: boolean }) {
  return (
    <Link className="sweaply-logo" href="/" aria-label="Sweaply — Home Cleaning, home">
      <Image
        src="/branding/sweaply-logo.png"
        alt="Sweaply — Home Cleaning"
        width={2172}
        height={724}
        unoptimized
        sizes="(max-width: 767px) 150px, 180px"
        priority={priority}
      />
    </Link>
  );
}
