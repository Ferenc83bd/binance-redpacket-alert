import { execFileSync } from "node:child_process";

const TOKEN = process.env.TELEGRAM_TOKEN!;
const CHAT_ID = process.env.CHAT_ID!;
const PROFILE = "BTCxiao6";
const UID = "square-creator-d7802adf30bfd";

async function main() {
  const result = execFileSync(
    "node",
    ["node_modules/binance-square-cli/dist/index.js", "user-posts", UID, "--uid", "--pretty"],
    { encoding: "utf8" }
  );

  console.log(result);

  const posts = JSON.parse(result);
  const items = Array.isArray(posts) ? posts : posts.data ?? [];

  for (const post of items) {
    const content = JSON.stringify(post).toLowerCase();

    if (
      content.includes("red packet") ||
      content.includes("red envelope") ||
      content.includes("红包")
    ) {
      const id = String(post.id ?? post.postId ?? "");
      if (!id) continue;

      const response = await fetch(
        `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: `🎁 BTCxiao6 опублікував Red Packet!\nhttps://www.binance.com/en/square/post/${id}`
          })
        }
      );

      console.log(await response.text());
    }
  }
}

main().catch(console.error);
