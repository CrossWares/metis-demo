// Vercel Edge Function — Anthropic APIへのプロキシ
// クライアント(App.jsx)はここを叩くだけで、APIキーは一切ブラウザに渡らない。
// ANTHROPIC_API_KEY は Vercel の Project Settings > Environment Variables に
// サーバー側変数として設定すること(VITE_接頭辞をつけないこと。つけるとクライアントに埋め込まれてしまう)。

export const config = { runtime: "edge" };

const ALLOWED_MODELS = ["claude-sonnet-4-20250514", "claude-sonnet-4-6"];
const MAX_TOKENS_CAP = 2000; // 想定外の大量課金を防ぐ上限

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server not configured (ANTHROPIC_API_KEY missing)" }), { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  if (!ALLOWED_MODELS.includes(body.model)) {
    return new Response(JSON.stringify({ error: "Model not allowed" }), { status: 400 });
  }
  if (typeof body.max_tokens !== "number" || body.max_tokens > MAX_TOKENS_CAP) {
    body.max_tokens = MAX_TOKENS_CAP;
  }

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (body.stream) {
    return new Response(anthropicRes.body, {
      status: anthropicRes.status,
      headers: { "Content-Type": "text/event-stream" },
    });
  }

  const data = await anthropicRes.text();
  return new Response(data, {
    status: anthropicRes.status,
    headers: { "Content-Type": "application/json" },
  });
}
