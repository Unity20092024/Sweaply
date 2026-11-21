import assert from "node:assert/strict";
import { resolveSupabaseConfig } from "../src/lib/supabase/options.ts";
import { validateAuth, safeNext } from "../src/lib/auth/validation.ts";
function form(data) {
  const f = new FormData();
  for (const [k, v] of Object.entries(data)) f.set(k, v);
  return f;
}
assert(
  validateAuth(
    "sign-up",
    form({
      email: "not-email",
      name: " ",
      password: "short",
      confirmPassword: "different",
    }),
  ).fields.email,
);
assert(
  validateAuth(
    "sign-up",
    form({
      email: "valid@example.invalid",
      name: "Test",
      password: "long-enough-pass",
      confirmPassword: "mismatch",
    }),
  ).fields.confirmPassword,
);
assert.deepEqual(
  validateAuth(
    "sign-up",
    form({
      email: "valid@example.invalid",
      name: "Test",
      password: "long-enough-pass",
      confirmPassword: "long-enough-pass",
    }),
  ),
  {},
);
assert(
  validateAuth(
    "reset-password",
    form({ password: "short", confirmPassword: "short" }),
  ).fields.password,
);
assert(
  validateAuth("sign-in", form({ email: "a@b.invalid", password: "" })).fields
    .password,
);
assert(
  validateAuth(
    "sign-in",
    form({ email: "a@b.invalid", password: "x".repeat(129) }),
  ).fields.password,
);
for (const target of [
  "https://evil.invalid",
  "//evil.invalid",
  "/\\evil.invalid",
  "/admin",
  "/%2f%2fevil.invalid",
  null,
  "/account?next=https://evil.invalid",
])
  assert.equal(safeNext(target), "/account");
assert.equal(safeNext("/reset-password"), "/reset-password");
console.log(
  "PASS: server validation, password bounds, confirmation matching, and redirect allowlist",
);

// Disabled configuration must not even read provider values, let alone connect.
for (const enabled of [undefined, "false", "", "TRUE"]) {
  const env = { SWEAPLY_SUPABASE_ENABLED: enabled };
  for (const key of [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "SITE_URL",
  ])
    Object.defineProperty(env, key, {
      get() {
        throw new Error("Disabled integration read provider config");
      },
    });
  assert.equal(resolveSupabaseConfig(env), null);
}
console.log(
  "PASS: Supabase connection is disabled by default and does not read provider values without explicit opt-in",
);
