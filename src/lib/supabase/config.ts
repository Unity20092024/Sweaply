import "server-only";
import { resolveSupabaseConfig } from "./options";

export function authConfig() {
  return resolveSupabaseConfig(process.env);
}
