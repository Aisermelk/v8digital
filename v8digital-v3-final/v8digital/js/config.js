/* =========================================================
   V8 DIGITAL — CONFIG.JS
   Aponta para onde o site busca suas configurações (Worker).
   Isso NÃO guarda dados sensíveis — só o endereço da API.
   ========================================================= */

"use strict";

const V8_API = {
  // Depois de publicar o Worker, troque pela URL real que a
  // Cloudflare vai te dar (algo como:
  // "https://v8digital-api.SEU-USUARIO.workers.dev")
  baseUrl: "https://v8digital-api.aisermelk.workers.dev",

  // Identifica qual configuração buscar na KV. Ao reaproveitar
  // esse mesmo Worker em outro site, troque só esse valor.
  project: "v8digital",
};
