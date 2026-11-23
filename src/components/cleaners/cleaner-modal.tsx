"use client";
import Image from "next/image";
import {
  MapPin,
  Star,
  UserRound,
  X,
  ArrowRight,
  ImageIcon,
  MessageCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  authorizedGallery,
  topReviews,
  verifiedRating,
  type Cleaner,
} from "@/lib/cleaners";
import { RequestCleaner } from "@/components/marketplace/request-cleaner";
export function CleanerModal({
  cleaner,
  onClose,
}: {
  cleaner: Cleaner;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [requesting, setRequesting] = useState(false);
  const previousStage = useRef(false);
  const reviews = topReviews(cleaner),
    gallery = authorizedGallery(cleaner),
    rating = verifiedRating(cleaner);
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    el?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    if (requesting) {
      dialog.current?.scrollTo({ top: 0 });
      content.current?.querySelector<HTMLElement>("h2")?.focus();
    } else if (previousStage.current) {
      dialog.current?.scrollTo({ top: 0 });
      content.current
        ?.querySelector<HTMLElement>("#profile-title")
        ?.focus({ preventScroll: true });
    }
    previousStage.current = requesting;
  }, [requesting]);
  return (
    <dialog
      ref={dialog}
      className="profile-dialog market-profile"
      aria-labelledby={requesting ? undefined : "profile-title"}
      aria-label={requesting ? `Request ${cleaner.name} — preview` : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="market-modal-bar">
        <span>
          {requesting ? "YOUR CLEANING REQUEST" : "A LITTLE INTRODUCTION"}
        </span>
        <button
          autoFocus
          className="icon-button"
          aria-label="Close cleaner profile"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      {!requesting && (
        <div className="profile-cover">
          {cleaner.portrait ? (
            <Image
              src={cleaner.portrait}
              alt={
                cleaner.isFixture
                  ? "Stock portrait for a demonstration profile, not a Sweaply cleaner"
                  : cleaner.name
              }
              fill
              sizes="(max-width: 767px) 100vw, 660px"
            />
          ) : (
            <UserRound size={80} strokeWidth={1} />
          )}
        </div>
      )}
      <div ref={content} className="profile-content">
        {requesting ? (
          <RequestCleaner
            cleanerName={cleaner.name}
            fixture={cleaner.isFixture}
            onBack={() => setRequesting(false)}
          />
        ) : (
          <>
            {cleaner.isFixture && (
              <span className="fixture-label">
                DEVELOPMENT DEMO · STOCK MODEL · NOT A REAL CLEANER
              </span>
            )}
            <h2 id="profile-title" tabIndex={-1}>
              {cleaner.name}
            </h2>
            <p className="area">
              <MapPin size={16} />
              {cleaner.area}
            </p>
            <div className="specialties">
              {cleaner.specialties.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <h3>A little about me</h3>
            <p>{cleaner.bio}</p>
            {cleaner.experience && (
              <p className="market-experience">{cleaner.experience}</p>
            )}
            <h3>Customer reviews</h3>
            {rating && (
              <p className="rating">
                <Star size={17} />
                {rating.average} ({rating.count} verified reviews)
              </p>
            )}
            {reviews.length ? (
              reviews.map((r, i) => (
                <blockquote key={i}>
                  <span className="rating">
                    <Star size={14} />
                    {r.stars}/5
                  </span>
                  {r.quote}
                  <cite>{r.author}</cite>
                </blockquote>
              ))
            ) : (
              <div className="market-detail-empty">
                <MessageCircle size={21} />
                <p>
                  No verified reviews to share yet. Real customer feedback will
                  appear here when available.
                </p>
              </div>
            )}
            <h3>A look at their work</h3>
            {gallery.length ? (
              <div className="profile-gallery">
                {gallery.map((p) => (
                  <Image
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    width={520}
                    height={360}
                  />
                ))}
              </div>
            ) : (
              <div className="market-detail-empty">
                <ImageIcon size={22} />
                <p>
                  No authorized before-and-after photos yet. Galleries require
                  the cleaner’s photos and customer permission.
                </p>
              </div>
            )}
            <button
              className="button button-primary market-request-cta"
              onClick={() => setRequesting(true)}
            >
              Request This Cleaner <ArrowRight size={18} />
            </button>
            <p className="small">
              Request preview only. No submission is available. All requests
              require cleaner acceptance and booking conditions before
              confirmation.
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}
