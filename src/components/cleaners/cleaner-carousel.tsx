"use client";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Star, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import type { Cleaner } from "@/lib/cleaners";
import { CleanerModal } from "./cleaner-modal";
export function CleanerCard({
  cleaner,
  onView,
}: {
  cleaner: Cleaner;
  onView: () => void;
}) {
  return (
    <article className="cleaner-card">
      <div className="cleaner-portrait">
        {cleaner.portrait ? (
          <Image
            src={cleaner.portrait}
            alt={cleaner.name}
            fill
            sizes="(max-width: 600px) 80vw, 320px"
          />
        ) : (
          <UserRound size={72} strokeWidth={1} aria-hidden="true" />
        )}
        {cleaner.isFixture && (
          <span className="fixture-label">DEMO PROFILE</span>
        )}
      </div>
      <div className="cleaner-details">
        <h3>{cleaner.name}</h3>
        {cleaner.rating && (
          <p className="rating">
            <Star size={17} />
            {cleaner.rating.average} ({cleaner.rating.count} reviews)
          </p>
        )}
        <p>{cleaner.specialties.join(" · ")}</p>
        <p className="area">
          <MapPin size={14} />
          {cleaner.area}
        </p>
        <button className="button button-primary" onClick={onView}>
          View Profile
          <ArrowRight size={18} />
        </button>
      </div>
    </article>
  );
}
export function CleanerCarousel({ cleaners }: { cleaners: Cleaner[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Cleaner | null>(null);
  const move = (direction: number) => {
    const el = track.current;
    if (el)
      el.scrollBy({
        left:
          direction *
            (el.firstElementChild?.getBoundingClientRect().width ?? 300) +
          direction * 20,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
  return (
    <div className="carousel">
      <div className="carousel-controls">
        <button
          className="icon-button"
          aria-label="Previous cleaner profiles"
          onClick={() => move(-1)}
        >
          <ArrowLeft />
        </button>
        <button
          className="icon-button"
          aria-label="Next cleaner profiles"
          onClick={() => move(1)}
        >
          <ArrowRight />
        </button>
      </div>
      <div
        ref={track}
        className="carousel-track"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Cleaner profiles. Use left and right arrow keys to browse."
        onKeyDown={(e) => {
          if (
            e.target === e.currentTarget &&
            ["ArrowLeft", "ArrowRight"].includes(e.key)
          ) {
            e.preventDefault();
            move(e.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {cleaners.map((cleaner) => (
          <CleanerCard
            key={cleaner.id}
            cleaner={cleaner}
            onView={() => setSelected(cleaner)}
          />
        ))}
      </div>
      {selected && (
        <CleanerModal
          key={selected.id}
          cleaner={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
