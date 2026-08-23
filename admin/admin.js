"use strict";

/* =====================================================
   V8 DIGITAL — ADMIN
   PAINEL ADMINISTRATIVO
   Cloudflare Worker + Token JWT
   ===================================================== */

const TOKEN_STORAGE_KEY = "v8_admin_token";

/*
 * Worker da API
 *
 * Se js/config.js estiver configurado corretamente,
 * V8_API será utilizado.
 *
 * Caso contrário, este endereço será usado.
 */
const DEFAULT_API_URL =
  "https://v8digital-api.aisermelk.workers.dev";


/* =====================================================
   CAMPOS ADMINISTRÁVEIS
   ===================================================== */

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

const togglePassword =
  document.getElementById("togglePassword");

const passwordInput =
  document.getElementById("adminPassword");

const logoutButton =
  document.getElementById("logoutButton");

const resetButton =
  document.getElementById("resetButton");

const saveStatus =
  document.getElementById("saveStatus");


/* =====================================================
   CONFIGURAÇÃO DA API
   ===================================================== */

function getApiBaseUrl() {

  if (
    typeof V8_API !== "undefined" &&
    V8_API &&
    V8_API.baseUrl &&
    !V8_API.baseUrl.includes("SEU-USUARIO")
  ) {

    return V8_API.baseUrl.replace(/\/+$/, "");

  }

  return DEFAULT_API_URL;

}


function getProject() {

  if (
    typeof V8_API !== "undefined" &&
    V8_API &&
    V8_API.project
  ) {

    return V8_API.project;

  }

  return "v8digital";

}


function apiUrl(path) {

  const base = getApiBaseUrl();

  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return `${base}${path}`;

}


/* =====================================================
   DEBUG
   ===================================================== */

console.log("=================================");
console.log("V8 DIGITAL ADMIN");
console.log("API:", getApiBaseUrl());
console.log("Projeto:", getProject());
console.log("=================================");


/* =====================================================
   TOKEN
   ===================================================== */

function saveToken(token, remember = true) {

  if (!token) {
    console.error("Tentativa de salvar token vazio.");
    return;
  }

  /*
   * Limpa tokens antigos
   */
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);

  const storage =
    remember
      ? localStorage
      : sessionStorage;

  storage.setItem(
    TOKEN_STORAGE_KEY,
    token
  );

  console.log("Token salvo.");
}


function getToken() {

  const localToken =
    localStorage.getItem(TOKEN_STORAGE_KEY);

  if (localToken) {
    return localToken;
  }

  const sessionToken =
    sessionStorage.getItem(TOKEN_STORAGE_KEY);

  if (sessionToken) {
    return sessionToken;
  }

  return null;

}


function clearToken() {

  localStorage.removeItem(TOKEN_STORAGE_KEY);

  sessionStorage.removeItem(TOKEN_STORAGE_KEY);

  console.log("Token removido.");

}


function isLoggedIn() {

  return Boolean(getToken());

}


/* =====================================================
   TELA DE LOGIN
   ===================================================== */

function showLogin(message = "") {

  console.log("Abrindo tela de login.");

  if (dashboard) {
    dashboard.hidden = true;
    dashboard.style.display = "none";
  }

  if (loginScreen) {
    loginScreen.hidden = false;
    loginScreen.style.display = "grid";
  }

  if (loginError) {
    loginError.textContent = message;
  }

}


/* =====================================================
   TELA DO PAINEL
   ===================================================== */

function showDashboard() {

  console.log("Abrindo painel administrativo.");

  if (loginScreen) {
    loginScreen.hidden = true;
    loginScreen.style.display = "none";
  }

  if (dashboard) {
    dashboard.hidden = false;
    dashboard.style.display = "flex";
  }

  /*
   * Carrega configurações somente depois
   * de mostrar o painel.
   */
  loadSettings();

}


/* =====================================================
   STATUS
   ===================================================== */

function setStatus(message) {

  if (saveStatus) {
    saveStatus.textContent = message;
  }

  console.log("[ADMIN]", message);

}


/* =====================================================
   TRATAMENTO DE RESPOSTA
   ===================================================== */

async function readJson(response) {

  const text = await response.text();

  if (!text) {
    return {};
  }

  try {

    return JSON.parse(text);

  } catch (error) {

    console.error(
      "Resposta não é JSON:",
      text
    );

    return {
      error: text
    };

  }

}


/* =====================================================
   LOGIN
   ===================================================== */

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      if (loginError) {
        loginError.textContent = "";
      }

      const emailElement =
        document.getElementById("adminEmail");

      const passwordElement =
        document.getElementById("adminPassword");

      const rememberElement =
        document.getElementById("rememberLogin");

      const email =
        emailElement
          ? emailElement.value.trim()
          : "";

      const password =
        passwordElement
          ? passwordElement.value
          : "";

      const remember =
        rememberElement
          ? rememberElement.checked
          : true;


      /* ---------------------------------------------
         VALIDAÇÃO
         --------------------------------------------- */

      if (!email) {

        if (loginError) {
          loginError.textContent =
            "Digite seu e-mail.";
        }

        return;

      }


      if (!password) {

        if (loginError) {
          loginError.textContent =
            "Digite sua senha.";
        }

        return;

      }


      const submitButton =
        loginForm.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {

        submitButton.disabled = true;
        submitButton.textContent =
          "Entrando...";

      }


      try {

        console.log(
          "Tentando login:",
          email
        );

        const response =
          await fetch(
            apiUrl("/api/login"),
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
                "Accept":
                  "application/json"
              },

              body: JSON.stringify({
                email,
                password
              })
            }
          );


        console.log(
          "Status login:",
          response.status
        );


        const data =
          await readJson(response);


        console.log(
          "Resposta login:",
          data
        );


        /* ---------------------------------------------
           ERRO
           --------------------------------------------- */

        if (!response.ok) {

          if (response.status === 401) {

            if (loginError) {
              loginError.textContent =
                data.error ||
                "E-mail ou senha incorretos.";
            }

          } else {

            if (loginError) {
              loginError.textContent =
                data.error ||
                `Erro do servidor (${response.status}).`;
            }

          }

          return;

        }


        /* ---------------------------------------------
           TOKEN
           --------------------------------------------- */

        if (!data.token) {

          console.error(
            "Servidor respondeu sem token:",
            data
          );

          if (loginError) {
            loginError.textContent =
              "Login realizado, mas o servidor não enviou o token.";
          }

          return;

        }


        /*
         * SALVA TOKEN
         */
        saveToken(
          data.token,
          remember
        );


        /*
         * LIMPA CAMPO DE SENHA
         */
        if (passwordElement) {
          passwordElement.value = "";
        }


        /*
         * ABRE PAINEL
         */
        showDashboard();


      } catch (error) {

        console.error(
          "Erro no login:",
          error
        );


        if (loginError) {

          loginError.textContent =
            "Não foi possível conectar ao servidor. Verifique o Worker e o CORS.";

        }

      } finally {

        if (submitButton) {

          submitButton.disabled = false;

          submitButton.textContent =
            "Entrar no painel";

        }

      }

    }
  );

}


/* =====================================================
   MOSTRAR / OCULTAR SENHA
   ===================================================== */

if (togglePassword && passwordInput) {

  togglePassword.addEventListener(
    "click",
    function () {

      const isPassword =
        passwordInput.type === "password";


      passwordInput.type =
        isPassword
          ? "text"
          : "password";


      togglePassword.textContent =
        isPassword
          ? "Ocultar"
          : "Mostrar";

    }
  );

}


/* =====================================================
   LOGOUT
   ===================================================== */

if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    function () {

      clearToken();

      showLogin(
        "Você saiu do painel."
      );

    }
  );

}


/* =====================================================
   CARREGAR CONFIGURAÇÕES
   ===================================================== */

async function loadSettings() {

  setStatus(
    "Carregando configurações..."
  );


  try {

    const project =
      encodeURIComponent(
        getProject()
      );


    const url =
      apiUrl(
        `/api/config?project=${project}`
      );


    console.log(
      "Carregando configurações:",
      url
    );


    const response =
      await fetch(
        url,
        {
          method: "GET",

          headers: {
            "Accept":
              "application/json"
          }
        }
      );


    console.log(
      "Status configurações:",
      response.status
    );


    const data =
      await readJson(response);


    if (!response.ok) {

      /*
       * Se a API exigir autenticação para leitura
       */
      if (response.status === 401) {

        clearToken();

        showLogin(
          "Sua sessão expirou. Entre novamente."
        );

        return;

      }

      throw new Error(
        data.error ||
        "Falha ao carregar configurações."
      );

    }


    const config =
      data.config || data || {};


    /*
     * Preenche os campos
     */
    FIELDS.forEach(
      function (key) {

        const field =
          document.getElementById(key);

        if (!field) {
          return;
        }

        field.value =
          config[key] ?? "";

      }
    );


    setStatus(
      "Configurações carregadas"
    );


  } catch (error) {

    console.error(
      "Erro ao carregar configurações:",
      error
    );


    setStatus(
      "Não foi possível carregar as configurações"
    );

  }

}


/* =====================================================
   SALVAR CONFIGURAÇÕES
   ===================================================== */

if (settingsForm) {

  settingsForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const token =
        getToken();


      /*
       * Sem token
       */
      if (!token) {

        showLogin(
          "Sua sessão terminou. Entre novamente."
        );

        return;

      }


      /*
       * Monta configuração
       */
      const config = {};


      FIELDS.forEach(
        function (key) {

          const field =
            document.getElementById(key);

          if (!field) {
            return;
          }

          config[key] =
            field.value.trim();

        }
      );


      const saveButton =
        settingsForm.querySelector(
          ".save-button"
        );


      if (saveButton) {
        saveButton.disabled = true;
      }


      setStatus(
        "Salvando..."
      );


      try {

        const project =
          encodeURIComponent(
            getProject()
          );


        const response =
          await fetch(
            apiUrl(
              `/api/config?project=${project}`
            ),
            {
              method: "PUT",

              headers: {

                "Content-Type":
                  "application/json",

                "Accept":
                  "application/json",

                "Authorization":
                  `Bearer ${token}`

              },

              body:
                JSON.stringify(config)

            }
          );


        console.log(
          "Status salvar:",
          response.status
        );


        const data =
          await readJson(response);


        /*
         * TOKEN INVÁLIDO
         */
        if (response.status === 401) {

          clearToken();

          showLogin(
            "Sua sessão expirou. Entre novamente."
          );

          return;

        }


        /*
         * OUTROS ERROS
         */
        if (!response.ok) {

          setStatus(
            data.error ||
            `Erro ao salvar (${response.status})`
          );

          return;

        }


        /*
         * SUCESSO
         */
        setStatus(
          "✓ Configurações salvas"
        );


        setTimeout(
          function () {

            setStatus(
              "Configurações salvas no servidor"
            );

          },
          3000
        );


      } catch (error) {

        console.error(
          "Erro ao salvar:",
          error
        );


        setStatus(
          "Erro de conexão ao salvar"
        );


      } finally {

        if (saveButton) {
          saveButton.disabled = false;
        }

      }

    }
  );

}


/* =====================================================
   RESETAR FORMULÁRIO
   ===================================================== */

if (resetButton) {

  resetButton.addEventListener(
    "click",
    function () {

      const confirmed =
        confirm(
          "Limpar os campos do formulário?\n\n" +
          "Isso NÃO apaga os dados do servidor. " +
          "Eles só serão apagados do servidor se você clicar em Salvar."
        );


      if (!confirmed) {
        return;
      }


      FIELDS.forEach(
        function (key) {

          const field =
            document.getElementById(key);

          if (field) {
            field.value = "";
          }

        }
      );


      setStatus(
        "Campos limpos — clique em Salvar para confirmar"
      );

    }
  );

}


/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

function initializeAdmin() {

  console.log(
    "Inicializando painel V8 Digital..."
  );


  /*
   * Verifica elementos principais
   */
  if (!loginScreen) {
    console.error(
      "Elemento #loginScreen não encontrado."
    );
  }


  if (!dashboard) {
    console.error(
      "Elemento #dashboard não encontrado."
    );
  }


  /*
   * Verifica token
   */
  const token =
    getToken();


  if (token) {

    console.log(
      "Token encontrado. Abrindo painel..."
    );

    showDashboard();

    return;

  }


  /*
   * Sem token
   */
  console.log(
    "Nenhum token encontrado. Exibindo login."
  );


  showLogin();

}


/* =====================================================
   EXECUTAR
   ===================================================== */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeAdmin
  );

} else {

  initializeAdmin();

}
