"use client";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Star, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { verifiedRating, type Cleaner } from "@/lib/cleaners";
import { CleanerModal } from "./cleaner-modal";
export function CleanerCard({
  cleaner,
  onView,
}: {
  cleaner: Cleaner;
  onView: () => void;
}) {
  const rating = verifiedRating(cleaner);
  return (
    <article className="cleaner-card">
      <div className="cleaner-portrait">
        {cleaner.portrait ? (
          <Image
            src={cleaner.portrait}
            alt={
              cleaner.isFixture
                ? "Stock portrait · demonstration only"
                : cleaner.name
            }
            fill
            sizes="(max-width: 600px) 80vw, 320px"
          />
        ) : (
          <UserRound size={72} strokeWidth={1} aria-hidden="true" />
        )}
        {cleaner.isFixture && (
          <span className="fixture-label">DEMO PROFILE · STOCK PHOTO</span>
        )}
      </div>
      <div className="cleaner-details">
        <h3>{cleaner.name}</h3>
        {rating && (
          <p className="rating">
            <Star size={17} />
            {rating.average} ({rating.count} reviews)
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
  const [edges, setEdges] = useState({ previous: false, next: false });
  const updateEdges = () => {
    const el = track.current;
    if (el)
      setEdges({
        previous: el.scrollLeft > 2,
        next: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
      });
  };
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
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
          disabled={!edges.previous}
          aria-label="Previous cleaner profiles"
          onClick={() => move(-1)}
        >
          <ArrowLeft />
        </button>
        <button
          className="icon-button"
          disabled={!edges.next}
          aria-label="Next cleaner profiles"
          onClick={() => move(1)}
        >
          <ArrowRight />
        </button>
      </div>
      <div
        ref={track}
        onScroll={updateEdges}
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
