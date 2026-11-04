import { execFileSync } from "node:child_process";
import fs from "node:fs";

const TOKEN = process.env.TELEGRAM_TOKEN!;
const CHAT = process.env.CHAT_ID!;
const UID = process.env.SQUARE_UID;

if (!TOKEN || !CHAT || !UID) {
  throw new Error("Missing TELEGRAM_TOKEN, CHAT_ID or SQUARE_UID");
}

const CLI = "node_modules/binance-square-cli/dist/index.js";
const seenFile = "seen.json";

async function telegram(text: string) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT, text })
  });
  if (!r.ok) throw new Error(await r.text());
}

async function main() {
  const raw = execFileSync(
    "node",
    [CLI, "user-posts", UID, "--uid", "--pretty"],
    { encoding: "utf8" }
  );

  const data = JSON.parse(raw);
  const posts = Array.isArray(data) ? data : data.data ?? [];
  const seen = new Set<string>(
    fs.existsSync(seenFile) ? JSON.parse(fs.readFileSync(seenFile, "utf8")) : []
  );

  for (const post of posts) {
    const id = String(post.id ?? "");
    const body = String(post.bodyTextOnly ?? "").toLowerCase();

    if (!id || seen.has(id)) continue;

    if (/red[\s-]*(packet|envelope)|红包/i.test(body)) {
      await telegram(
        `🎁 BTCxiao6 опублікував Red Packet!\nhttps://www.binance.com/en/square/post/${id}`
      );
    }
    seen.add(id);
  }

  fs.writeFileSync(seenFile, JSON.stringify([...seen]));
  console.log(`Перевірено ${posts.length} дописів`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
