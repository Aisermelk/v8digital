"use strict";

/* =====================================================
   V8 DIGITAL — ADMIN
   Agora fala de verdade com o Worker (Cloudflare) —
   login e configurações deixam de ser só locais.
   ===================================================== */

const TOKEN_STORAGE_KEY = "v8_admin_token";

const FIELDS = [
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


/* =====================================================
   ELEMENTOS
   ===================================================== */

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const settingsForm = document.getElementById("settingsForm");
const loginError = document.getElementById("loginError");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("adminPassword");
const logoutButton = document.getElementById("logoutButton");
const resetButton = document.getElementById("resetButton");
const saveStatus = document.getElementById("saveStatus");


/* =====================================================
   VERIFICAÇÃO DE CONFIGURAÇÃO
   ===================================================== */

function workerConfigured() {
  return (
    typeof V8_API !== "undefined" &&
    V8_API.baseUrl &&
    !V8_API.baseUrl.includes("SEU-USUARIO")
  );
}

function apiUrl(path) {
  return `${V8_API.baseUrl}${path}`;
}


/* =====================================================
   TOKEN (sessão)
   ===================================================== */

function saveToken(token, remember) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_STORAGE_KEY, token);
}

function getToken() {
  return (
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    sessionStorage.getItem(TOKEN_STORAGE_KEY)
  );
}

function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}

function isLoggedIn() {
  return Boolean(getToken());
}


/* =====================================================
   TELAS
   ===================================================== */

function showDashboard() {
  loginScreen.hidden = true;
  dashboard.hidden = false;
  loadSettings();
}

function showLogin(message) {
  dashboard.hidden = true;
  loginScreen.hidden = false;
  if (message) loginError.textContent = message;
}

if (!workerConfigured()) {

  showLogin(
    "O endereço do Worker ainda não foi configurado em js/config.js — o admin não pode funcionar sem isso."
  );

  if (loginForm) {
    loginForm.querySelector('button[type="submit"]').disabled = true;
  }

} else if (isLoggedIn()) {

  showDashboard();

}


/* =====================================================
   LOGIN
   ===================================================== */

if (loginForm) {

  loginForm.addEventListener("submit", async event => {

    event.preventDefault();

    loginError.textContent = "";

    const email = document.getElementById("adminEmail").value.trim();
    const password = passwordInput.value;
    const remember = document.getElementById("rememberLogin").checked;

    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Entrando...";

    try {

      const response = await fetch(apiUrl("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        loginError.textContent = data.error || "Não foi possível entrar.";
        return;
      }

      saveToken(data.token, remember);
      showDashboard();

    } catch (err) {

      loginError.textContent =
        "Não foi possível falar com o servidor. Verifique sua conexão.";

    } finally {

      submitButton.disabled = false;
      submitButton.textContent = "Entrar no painel";

    }

  });

}


/* =====================================================
   MOSTRAR SENHA
   ===================================================== */

if (togglePassword) {

  togglePassword.addEventListener("click", () => {

    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Ocultar" : "Mostrar";

  });

}


/* =====================================================
   LOGOUT
   ===================================================== */

if (logoutButton) {

  logoutButton.addEventListener("click", () => {
    clearToken();
    showLogin();
  });

}


/* =====================================================
   CARREGAR CONFIGURAÇÕES (endpoint público)
   ===================================================== */

async function loadSettings() {

  setStatus("Carregando configurações...");

  try {

    const response = await fetch(
      apiUrl(`/api/config?project=${encodeURIComponent(V8_API.project)}`)
    );

    if (!response.ok) throw new Error("Falha ao carregar.");

    const data = await response.json();
    const config = data.config || {};

    FIELDS.forEach(key => {
      const field = document.getElementById(key);
      if (field) field.value = config[key] || "";
    });

    setStatus("Configurações carregadas");

  } catch (err) {

    setStatus("Não foi possível carregar as configurações");

  }

}


/* =====================================================
   SALVAR (endpoint autenticado)
   ===================================================== */

if (settingsForm) {

  settingsForm.addEventListener("submit", async event => {

    event.preventDefault();

    const config = {};
    FIELDS.forEach(key => {
      const field = document.getElementById(key);
      if (field) config[key] = field.value.trim();
    });

    const saveButton = settingsForm.querySelector(".save-button");
    saveButton.disabled = true;
    setStatus("Salvando...");

    try {

      const response = await fetch(
        apiUrl(`/api/config?project=${encodeURIComponent(V8_API.project)}`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(config),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        // Sessão expirada — manda pro login de novo.
        if (response.status === 401) {
          clearToken();
          showLogin("Sua sessão expirou. Entre novamente.");
          return;
        }

        setStatus(data.error || "Não foi possível salvar");
        return;

      }

      setStatus("✓ Configurações salvas");
      setTimeout(() => setStatus("Configurações salvas no servidor"), 3000);

    } catch (err) {

      setStatus("Erro de conexão ao salvar");

    } finally {

      saveButton.disabled = false;

    }

  });

}


/* =====================================================
   RESTAURAR (limpa os campos do formulário, não apaga
   nada no servidor até você clicar em Salvar)
   ===================================================== */

if (resetButton) {

  resetButton.addEventListener("click", () => {

    const confirmed = confirm(
      "Limpar os campos do formulário? (isso não apaga nada salvo até você clicar em Salvar)"
    );

    if (!confirmed) return;

    FIELDS.forEach(key => {
      const field = document.getElementById(key);
      if (field) field.value = "";
    });

    setStatus("Campos limpos — clique em Salvar para confirmar");

  });

}


/* =====================================================
   STATUS
   ===================================================== */

function setStatus(message) {
  if (saveStatus) saveStatus.textContent = message;
}
