import { PGlite } from "@electric-sql/pglite";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
const db = new PGlite();
const a = "00000000-0000-4000-8000-000000000001",
  b = "00000000-0000-4000-8000-000000000002";
const c = "00000000-0000-4000-8000-000000000003",
  d = "00000000-0000-4000-8000-000000000004";
const ba = "00000000-0000-4000-8000-000000000005",
  bb = "00000000-0000-4000-8000-000000000006",
  pending = "00000000-0000-4000-8000-000000000007";
let checks = 0;
await db.exec(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key, raw_user_meta_data jsonb not null default '{}');
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to authenticated,anon; grant execute on function auth.uid() to authenticated,anon;
 insert into auth.users(id) values('${a}'),('${b}');`);
const migration = readdirSync("supabase/migrations").find((f) =>
  f.endsWith("customer_account_foundation.sql"),
);
await db.exec(readFileSync(`supabase/migrations/${migration}`, "utf8"));
await db.exec(`insert into public.cleaner_profiles(id,display_name,active) values('${c}','LOCAL TEST cleaner A',true),('${d}','LOCAL TEST cleaner B',true);
 insert into public.bookings(id,customer_id,cleaner_id,service,status,cleaner_accepted_at,conditions_met_at,confirmed_at,completed_at)
 values('${ba}','${a}','${c}','standard','completed',now(),now(),now(),now()),('${bb}','${b}','${d}','deep','completed',now(),now(),now(),now());
 insert into public.bookings(id,customer_id,cleaner_id,service) values('${pending}','${a}','${c}','standard');
 insert into public.quotes(customer_id,service) values('${a}','standard'),('${b}','deep');
 insert into public.customer_addresses(customer_id,line1,city,postal_code) values('${a}','LOCAL TEST A','Test','55101'),('${b}','LOCAL TEST B','Test','55101');
 insert into public.customer_messages(customer_id,subject,body) values('${a}','LOCAL TEST A','A'),('${b}','LOCAL TEST B','B');
 insert into public.payment_receipts(customer_id,booking_id,amount_cents) values('${a}','${ba}',100),('${b}','${bb}',200);
 insert into public.cleaner_favorites(customer_id,cleaner_id) values('${a}','${c}'),('${b}','${d}');`);
for (const [owner, job, cleaner] of [
  [a, ba, c],
  [b, bb, d],
]) {
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
    owner,
  ]);
  await db.query(
    "insert into cleaner_requests(customer_id,previous_booking_id,cleaner_id,preferred_date) values($1,$2,$3,current_date+10)",
    [owner, job, cleaner],
  );
}
await db.query("select set_config('request.jwt.claim.sub','',false)");
async function as(id, fn, role = "authenticated") {
  await db.exec("begin");
  try {
    await db.exec(`set local role ${role}`);
    await db.query("select set_config('request.jwt.claim.sub',$1,true)", [id]);
    const result = await fn();
    await db.exec("rollback");
    return result;
  } catch (e) {
    await db.exec("rollback");
    throw e;
  }
}
async function deny(sql, args = [], user = a, role = "authenticated") {
  await assert.rejects(as(user, () => db.query(sql, args), role));
  checks++;
}
for (const table of [
  "customer_profiles",
  "customer_addresses",
  "quotes",
  "bookings",
  "cleaner_requests",
  "cleaner_favorites",
  "customer_messages",
  "payment_receipts",
]) {
  await as(a, async () => {
    const { rows } = await db.query(`select * from public.${table}`);
    assert(
      rows.every(
        (r) => (table === "customer_profiles" ? r.id : r.customer_id) === a,
      ),
    );
  });
  checks++;
  await as(b, async () => {
    const { rows } = await db.query(`select * from public.${table}`);
    assert(
      rows.every(
        (r) => (table === "customer_profiles" ? r.id : r.customer_id) === b,
      ),
    );
  });
  checks++;
  await deny(`select * from public.${table}`, [], "", "anon");
}
await as(a, async () => {
  const changed = await db.query(
    "update customer_profiles set display_name=$1 where id=$2 returning id",
    ["attacker", b],
  );
  assert.equal(changed.rows.length, 0);
});
checks++;
await as(a, async () => {
  const changed = await db.query(
    "update customer_profiles set display_name=$1 where id=$2 returning id",
    ["Own edited name", a],
  );
  assert.equal(changed.rows.length, 1);
});
checks++;
await deny("update customer_profiles set id=$1 where id=$2", [b, a]);
await deny("insert into private.user_roles(user_id,role) values($1,'admin')", [
  a,
]);
await deny("update bookings set status='confirmed' where id=$1", [pending]);
await deny(
  "insert into bookings(customer_id,cleaner_id,service) values($1,$2,'standard')",
  [a, c],
);
await deny("select user_id from cleaner_profiles");
await deny("update cleaner_profiles set active=true where id=$1", [c]);
await deny(
  "update booking_statuses set label='Confirmed' where code='pending_cleaner_acceptance'",
);
await deny(
  "insert into customer_addresses(customer_id,line1,city,postal_code) values($1,'Wrong owner','Test','55101')",
  [b],
);
await deny("select request_same_cleaner($1,current_date+3)", [bb]);
await deny("select request_same_cleaner($1,current_date+3)", [pending]);
await deny("select request_same_cleaner($1,current_date-1)", [ba]);
await deny("select request_same_cleaner($1,current_date+3)", [ba], "", "anon");
await deny(
  "insert into cleaner_requests(customer_id,previous_booking_id,cleaner_id,preferred_date) values($1,$2,$3,current_date+3)",
  [a, ba, d],
);
await deny(
  "insert into cleaner_requests(customer_id,previous_booking_id,cleaner_id,preferred_date,status) values($1,$2,$3,current_date+3,'accepted')",
  [a, ba, c],
);
await as(a, async () => {
  const before = (await db.query("select count(*)::int as n from bookings"))
    .rows[0].n;
  const { rows } = await db.query(
    "select request_same_cleaner($1,current_date+3) as id",
    [ba],
  );
  const request = (
    await db.query("select * from cleaner_requests where id=$1", [rows[0].id])
  ).rows[0];
  assert.equal(request.customer_id, a);
  assert.equal(request.cleaner_id, c);
  assert.equal(request.previous_booking_id, ba);
  assert.equal(request.status, "pending_cleaner_acceptance");
  assert.equal(
    (await db.query("select count(*)::int as n from bookings")).rows[0].n,
    before,
  );
  await assert.rejects(
    db.query("select request_same_cleaner($1,current_date+3)", [ba]),
  );
});
checks++;
await deny("update cleaner_requests set status='accepted'");
await assert.rejects(
  db.query(
    "insert into bookings(customer_id,cleaner_id,service,status) values($1,$2,'deep','confirmed')",
    [a, c],
  ),
);
checks++;
await db.exec(
  `insert into auth.users(id,raw_user_meta_data) values('00000000-0000-4000-8000-000000000009','{"role":"admin","display_name":"LOCAL TEST"}');`,
);
assert.equal(
  (await db.query("select count(*)::int as n from private.user_roles")).rows[0]
    .n,
  0,
);
checks++;
assert.equal(
  (
    await db.query(
      "select count(*)::int as n from customer_profiles where id='00000000-0000-4000-8000-000000000009'",
    )
  ).rows[0].n,
  1,
);
checks++;
const unsecured = await db.query(
  "select tablename from pg_tables where schemaname in ('public','private') and not rowsecurity",
);
assert.deepEqual(unsecured.rows, []);
checks++;
console.log(
  `PASS: ${checks} local PostgreSQL checks — migration syntax, cross-customer RLS, anonymous denial, role escalation, field grants, repeat-request provenance, pending-only status, and confirmation prerequisites`,
);
await db.close();
