const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(
    __dirname,
    "..",
    "..",
    "dadu-jobs",
    ".env.local"
  );
  const text = fs.readFileSync(envPath, "utf8");
  const tokenLine = text
    .split(/\r?\n/)
    .find((l) => l.startsWith("NEXT_PUBLIC_API_TOKEN="));
  return tokenLine.split("=").slice(1).join("=").trim();
}

async function main() {
  const token = loadEnv();
  console.log("token length", token.length, "prefix", token.slice(0, 12));

  const urls = [
    "http://localhost:3001/api/saved-jobs?populate[job][fields][0]=id&populate[job][fields][1]=documentId&populate[user][fields][0]=id&pagination[pageSize]=20",
    "http://localhost:3001/api/saved-jobs?populate=*&pagination[pageSize]=20",
    "http://localhost:3001/api/jobs?filters[documentId][$eq]=nyuzyuzaevtg9as55ne7stx6&fields[0]=id&fields[1]=documentId&fields[2]=title",
  ];

  for (const url of urls) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.text();
    console.log("\nSTATUS", res.status, url.slice(0, 80));
    console.log(body.slice(0, 1500));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
