export type AuthMode =
  "sign-in" | "sign-up" | "forgot-password" | "reset-password";
export type FormState = {
  error?: string;
  success?: string;
  fields?: Record<string, string>;
};
export function validateAuth(mode: AuthMode, data: FormData): FormState {
  const fields: Record<string, string> = {};
  const email = String(data.get("email") ?? "").trim();
  const password = String(data.get("password") ?? "");
  if (
    mode !== "reset-password" &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
  )
    fields.email = "Enter a valid email address.";
  if (mode !== "forgot-password" && (!password || password.length > 128))
    fields.password = "Enter your password (up to 128 characters).";
  if (["sign-up", "reset-password"].includes(mode)) {
    if (password.length < 12)
      fields.password = "Use at least 12 characters for your password.";
    if (password !== data.get("confirmPassword"))
      fields.confirmPassword = "Your passwords don’t match.";
  }
  if (mode === "sign-up") {
    const name = String(data.get("name") ?? "").trim();
    if (name.length < 1 || name.length > 80)
      fields.name = "Enter your name (up to 80 characters).";
  }
  return Object.keys(fields).length
    ? { fields, error: "Please check the highlighted fields." }
    : {};
}
export function safeNext(value: string | null) {
  return value === "/reset-password" ? "/reset-password" : "/account";
}
