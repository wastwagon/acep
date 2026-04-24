/**
 * Small production API for Docker / Coolify: health, readiness, CORS for browser calls from Next.
 * Extend with routes, auth, and persistence as Phase 2 lands.
 */

const express = require("express");
const { Pool } = require("pg");
const Redis = require("ioredis");

const PORT = Number(process.env.PORT || 3001);
const DATABASE_URL = process.env.DATABASE_URL;

function resolveRedisUrl() {
  const explicit = (process.env.REDIS_URL || "").trim();
  if (explicit) return explicit;
  const p = (process.env.REDIS_PASSWORD || "").trim();
  if (p) {
    return `redis://:${encodeURIComponent(p)}@redis:6379`;
  }
  return "redis://redis:6379";
}

let pool;
let redis;

function getPool() {
  if (!DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

function getRedis() {
  if (!redis) {
    redis = new Redis(resolveRedisUrl(), { maxRetriesPerRequest: 2 });
  }
  return redis;
}

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "512kb" }));

const allowOrigin = process.env.CORS_ORIGIN || "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (_req, res) => {
  res.json({ service: "acep-api", ok: true });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/ready", async (_req, res) => {
  const checks = { postgres: "unknown", redis: "unknown" };

  try {
    const p = getPool();
    if (!p) {
      checks.postgres = "skipped_no_database_url";
    } else {
      const r = await p.query("SELECT 1 AS ok");
      checks.postgres = r.rows[0]?.ok === 1 ? "ok" : "error";
    }
  } catch (e) {
    checks.postgres = "error";
    checks.postgresError = String(e.message || e);
  }

  try {
    const r = getRedis();
    const pong = await r.ping();
    checks.redis = pong === "PONG" ? "ok" : "error";
  } catch (e) {
    checks.redis = "error";
    checks.redisError = String(e.message || e);
  }

  const ok =
    checks.postgres === "ok" &&
    checks.redis === "ok";
  const softOk =
    checks.postgres === "skipped_no_database_url" &&
    checks.redis === "ok";

  if (ok || softOk) {
    return res.status(200).json({ ready: true, checks });
  }
  return res.status(503).json({ ready: false, checks });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal_error" });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`acep-api listening on ${PORT}`);
});

async function shutdown(signal) {
  console.log(`acep-api received ${signal}, closing…`);
  try {
    if (pool) await pool.end();
  } catch (e) {
    console.error(e);
  }
  try {
    if (redis) redis.disconnect();
  } catch (e) {
    console.error(e);
  }
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

for (const sig of ["SIGTERM", "SIGINT"]) {
  process.on(sig, () => shutdown(sig));
}
