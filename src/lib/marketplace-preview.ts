import "server-only";
export function marketplacePreviewEnabled() {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.SWEAPLY_ENABLE_MARKETPLACE_PREVIEW === "true" &&
    process.env.SWEAPLY_SUPABASE_ENABLED !== "true"
  );
}
