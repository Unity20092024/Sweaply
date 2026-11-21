"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  CircleCheck,
} from "lucide-react";
import { authenticate } from "@/app/(auth)/actions";
import type { AuthMode, FormState } from "@/lib/auth/validation";
const labels = {
  "sign-in": "Sign In",
  "sign-up": "Create My Account",
  "forgot-password": "Send Reset Link",
  "reset-password": "Save New Password",
};
export function AuthForm({
  mode,
  configured,
}: {
  mode: AuthMode;
  configured: boolean;
}) {
  const [state, action, pending] = useActionState(
    authenticate.bind(null, mode),
    {} as FormState,
  );
  const [visible, setVisible] = useState(false);
  const newPassword = mode === "sign-up" || mode === "reset-password";
  const error = (field: string) =>
    state.fields?.[field] ? (
      <span id={`${field}-error`} className="field-error">
        {state.fields[field]}
      </span>
    ) : null;
  return (
    <form action={action} className="auth-form">
      {!configured && (
        <p className="form-notice" role="status">
          Account access is being prepared. Please check back soon.
        </p>
      )}
      {state.success ? (
        <div className="form-success" role="status">
          <CircleCheck size={22} />
          <p>{state.success}</p>
          <Link href="/sign-in">
            Back to sign in <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          {mode === "sign-up" && (
            <div className="form-field">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                required
                maxLength={80}
                placeholder="First and last name"
                aria-invalid={!!state.fields?.name}
                aria-describedby={state.fields?.name ? "name-error" : undefined}
              />
              {error("name")}
            </div>
          )}
          {mode !== "reset-password" && (
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                maxLength={254}
                placeholder="you@example.com"
                spellCheck={false}
                autoCapitalize="none"
                aria-invalid={!!state.fields?.email}
                aria-describedby={
                  state.fields?.email ? "email-error" : undefined
                }
              />
              {error("email")}
            </div>
          )}
          {mode !== "forgot-password" && (
            <div className="form-field">
              <div className="field-heading">
                <label htmlFor="password">
                  {newPassword ? "Create a password" : "Password"}
                </label>
                {mode === "sign-in" && (
                  <Link href="/forgot-password">Forgot password?</Link>
                )}
              </div>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={visible ? "text" : "password"}
                  autoComplete={
                    newPassword ? "new-password" : "current-password"
                  }
                  required
                  minLength={newPassword ? 12 : 1}
                  maxLength={128}
                  placeholder={
                    newPassword
                      ? "At least 12 characters"
                      : "Enter your password"
                  }
                  aria-invalid={!!state.fields?.password}
                  aria-describedby={
                    [
                      newPassword ? "password-hint" : "",
                      state.fields?.password ? "password-error" : "",
                    ]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={visible ? "Hide password" : "Show password"}
                  aria-pressed={visible}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {newPassword && (
                <span id="password-hint" className="field-hint">
                  Make it yours: use 12–128 characters.
                </span>
              )}
              {error("password")}
            </div>
          )}
          {newPassword && (
            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={visible ? "text" : "password"}
                autoComplete="new-password"
                required
                maxLength={128}
                placeholder="Enter your password again"
                aria-invalid={!!state.fields?.confirmPassword}
                aria-describedby={
                  state.fields?.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
              />
              {error("confirmPassword")}
            </div>
          )}
          {state.error && (
            <p className="form-error" role="alert">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            className="button button-primary auth-submit"
            disabled={pending || !configured}
          >
            {pending ? (
              <>
                <LoaderCircle size={18} className="spin" /> One moment…
              </>
            ) : (
              <>
                {labels[mode]}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </>
      )}
      {mode === "sign-in" && (
        <p className="auth-switch">
          New to Sweaply? <Link href="/sign-up">Create an account</Link>
        </p>
      )}
      {mode === "sign-up" && (
        <p className="auth-switch">
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </p>
      )}
      {mode === "forgot-password" && !state.success && (
        <p className="auth-switch">
          <Link href="/sign-in">Back to sign in</Link>
        </p>
      )}
    </form>
  );
}
