import assert from "node:assert/strict";
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
