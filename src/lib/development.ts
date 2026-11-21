import "server-only";

export function accountPreviewEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.SWEAPLY_ENABLE_ACCOUNT_PREVIEW === "true" &&
    process.env.SWEAPLY_SUPABASE_ENABLED !== "true"
  );
}
