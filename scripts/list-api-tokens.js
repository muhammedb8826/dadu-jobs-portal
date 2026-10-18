const { Client } = require("pg");

async function main() {
  const c = new Client({
    host: "127.0.0.1",
    port: 5432,
    database: "dadu_jobs",
    user: "postgres",
    password: "mame",
  });
  await c.connect();
  const r = await c.query(
    `SELECT id, name, type, access_key, created_at, last_used_at FROM strapi_api_tokens ORDER BY id`
  );
  for (const row of r.rows) {
    console.log({
      id: row.id,
      name: row.name,
      type: row.type,
      access_key_prefix: String(row.access_key || "").slice(0, 16),
      access_key_len: String(row.access_key || "").length,
      last_used_at: row.last_used_at,
    });
  }
  await c.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
