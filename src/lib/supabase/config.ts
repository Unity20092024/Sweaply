import "server-only";

export function authConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const site = process.env.SITE_URL;
  if (!url || !key || !site || !key.startsWith("sb_publishable_")) return null;
  try {
    const project = new URL(url);
    const origin = new URL(site);
    const local = (u: URL) => ["localhost", "127.0.0.1"].includes(u.hostname);
    if (
      ![project, origin].every(
        (u) => u.protocol === "https:" || (u.protocol === "http:" && local(u)),
      )
    )
      return null;
    if (
      origin.username ||
      origin.password ||
      project.username ||
      project.password
    )
      return null;
    return {
      url: project.origin,
      key,
      site: origin.origin,
      secure: origin.protocol === "https:",
    };
  } catch {
    return null;
  }
}
