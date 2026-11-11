"use client";
import { ArrowRight, X } from "lucide-react";
import { useId, useRef } from "react";
export function LaunchAction({
  children,
  title,
  message,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  title: string;
  message: string;
  variant?: "primary" | "outline" | "text";
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <>
      <button
        className={`button button-${variant} ${className}`}
        onClick={() => dialog.current?.showModal()}
      >
        {children}
        <ArrowRight size={19} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        className="launch-dialog"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-inner">
          <button
            autoFocus
            className="icon-button dialog-close"
            aria-label="Close launch information"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
          <span className="eyebrow">A FRESH START IS COMING</span>
          <h2 id={titleId}>{title}</h2>
          <p>{message}</p>
          <p className="small">
            No request has been submitted. Cleaning requests will require
            acceptance by your selected cleaner.
          </p>
          <button
            className="button button-primary"
            onClick={() => dialog.current?.close()}
          >
            Got it <ArrowRight size={18} />
          </button>
        </div>
      </dialog>
    </>
  );
}
