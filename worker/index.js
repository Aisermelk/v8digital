/**
 * V8 DIGITAL — WORKER (backend do admin)
 * ------------------------------------------------------------
 * Isso roda nos servidores da Cloudflare, não no navegador.
 * Guarda BINDINGS necessários (configure no painel do Worker):
 *
 *   KV Namespace (Bindings > KV Namespace):
 *     Nome da binding: CONFIG_KV
 *
 *   Secrets (Settings > Variables > Encrypt):
 *     ADMIN_EMAIL          -> seu e-mail de login
 *     ADMIN_PASSWORD_HASH  -> hash SHA-256 da sua senha (veja instruções no README)
 *     AUTH_SECRET          -> uma string aleatória qualquer, só pra assinar o token
 *
 *   Variável normal (não precisa ser secreta):
 *     ALLOWED_ORIGIN       -> ex: https://v8digital.pages.dev
 * ------------------------------------------------------------
 */

const TOKEN_TTL_SECONDS = 60 * 60 * 12; // token válido por 12 horas

// Campos que o admin pode salvar. Qualquer campo fora dessa lista é ignorado
// (evita que alguém injete chaves aleatórias na sua KV).
const ALLOWED_FIELDS = [
  "whatsapp",
  "email",
  "instagram",
  "facebook",
  "metaPixel",
  "googleAnalytics",
  "googleTag",
  "formspree",
  "siteName",
  "siteDomain",
  "whatsappMessage",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = buildCorsHeaders(env);

    // Preflight (CORS)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === "/api/login" && request.method === "POST") {
        return await handleLogin(request, env, corsHeaders);
      }

      if (url.pathname === "/api/config" && request.method === "GET") {
        return await handleGetConfig(url, env, corsHeaders);
      }

      if (url.pathname === "/api/config" && request.method === "PUT") {
        return await handleSaveConfig(request, url, env, corsHeaders);
      }

      return jsonResponse({ error: "Rota não encontrada." }, 404, corsHeaders);
    } catch (err) {
      return jsonResponse({ error: "Erro interno.", detail: String(err) }, 500, corsHeaders);
    }
  },
};

/* ============================================================
   LOGIN
   ============================================================ */

async function handleLogin(request, env, corsHeaders) {
  const body = await safeJson(request);

  if (!body || !body.email || !body.password) {
    return jsonResponse({ error: "E-mail e senha são obrigatórios." }, 400, corsHeaders);
  }

  const passwordHash = await sha256Hex(body.password);

  const emailOk = body.email.trim().toLowerCase() === env.ADMIN_EMAIL.trim().toLowerCase();
  const passwordOk = timingSafeEqual(passwordHash, env.ADMIN_PASSWORD_HASH);

  if (!emailOk || !passwordOk) {
    return jsonResponse({ error: "E-mail ou senha incorretos." }, 401, corsHeaders);
  }

  const token = await createToken(env, body.email);

  return jsonResponse({ token, expiresIn: TOKEN_TTL_SECONDS }, 200, corsHeaders);
}

/* ============================================================
   LER CONFIG (público — o site precisa disso pra montar a página,
   e nada aqui é secreto: pixel/analytics/whatsapp já ficam
   visíveis pra qualquer visitante do site de qualquer forma)
   ============================================================ */

async function handleGetConfig(url, env, corsHeaders) {
  const project = url.searchParams.get("project") || "v8digital";
  const raw = await env.CONFIG_KV.get(configKey(project));
  const config = raw ? JSON.parse(raw) : {};

  return jsonResponse({ project, config }, 200, corsHeaders);
}

/* ============================================================
   SALVAR CONFIG (exige token válido)
   ============================================================ */

async function handleSaveConfig(request, url, env, corsHeaders) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  const valid = await verifyToken(env, token);
  if (!valid) {
    return jsonResponse({ error: "Sessão inválida ou expirada. Faça login novamente." }, 401, corsHeaders);
  }

  const project = url.searchParams.get("project") || "v8digital";
  const body = await safeJson(request);

  if (!body || typeof body !== "object") {
    return jsonResponse({ error: "Corpo da requisição inválido." }, 400, corsHeaders);
  }

  // Mantém apenas os campos permitidos, ignora qualquer coisa fora da lista.
  const clean = {};
  for (const field of ALLOWED_FIELDS) {
    if (typeof body[field] === "string") {
      clean[field] = body[field].trim();
    }
  }

  await env.CONFIG_KV.put(configKey(project), JSON.stringify(clean));

  return jsonResponse({ project, config: clean }, 200, corsHeaders);
}

function configKey(project) {
  return `config:${project}`;
}

/* ============================================================
   TOKEN (assinado com HMAC, sem precisar guardar sessão em lugar nenhum)
   ============================================================ */

async function createToken(env, email) {
  const payload = {
    email,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmacSha256Hex(env.AUTH_SECRET, payloadB64);

  return `${payloadB64}.${signature}`;
}

async function verifyToken(env, token) {
  if (!token || !token.includes(".")) return false;

  const [payloadB64, signature] = token.split(".");
  const expectedSignature = await hmacSha256Hex(env.AUTH_SECRET, payloadB64);

  if (!timingSafeEqual(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hashBuffer);
}

async function hmacSha256Hex(secret, text) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return bufferToHex(signature);
}

function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  return atob(padded);
}

async function safeJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function buildCorsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      ...corsHeaders,
    },
  });
}
