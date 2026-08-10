// Prints the store-facing IDs the storefront needs (publishable key, region,
// sales channel, stock location). Run while dev-db.mjs is up:
//   cd backend/tools && npm run db:info
import pg from "pg";

const client = new pg.Client({
  host: "127.0.0.1",
  port: 55432,
  user: "medusa",
  password: "medusa",
  database: "medusa",
});

await client.connect();

const show = async (label, sql) => {
  try {
    const { rows } = await client.query(sql);
    console.log(`\n${label}`);
    console.table(rows);
  } catch (err) {
    console.log(`\n${label}: ERROR ${err.message}`);
  }
};

await show("API KEYS", "SELECT id, token, type, title FROM api_key WHERE deleted_at IS NULL");
await show("REGIONS", "SELECT id, name, currency_code FROM region WHERE deleted_at IS NULL");
await show("SALES CHANNELS", "SELECT id, name FROM sales_channel WHERE deleted_at IS NULL");
await show("STOCK LOCATIONS", "SELECT id, name FROM stock_location WHERE deleted_at IS NULL");
await show(
  "PRODUCT COUNT",
  "SELECT status, count(*)::int AS count FROM product WHERE deleted_at IS NULL GROUP BY status"
);

await client.end();
