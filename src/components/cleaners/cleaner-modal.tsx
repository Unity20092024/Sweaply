"use client";
import Image from "next/image";
import { MapPin, Star, UserRound, X, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Cleaner } from "@/lib/cleaners";
export function CleanerModal({
  cleaner,
  onClose,
}: {
  cleaner: Cleaner;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    el?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="profile-dialog"
      aria-labelledby="profile-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        autoFocus
        className="icon-button dialog-close"
        aria-label="Close cleaner profile"
        onClick={onClose}
      >
        <X />
      </button>
      <div className="profile-cover">
        {cleaner.portrait ? (
          <Image src={cleaner.portrait} alt={cleaner.name} fill sizes="600px" />
        ) : (
          <UserRound size={90} strokeWidth={1} aria-hidden="true" />
        )}
      </div>
      <div className="profile-content">
        {cleaner.isFixture && (
          <span className="fixture-label">
            DEVELOPMENT DEMO · NOT A REAL CLEANER
          </span>
        )}
        <h2 id="profile-title">{cleaner.name}</h2>
        <p className="area">
          <MapPin size={16} />
          {cleaner.area}
        </p>
        <div className="specialties">
          {cleaner.specialties.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <p>{cleaner.bio}</p>
        {cleaner.experience && <p>Experience: {cleaner.experience}</p>}
        <h3>Customer reviews</h3>
        {cleaner.rating && (
          <p>
            <Star size={17} /> {cleaner.rating.average} ({cleaner.rating.count}{" "}
            reviews)
          </p>
        )}
        {cleaner.reviews.length ? (
          cleaner.reviews.slice(0, 3).map((r, i) => (
            <blockquote key={i}>
              {r.quote}
              <cite>{r.author}</cite>
            </blockquote>
          ))
        ) : (
          <p className="empty-detail">No customer reviews to share yet.</p>
        )}
        <h3>A look at their work</h3>
        {cleaner.gallery?.length ? (
          <div className="profile-gallery">
            {cleaner.gallery
              .filter((p) => p.permissionConfirmed)
              .map((p) => (
                <Image
                  key={p.src}
                  src={p.src}
                  alt={p.alt}
                  width={400}
                  height={300}
                />
              ))}
          </div>
        ) : (
          <p className="empty-detail">
            Approved before-and-after photos will appear here when available.
          </p>
        )}
        <button
          className="button button-primary"
          onClick={() => setRequested(true)}
        >
          Request This Cleaner <ArrowRight size={18} />
        </button>
        {requested && (
          <p role="status" className="request-status">
            This is a preview of the future request flow. No request or booking
            has been submitted.
          </p>
        )}
        <p className="small">
          Requests require cleaner acceptance. Selecting a cleaner does not
          confirm an appointment.
        </p>
      </div>
    </dialog>
  );
}
