import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "screenshots");
const viewport = { width: 1920, height: 1080 };
const fallbackTotalSections = 15;
const transitionWaitMs = 900;
const defaultUrl = "http://127.0.0.1:5173";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pad = (value) => String(value).padStart(2, "0");

async function waitForServer(url, timeoutMs = 20_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server is not ready yet.
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for Vite dev server at ${url}`);
}

function startViteServer() {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const child = spawn(
    npmCommand,
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5173", "--strictPort"],
    {
      cwd: rootDir,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, BROWSER: "none" },
    }
  );

  child.stdout.on("data", (chunk) => {
    const text = chunk.toString().trim();
    if (text) console.log(`[vite] ${text}`);
  });

  child.stderr.on("data", (chunk) => {
    const text = chunk.toString().trim();
    if (text) console.error(`[vite] ${text}`);
  });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[vite] exited with code ${code}`);
    }
  });

  return child;
}

function stopProcessTree(child) {
  if (!child?.pid) return;

  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
      stdio: "ignore",
    });
    return;
  }

  child.kill("SIGTERM");
}

async function waitForFonts(page) {
  await page.evaluate(async () => {
    if ("fonts" in document && document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
}

async function getCounter(page) {
  const text = await page.locator("header").textContent({ timeout: 5_000 });
  const match = text?.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
  if (!match) return null;
  return {
    current: Number(match[1]),
    total: Number(match[2]),
  };
}

async function waitForCounter(page, expectedCurrent, expectedTotal) {
  await page.waitForFunction(
    ({ current, total }) => {
      const headerText = document.querySelector("header")?.textContent ?? "";
      const match = headerText.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
      return Boolean(match && Number(match[1]) === current && Number(match[2]) === total);
    },
    { current: expectedCurrent, total: expectedTotal },
    { timeout: 10_000 }
  );
}

async function captureSection(page, sectionNumber, totalSections) {
  const fileName = `vms247-section-${pad(sectionNumber)}.png`;
  const filePath = path.join(outputDir, fileName);
  console.log(`Capturing section ${pad(sectionNumber)}/${pad(totalSections)}...`);
  await page.screenshot({ path: filePath, fullPage: false });
  console.log(`Saved screenshots/${fileName}`);
}

async function main() {
  const externalUrl = process.env.SCREENSHOT_URL;
  const appUrl = externalUrl || defaultUrl;
  let viteProcess = null;

  if (externalUrl) {
    console.log(`Using SCREENSHOT_URL=${externalUrl}`);
  } else {
    console.log(`Starting Vite dev server at ${defaultUrl}...`);
    viteProcess = startViteServer();
  }

  try {
    await waitForServer(appUrl);
  } catch (error) {
    if (!externalUrl) {
      console.error("Could not start/connect to the Vite dev server automatically.");
      console.error("Try running `npm.cmd run dev` in another terminal, then:");
      console.error(`$env:SCREENSHOT_URL="${defaultUrl}"; npm.cmd run screenshots`);
    }
    throw error;
  }

  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });

  try {
    await page.goto(appUrl, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    await waitForFonts(page);
    await waitForCounter(page, 1, fallbackTotalSections).catch(() => {});
    await sleep(transitionWaitMs);

    const parsedCounter = await getCounter(page);
    const totalSections = parsedCounter?.total || fallbackTotalSections;

    await captureSection(page, 1, totalSections);

    for (let section = 2; section <= totalSections; section += 1) {
      await page.locator("body").click({ position: { x: 20, y: 20 } });
      await page.keyboard.press("ArrowDown");
      await waitForCounter(page, section, totalSections);
      await sleep(transitionWaitMs);
      await captureSection(page, section, totalSections);
    }

    console.log(`Done. Captured ${totalSections} screenshots in screenshots/.`);
  } finally {
    await browser.close();
    if (viteProcess) {
      stopProcessTree(viteProcess);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
