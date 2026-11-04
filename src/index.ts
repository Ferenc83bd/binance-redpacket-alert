import { chromium } from "playwright";

const TOKEN = process.env.TELEGRAM_TOKEN!;
const CHAT_ID = process.env.CHAT_ID!;
const PROFILE = "BTCxiao6";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.binance.com/en/square", {
    waitUntil: "domcontentloaded"
  });

  console.log("Binance Square opened for", PROFILE);

  await browser.close();
}

main().catch(console.error);
