// Boots the local embedded Postgres that Medusa develops against.
//
//   cd backend/tools && npm install && npm run db
//
// Keep it running in its own terminal; then start Medusa in another:
//   cd backend/apps/backend && npm run dev
//
// Data lives in <repo>/.medusa-pgdata (gitignored). Re-running is safe:
// the cluster is only initialised the first time.
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const databaseDir = resolve(repoRoot, ".medusa-pgdata");

// Must match DATABASE_URL in backend/apps/backend/.env
const pg = new EmbeddedPostgres({
  databaseDir,
  user: "medusa",
  password: "medusa",
  port: 55432,
  persistent: true,
});

// initdb refuses to run against a non-empty directory, so only do it once.
if (!existsSync(resolve(databaseDir, "PG_VERSION"))) {
  console.log(`Initialising a new cluster in ${databaseDir} ...`);
  await pg.initialise();
}

await pg.start();

try {
  await pg.createDatabase("medusa");
  console.log("Created database 'medusa'.");
} catch (err) {
  // Already there on every run after the first.
  if (!/already exists/i.test(err.message)) throw err;
}

console.log("Postgres READY on port 55432, database 'medusa'. Ctrl-C to stop.");

const stop = async () => {
  console.log("\nStopping Postgres ...");
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);

// Hold the process open so the server keeps running.
setInterval(() => {}, 1 << 30);
