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

  const jobs = await c.query(
    `SELECT id, document_id, published_at, created_at, locale FROM saved_jobs ORDER BY id`
  );
  console.log("saved_jobs:", jobs.rows);

  const lnk = await c.query(`SELECT * FROM saved_jobs_user_lnk`);
  console.log("user lnk:", lnk.rows);

  const jlnk = await c.query(`SELECT * FROM saved_jobs_job_lnk`);
  console.log("job lnk:", jlnk.rows);

  await c.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
