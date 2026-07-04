#!/usr/bin/env node
/**
 * The Infinite Puzzle — Step 1 asset pipeline.
 *
 * Text prompt → Meshy text-to-3D (preview → refine, PBR) → download GLB
 * → gltf-transform optimise (Draco + WebP, 2K textures) → upload to R2
 * → append CREDITS.md + assets/catalog.json.
 *
 * Designed to run in GitHub Actions. No third-party npm deps in this file
 * (uses global fetch); gltf-transform CLI + wrangler are installed by the
 * workflow.
 *
 * Env:
 *   MESHY_API_KEY          required (unless --dry-run)
 *   CLOUDFLARE_API_TOKEN   required for uploads (unless --dry-run)
 *   CLOUDFLARE_ACCOUNT_ID  required for uploads (unless --dry-run)
 *   R2_BUCKET              default "infinite-puzzle-assets"
 *
 * Usage:
 *   node scripts/generate-assets.mjs [--batch core|dressing|all]
 *     [--only <key-substring>] [--limit N] [--dry-run] [--no-skip-existing]
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ---------- config ----------
const MESHY_BASE = "https://api.meshy.ai/openapi/v2/text-to-3d";
const MESHY_BALANCE = "https://api.meshy.ai/openapi/v1/balance";
const POLL_INTERVAL_MS = 15_000;
const TASK_TIMEOUT_MS = 30 * 60_000; // per Meshy task
const CONCURRENCY = 3;
const MAX_PROMPT_CHARS = 600; // Meshy hard limit

const args = process.argv.slice(2);
const opt = {
  batch: argValue("--batch") ?? "core",
  only: argValue("--only"),
  limit: argValue("--limit") ? Number(argValue("--limit")) : Infinity,
  dryRun: args.includes("--dry-run"),
  skipExisting: !args.includes("--no-skip-existing"),
};

const MESHY_API_KEY = process.env.MESHY_API_KEY;
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID;
const BUCKET = process.env.R2_BUCKET || "infinite-puzzle-assets";

const repoRoot = process.cwd();
const workDir = path.join(repoRoot, ".asset-work");
const catalogPath = path.join(repoRoot, "assets", "catalog.json");
const creditsPath = path.join(repoRoot, "CREDITS.md");
const thumbsDir = path.join(repoRoot, "assets", "thumbnails");

function argValue(name) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : undefined;
}

function log(msg) {
  const t = new Date().toISOString().slice(11, 19);
  console.log(`[${t}] ${msg}`);
}

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

// ---------- manifest ----------
const manifest = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "assets", "manifest.json"), "utf8"),
);

let selected = manifest.assets.filter(
  (a) => opt.batch === "all" || a.batch === opt.batch,
);
if (opt.only) selected = selected.filter((a) => a.key.includes(opt.only));
selected = selected.slice(0, opt.limit);

if (selected.length === 0) fail("No assets matched the given filters.");
log(
  `Selected ${selected.length} asset(s) [batch=${opt.batch}` +
    (opt.only ? `, only=${opt.only}` : "") +
    `]${opt.dryRun ? " (DRY RUN)" : ""}`,
);

for (const a of selected) {
  const full = a.prompt + manifest.styleSuffix;
  if (full.length > MAX_PROMPT_CHARS)
    fail(`Prompt for ${a.key} is ${full.length} chars (max ${MAX_PROMPT_CHARS}).`);
}

if (opt.dryRun) {
  for (const a of selected)
    log(`DRY RUN would generate: ${a.key} ← "${a.prompt.slice(0, 60)}…"`);
  log("Dry run complete. Prompts validated.");
  process.exit(0);
}

if (!MESHY_API_KEY) fail("MESHY_API_KEY is not set.");
if (!CF_TOKEN) fail("CLOUDFLARE_API_TOKEN is not set.");
if (!CF_ACCOUNT) fail("CLOUDFLARE_ACCOUNT_ID is not set.");

fs.mkdirSync(workDir, { recursive: true });
fs.mkdirSync(thumbsDir, { recursive: true });

// ---------- helpers ----------
async function meshyFetch(url, init = {}, attempt = 1) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${MESHY_API_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (res.status === 429 && attempt <= 5) {
    const wait = attempt * 20_000;
    log(`Meshy rate-limited (429); waiting ${wait / 1000}s…`);
    await sleep(wait);
    return meshyFetch(url, init, attempt + 1);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Meshy ${init.method || "GET"} ${url} → ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function createTask(body) {
  const json = await meshyFetch(MESHY_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const id = json.result ?? json.id;
  if (!id) throw new Error(`No task id in response: ${JSON.stringify(json).slice(0, 200)}`);
  return id;
}

async function waitForTask(id, label) {
  const start = Date.now();
  for (;;) {
    if (Date.now() - start > TASK_TIMEOUT_MS)
      throw new Error(`${label} task ${id} timed out after ${TASK_TIMEOUT_MS / 60000} min`);
    const task = await meshyFetch(`${MESHY_BASE}/${id}`);
    if (task.status === "SUCCEEDED") return task;
    if (task.status === "FAILED" || task.status === "CANCELED")
      throw new Error(
        `${label} task ${id} ${task.status}: ${task.task_error?.message ?? "no detail"}`,
      );
    log(`  ${label} ${id.slice(0, 8)}… ${task.status} ${task.progress ?? 0}%`);
    await sleep(POLL_INTERVAL_MS);
  }
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url.slice(0, 120)}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function run(cmd, cmdArgs) {
  return execFileSync(cmd, cmdArgs, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
}

async function listExistingKeys() {
  // Cloudflare REST list (needs an account-level token). Gracefully degrade.
  const keys = new Set();
  try {
    let cursor;
    do {
      const url = new URL(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/r2/buckets/${BUCKET}/objects`,
      );
      url.searchParams.set("per_page", "1000");
      if (cursor) url.searchParams.set("cursor", cursor);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${CF_TOKEN}` },
      });
      if (!res.ok) throw new Error(`list objects → ${res.status}`);
      const json = await res.json();
      for (const o of json.result ?? []) keys.add(o.key);
      cursor = json.result_info?.cursor && (json.result ?? []).length > 0
        ? json.result_info.cursor
        : undefined;
    } while (cursor);
    log(`R2 currently holds ${keys.size} object(s).`);
  } catch (e) {
    log(`Could not list R2 objects (${e.message}); will not skip existing.`);
  }
  return keys;
}

function uploadToR2(key, file) {
  run("npx", [
    "wrangler",
    "r2",
    "object",
    "put",
    `${BUCKET}/${key}`,
    "--file",
    file,
    "--content-type",
    "model/gltf-binary",
    "--remote",
  ]);
}

function loadCatalog() {
  try {
    return JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  } catch {
    return { assets: {} };
  }
}

function saveCatalog(cat) {
  fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
  fs.writeFileSync(catalogPath, JSON.stringify(cat, null, 2) + "\n");
}

function appendCredits(entry) {
  const today = new Date().toISOString().slice(0, 10);
  const row = `| ${entry.key} | Meshy | Owned (Pro) | "${entry.prompt.slice(0, 70)}…" | ${today} |\n`;
  if (!fs.existsSync(creditsPath)) {
    fs.writeFileSync(
      creditsPath,
      "# Asset Licence Log\n\n" +
        "| Asset (R2 key) | Source | Licence | Prompt / URL | Date |\n" +
        "|---|---|---|---|---|\n",
    );
  }
  const existing = fs.readFileSync(creditsPath, "utf8");
  if (!existing.includes(`| ${entry.key} |`)) fs.appendFileSync(creditsPath, row);
}

// ---------- per-asset pipeline ----------
async function processAsset(asset) {
  const key = `${asset.key}.glb`;
  const prompt = asset.prompt + manifest.styleSuffix;
  const m = manifest.meshy;
  log(`▶ ${asset.key} — starting`);

  // 1. preview (geometry)
  const previewId = await createTask({
    mode: "preview",
    prompt,
    ai_model: m.aiModel,
    model_type: m.modelType,
    topology: m.topology,
    target_polycount: m.targetPolycount,
    origin_at: m.originAt,
  });
  const preview = await waitForTask(previewId, `preview:${asset.key}`);

  // 2. refine (PBR textures)
  const refineId = await createTask({
    mode: "refine",
    preview_task_id: previewId,
    ai_model: m.aiModel,
    enable_pbr: m.enablePbr,
  });
  const refined = await waitForTask(refineId, `refine:${asset.key}`);

  const glbUrl = refined.model_urls?.glb;
  if (!glbUrl) throw new Error(`No GLB url on refined task for ${asset.key}`);

  // 3. download
  const rawPath = path.join(workDir, "raw", `${asset.key.replaceAll("/", "_")}.glb`);
  const rawBytes = await download(glbUrl, rawPath);

  // thumbnail for review
  if (refined.thumbnail_url) {
    try {
      await download(
        refined.thumbnail_url,
        path.join(thumbsDir, `${asset.key.replaceAll("/", "_")}.png`),
      );
    } catch {
      /* non-fatal */
    }
  }

  // 4. optimise (MANDATORY)
  const optPath = path.join(workDir, "opt", `${asset.key.replaceAll("/", "_")}.glb`);
  fs.mkdirSync(path.dirname(optPath), { recursive: true });
  run("npx", [
    "gltf-transform",
    "optimize",
    rawPath,
    optPath,
    "--compress",
    "draco",
    "--texture-compress",
    "webp",
    "--texture-size",
    String(manifest.budget.textureSize),
  ]);
  const optBytes = fs.statSync(optPath).size;
  const overBudget = optBytes > manifest.budget.maxOptimizedBytes;
  log(
    `  ${asset.key}: ${(rawBytes / 1e6).toFixed(1)} MB → ${(optBytes / 1e6).toFixed(1)} MB` +
      (overBudget ? "  ⚠ over budget" : ""),
  );

  // 5. upload
  uploadToR2(key, optPath);
  log(`  ${asset.key}: uploaded to r2://${BUCKET}/${key}`);

  return {
    key,
    prompt: asset.prompt,
    fullPrompt: prompt,
    previewTaskId: previewId,
    refineTaskId: refineId,
    creditsUsed: (preview.consumed_credits ?? 0) + (refined.consumed_credits ?? 0),
    rawBytes,
    optBytes,
    overBudget,
    targetSize: asset.targetSize,
    thumbnail: `assets/thumbnails/${asset.key.replaceAll("/", "_")}.png`,
    generatedAt: new Date().toISOString(),
  };
}

// ---------- main ----------
const existing = opt.skipExisting ? await listExistingKeys() : new Set();
const queue = selected.filter((a) => {
  if (existing.has(`${a.key}.glb`)) {
    log(`↷ ${a.key} already in R2 — skipping (use --no-skip-existing to force)`);
    return false;
  }
  return true;
});

const results = [];
const failures = [];
let idx = 0;
async function worker() {
  for (;;) {
    const i = idx++;
    if (i >= queue.length) return;
    const asset = queue[i];
    try {
      results.push(await processAsset(asset));
    } catch (e) {
      log(`✖ ${asset.key} FAILED: ${e.message}`);
      failures.push({ key: asset.key, error: e.message });
    }
  }
}
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));

// record results
const catalog = loadCatalog();
for (const r of results) {
  catalog.assets[r.key] = r;
  appendCredits(r);
}
saveCatalog(catalog);

// balance + summary
let balance = "unknown";
try {
  const b = await meshyFetch(MESHY_BALANCE);
  balance = b.balance ?? b.result ?? JSON.stringify(b);
} catch {
  /* non-fatal */
}

const totalCredits = results.reduce((s, r) => s + (r.creditsUsed || 0), 0);
const summaryLines = [
  `## Asset pipeline run`,
  ``,
  `| Asset | Raw | Optimised | Credits |`,
  `|---|---|---|---|`,
  ...results.map(
    (r) =>
      `| ${r.key} | ${(r.rawBytes / 1e6).toFixed(1)} MB | ${(r.optBytes / 1e6).toFixed(1)} MB${r.overBudget ? " ⚠" : ""} | ${r.creditsUsed} |`,
  ),
  ``,
  `Generated: **${results.length}**, failed: **${failures.length}**, skipped (already in R2): **${selected.length - queue.length}**`,
  `Credits used this run: **${totalCredits}** — Meshy balance now: **${balance}**`,
  ...failures.map((f) => `- ✖ ${f.key}: ${f.error}`),
];
const summary = summaryLines.join("\n");
console.log("\n" + summary);
if (process.env.GITHUB_STEP_SUMMARY)
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + "\n");

process.exit(failures.length > 0 ? 1 : 0);
