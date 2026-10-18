/**
 * Clear job.user links that point at admin_users document_ids
 * (bug: Document middleware wrote admin identity into UP user relation).
 */
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

  // Discover jobs <-> users link table / column
  const cols = await c.query(`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        column_name ILIKE '%user%'
        OR column_name ILIKE '%job%'
      )
      AND table_name ILIKE '%job%'
    ORDER BY table_name, column_name
  `);
  console.log("job-related columns:", cols.rows);

  const adminDocs = await c.query(
    `SELECT id, document_id FROM admin_users`
  );
  console.log("admin users:", adminDocs.rows);

  // Strapi 5 often stores manyToOne as jobs.user_id -> up_users.id
  const jobCols = await c.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'jobs'
  `);
  console.log(
    "jobs columns:",
    jobCols.rows.map((r) => r.column_name)
  );

  if (jobCols.rows.some((r) => r.column_name === "user_id")) {
    const bad = await c.query(`
      SELECT j.id, j.document_id, j.title, j.user_id, u.document_id AS user_document_id, u.username
      FROM jobs j
      LEFT JOIN up_users u ON u.id = j.user_id
      WHERE j.user_id IS NOT NULL
    `);
    console.log("jobs with user_id:", bad.rows);

    // If user_id doesn't join to up_users, clear it
    const cleared = await c.query(`
      UPDATE jobs j
      SET user_id = NULL
      WHERE j.user_id IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM up_users u WHERE u.id = j.user_id)
      RETURNING id, document_id, title
    `);
    console.log("cleared orphan user_id:", cleared.rows);

    // Also clear if somehow linked via document join tables
  }

  // Link tables like jobs_user_lnk
  const linkTables = await c.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
      AND (table_name ILIKE '%jobs%user%' OR table_name ILIKE '%user%jobs%')
  `);
  console.log("link tables:", linkTables.rows);

  for (const { table_name } of linkTables.rows) {
    const sample = await c.query(`SELECT * FROM "${table_name}" LIMIT 20`);
    console.log(table_name, sample.rows);
  }

  await c.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
