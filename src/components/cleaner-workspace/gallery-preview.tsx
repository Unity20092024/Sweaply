"use client";
import { useEffect, useState } from "react";
import { ImagePlus, LockKeyhole } from "lucide-react";
export function GalleryPreview() {
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    () => () => {
      if (before) URL.revokeObjectURL(before);
    },
    [before],
  );
  useEffect(
    () => () => {
      if (after) URL.revokeObjectURL(after);
    },
    [after],
  );
  function choose(file: File | undefined, set: (value: string) => void) {
    if (!file) {
      set("");
      return;
    }
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Choose a JPEG, PNG, or WebP image under 5 MB.");
      set("");
      return;
    }
    setError("");
    set(URL.createObjectURL(file));
  }
  return (
    <div className="workspace-card">
      <span className="workspace-icon">
        <ImagePlus size={28} />
      </span>
      <h2>A little proof of your care.</h2>
      <p>
        No gallery is published. You can preview a pair of your own images
        locally; nothing is uploaded or saved.
      </p>
      <div className="gallery-pickers">
        <label>
          Before image
          <input
            aria-label="Before image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => choose(e.target.files?.[0], setBefore)}
          />
        </label>
        <label>
          After image
          <input
            aria-label="After image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => choose(e.target.files?.[0], setAfter)}
          />
        </label>
      </div>
      <label className="market-check gallery-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          I own these photos and have customer permission to show them. They
          contain no addresses, faces, or private identifying details.
        </span>
      </label>
      {error && (
        <p className="market-error" role="alert">
          {error}
        </p>
      )}
      {before && after && consent ? (
        <div className="local-gallery">
          {[
            { url: before, label: "Before · local preview" },
            { url: after, label: "After · local preview" },
          ].map((p) => (
            <figure key={p.label}>
              {/* Local blob URLs are never sent to the image optimizer. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.label} />
              <figcaption>{p.label}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="market-detail-empty">
          <LockKeyhole size={22} />
          <p>
            Select both images and confirm permission to view a local-only
            comparison.
          </p>
        </div>
      )}
      <p className="market-privacy">
        Development only. Use non-sensitive test images. Files remain in browser
        memory until you leave this page; no upload or publication is available.
      </p>
    </div>
  );
}
