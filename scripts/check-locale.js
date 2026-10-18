const { Client } = require("pg");

const DOC_ID = process.argv[2] || "hddzx0ezrwkf7e757nhcd2xn";

async function main() {
  const c = new Client({
    host: "127.0.0.1",
    port: 5432,
    database: "dadu_jobs",
    user: "postgres",
    password: "mame",
  });
  await c.connect();

  const tables = await c.query(
    `SELECT table_name FROM information_schema.columns
     WHERE column_name = 'document_id' AND table_schema = 'public'`
  );

  for (const { table_name } of tables.rows) {
    try {
      const hasLocale = await c.query(
        `SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = $1 AND column_name = 'locale'`,
        [table_name]
      );
      const cols = hasLocale.rowCount
        ? "id, document_id, locale"
        : "id, document_id";
      const r = await c.query(
        `SELECT ${cols} FROM "${table_name}" WHERE document_id = $1 LIMIT 5`,
        [DOC_ID]
      );
      if (r.rows.length) {
        console.log("FOUND in", table_name, JSON.stringify(r.rows, null, 2));
      }
    } catch (e) {
      console.log("skip", table_name, e.message);
    }
  }

  console.log("\n--- locale summary ---");
  for (const { table_name } of tables.rows) {
    try {
      const hasLocale = await c.query(
        `SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = $1 AND column_name = 'locale'`,
        [table_name]
      );
      if (!hasLocale.rowCount) continue;
      const r = await c.query(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE locale IS NOT NULL)::int AS with_locale,
                COUNT(*) FILTER (WHERE locale IS NULL)::int AS null_locale
         FROM "${table_name}"`
      );
      if (r.rows[0].with_locale > 0) {
        console.log(table_name, r.rows[0]);
      }
    } catch (_) {
      /* ignore */
    }
  }

  await c.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
