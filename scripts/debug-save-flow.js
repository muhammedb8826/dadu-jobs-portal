const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function loadEnv() {
  const envPath = path.join(__dirname, "..", "..", "dadu-jobs", ".env.local");
  const text = fs.readFileSync(envPath, "utf8");
  const get = (key) => {
    const line = text.split(/\r?\n/).find((l) => l.startsWith(key + "="));
    return line ? line.split("=").slice(1).join("=").trim() : "";
  };
  return {
    token: get("NEXT_PUBLIC_API_TOKEN"),
    base: get("NEXT_PUBLIC_API_BASE_URL") || "http://localhost:3001",
  };
}

async function main() {
  const { token, base } = loadEnv();
  console.log("token len", token.length, "prefix", token.slice(0, 16));

  const ping = await fetch(`${base}/api/jobs?pagination[pageSize]=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("jobs with token", ping.status);

  const saved = await fetch(
    `${base}/api/saved-jobs?populate[job][fields][0]=documentId&populate[user][fields][0]=id&pagination[pageSize]=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const savedBody = await saved.json().catch(() => ({}));
  console.log("saved-jobs with token", saved.status);
  console.log(
    "saved rows",
    (savedBody.data || []).map((r) => ({
      documentId: r.documentId,
      job: r.job?.documentId || r.job,
      user: r.user?.id || r.user,
    }))
  );

  const c = new Client({
    host: "127.0.0.1",
    port: 5432,
    database: "dadu_jobs",
    user: "postgres",
    password: "mame",
  });
  await c.connect();
  const jobs = await c.query(
    `SELECT id, document_id, title FROM jobs WHERE document_id = $1 OR published_at IS NOT NULL ORDER BY id DESC LIMIT 10`,
    ["nyuzyuzaevtg9as55ne7stx6"]
  );
  console.log("jobs db", jobs.rows);

  const lnk = await c.query(`
    SELECT sj.id, sj.document_id, sj.published_at, u.user_id, j.job_id
    FROM saved_jobs sj
    LEFT JOIN saved_jobs_user_lnk u ON u.saved_job_id = sj.id
    LEFT JOIN saved_jobs_job_lnk j ON j.saved_job_id = sj.id
    ORDER BY sj.id
  `);
  console.log("saved lnk", lnk.rows);
  await c.end();

  // Try create with token only (no user) for a known job
  const jobDoc = "nyuzyuzaevtg9as55ne7stx6";
  const create = await fetch(`${base}/api/saved-jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: { job: jobDoc, user: 3 } }),
  });
  const createBody = await create.text();
  console.log("create with token+user", create.status, createBody.slice(0, 500));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
