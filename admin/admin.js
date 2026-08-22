"use strict";

/* =====================================================
   V8 DIGITAL — ADMIN
   ===================================================== */


/*
 * IMPORTANTE:
 *
 * Esta primeira versão utiliza armazenamento local
 * apenas para prototipagem.
 *
 * Depois vamos conectar ao Cloudflare Worker
 * + Google Sheets.
 */


/* =====================================================
   CONFIGURAÇÃO INICIAL
   ===================================================== */

const DEFAULT_CONFIG = {

  whatsapp: "54992756194",

  email:
    "aisermelquisedec@gmail.com",

  instagram:
    "@aisermelquisedec",

  facebook:
    "",

  metaPixel:
    "",

  googleAnalytics:
    "",

  googleTag:
    "",

  formspree:
    "https://formspree.io/f/xljrvnjo",

  siteName:
    "V8 Digital",

  siteDomain:
    "v8digital.pages.dev",

  whatsappMessage:
    "Olá! Gostaria de solicitar um orçamento."

};


/* =====================================================
   ELEMENTOS
   ===================================================== */

const loginScreen =
  document.getElementById(
    "loginScreen"
  );

const dashboard =
  document.getElementById(
    "dashboard"
  );

const loginForm =
  document.getElementById(
    "loginForm"
  );

const settingsForm =
  document.getElementById(
    "settingsForm"
  );

const loginError =
  document.getElementById(
    "loginError"
  );

const togglePassword =
  document.getElementById(
    "togglePassword"
  );

const passwordInput =
  document.getElementById(
    "adminPassword"
  );

const logoutButton =
  document.getElementById(
    "logoutButton"
  );

const resetButton =
  document.getElementById(
    "resetButton"
  );

const saveStatus =
  document.getElementById(
    "saveStatus"
  );


/* =====================================================
   LOGIN
   ===================================================== */

/*
 * LOGIN TEMPORÁRIO
 *
 * Depois substituiremos por autenticação real
 * no Cloudflare Worker.
 */

const ADMIN_EMAIL =
  "admin@v8digital.com";

const ADMIN_PASSWORD =
  "V8Digital@2026";


function isLoggedIn() {

  return (
    localStorage.getItem(
      "v8_admin_logged"
    ) === "true"
  );

}


function showDashboard() {

  loginScreen.hidden = true;

  dashboard.hidden = false;

  loadSettings();

}


function showLogin() {

  dashboard.hidden = true;

  loginScreen.hidden = false;

}


if (isLoggedIn()) {

  showDashboard();

}


/* =====================================================
   FORM LOGIN
   ===================================================== */

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const email =
        document.getElementById(
          "adminEmail"
        ).value.trim();

      const password =
        passwordInput.value;


      if (
        email === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {

        localStorage.setItem(
          "v8_admin_logged",
          "true"
        );

        if (
          document.getElementById(
            "rememberLogin"
          ).checked
        ) {

          localStorage.setItem(
            "v8_admin_remember",
            "true"
          );

        }

        loginError.textContent = "";

        showDashboard();

      } else {

        loginError.textContent =
          "E-mail ou senha incorretos.";

      }

    }
  );

}


/* =====================================================
   MOSTRAR SENHA
   ===================================================== */

if (togglePassword) {

  togglePassword.addEventListener(
    "click",
    () => {

      const isPassword =
        passwordInput.type ===
        "password";


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
    () => {

      localStorage.removeItem(
        "v8_admin_logged"
      );

      showLogin();

    }
  );

}


/* =====================================================
   CONFIGURAÇÕES
   ===================================================== */

function getConfig() {

  const saved =
    localStorage.getItem(
      "v8_site_config"
    );


  if (!saved) {

    return {
      ...DEFAULT_CONFIG
    };

  }


  try {

    return {
      ...DEFAULT_CONFIG,
      ...JSON.parse(saved)
    };

  } catch {

    return {
      ...DEFAULT_CONFIG
    };

  }

}


/* =====================================================
   CARREGAR CONFIGURAÇÕES
   ===================================================== */

function loadSettings() {

  const config =
    getConfig();


  Object.keys(config)
    .forEach(key => {

      const field =
        document.getElementById(
          key
        );


      if (field) {

        field.value =
          config[key] || "";

      }

    });


  setStatus(
    "Configurações carregadas"
  );

}


/* =====================================================
   SALVAR
   ===================================================== */

if (settingsForm) {

  settingsForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const config = {};


      Object.keys(DEFAULT_CONFIG)
        .forEach(key => {

          const field =
            document.getElementById(
              key
            );


          if (field) {

            config[key] =
              field.value.trim();

          }

        });


      localStorage.setItem(
        "v8_site_config",
        JSON.stringify(config)
      );


      setStatus(
        "✓ Configurações salvas"
      );


      setTimeout(
        () => {

          setStatus(
            "Configurações locais"
          );

        },
        3000
      );

    }
  );

}


/* =====================================================
   RESTAURAR PADRÃO
   ===================================================== */

if (resetButton) {

  resetButton.addEventListener(
    "click",
    () => {

      const confirmed =
        confirm(
          "Restaurar todas as configurações padrão?"
        );


      if (!confirmed) {
        return;
      }


      localStorage.removeItem(
        "v8_site_config"
      );


      loadSettings();


      setStatus(
        "Configurações restauradas"
      );

    }
  );

}


/* =====================================================
   STATUS
   ===================================================== */

function setStatus(
  message
) {

  if (saveStatus) {

    saveStatus.textContent =
      message;

  }

}
