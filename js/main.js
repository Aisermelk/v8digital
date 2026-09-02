/* =========================================================
   V8 DIGITAL — MAIN.JS
   Controle geral da interface
   ========================================================= */

"use strict";


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initMobileMenu();

    initSmoothScroll();

    initHeaderScroll();

    initRevealAnimations();

    initProjectButtons();

    initContactForm();

    initCurrentYear();

    initExternalLinks();

  }
);


/* =========================================================
   MENU MOBILE
   ========================================================= */

function initMobileMenu() {

  const toggle =
    document.querySelector(".menu-toggle");

  const nav =
    document.querySelector(".main-nav");


  if (!toggle || !nav) {
    return;
  }


  toggle.addEventListener(
    "click",
    () => {

      const isOpen =
        nav.classList.toggle("active");


      toggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );


      document.body.classList.toggle(
        "menu-open",
        isOpen
      );

    }
  );


  /*
   * Fecha o menu quando um link
   * da navegação é selecionado.
   */

  nav.querySelectorAll("a").forEach(
    link => {

      link.addEventListener(
        "click",
        () => {

          nav.classList.remove(
            "active"
          );

          toggle.setAttribute(
            "aria-expanded",
            "false"
          );

          document.body.classList.remove(
            "menu-open"
          );

        }
      );

    }
  );


  /*
   * Fecha o menu ao clicar fora.
   */

  document.addEventListener(
    "click",
    event => {

      if (
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {

        nav.classList.remove(
          "active"
        );

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );

        document.body.classList.remove(
          "menu-open"
        );

      }

    }
  );

}


/* =========================================================
   NAVEGAÇÃO SUAVE
   ========================================================= */

function initSmoothScroll() {

  const links =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  links.forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const targetId =
          link.getAttribute("href");


        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetId
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        const header =
          document.querySelector(
            ".site-header"
          );


        const headerHeight =
          header
            ? header.offsetHeight
            : 0;


        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          15;


        window.scrollTo({

          top: targetPosition,

          behavior: "smooth"

        });


        /*
         * Atualiza a URL sem
         * provocar salto da página.
         */

        history.pushState(
          null,
          "",
          targetId
        );

      }
    );

  });

}


/* =========================================================
   HEADER AO ROLAR
   ========================================================= */

function initHeaderScroll() {

  const header =
    document.querySelector(
      ".site-header"
    );


  if (!header) {
    return;
  }


  function updateHeader() {

    if (window.scrollY > 30) {

      header.classList.add(
        "scrolled"
      );

    } else {

      header.classList.remove(
        "scrolled"
      );

    }

  }


  updateHeader();


  window.addEventListener(
    "scroll",
    updateHeader,
    {
      passive: true
    }
  );

}


/* =========================================================
   ANIMAÇÕES DE ENTRADA
   ========================================================= */

function initRevealAnimations() {

  const elements =
    document.querySelectorAll(
      ".service-card, " +
      ".project-card, " +
      ".process-card, " +
      ".section-heading, " +
      ".about-grid, " +
      ".contact-grid, " +
      ".final-cta-content"
    );


  if (!elements.length) {
    return;
  }


  /*
   * Fallback para navegadores sem
   * suporte ao IntersectionObserver.
   */

  if (
    !("IntersectionObserver" in window)
  ) {

    elements.forEach(
      element => {

        element.classList.add(
          "is-visible"
        );

      }
    );

    return;

  }


  elements.forEach(
    element => {

      element.classList.add(
        "reveal"
      );

    }
  );


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "is-visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold: 0.12,

        rootMargin:
          "0px 0px -50px 0px"
      }
    );


  elements.forEach(
    element => {

      observer.observe(element);

    }
  );

}


/* =========================================================
   BOTÕES DOS PROJETOS
   ========================================================= */

function initProjectButtons() {

  const buttons =
    document.querySelectorAll(
      "[data-project-id]"
    );


  if (!buttons.length) {
    return;
  }


  buttons.forEach(button => {

    button.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();


          const id =
            button.dataset.projectId;


          if (
            window.V8Projects &&
            typeof
              window.V8Projects.openProjectModal ===
              "function"
          ) {

            window.V8Projects.openProjectModal(
              id
            );

          }

        }

      }
    );

  });

}


/* =========================================================
   FORMULÁRIO DE CONTATO
   ========================================================= */

function initContactForm() {

  const form =
    document.querySelector(
      "#contact-form"
    );


  if (!form) {
    return;
  }


  /*
   * O V8 Loader será responsável por
   * definir o action do Formspree.
   *
   * Aqui cuidamos apenas da experiência
   * durante o envio.
   */


  let sending = false;


  form.addEventListener(
    "submit",
    event => {

      if (sending) {

        event.preventDefault();

        return;

      }


      sending = true;


      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {

        submitButton.disabled = true;

        submitButton.dataset.originalText =
          submitButton.innerHTML;

        submitButton.innerHTML =
          "Enviando...";

      }

    }
  );

}


/* =========================================================
   ANO AUTOMÁTICO
   ========================================================= */

function initCurrentYear() {

  const elements =
    document.querySelectorAll(
      "[data-current-year]"
    );


  if (!elements.length) {
    return;
  }


  const year =
    new Date().getFullYear();


  elements.forEach(
    element => {

      element.textContent =
        year;

    }
  );

}


/* =========================================================
   LINKS EXTERNOS
   ========================================================= */

function initExternalLinks() {

  const links =
    document.querySelectorAll(
      'a[href^="http"]'
    );


  links.forEach(link => {

    const url =
      link.getAttribute("href");


    if (!url) {
      return;
    }


    /*
     * Proteção contra tabnabbing.
     */

    if (
      link.target === "_blank"
    ) {

      const rel =
        link.getAttribute("rel") || "";


      const values =
        new Set(
          rel
            .split(/\s+/)
            .filter(Boolean)
        );


      values.add("noopener");

      values.add("noreferrer");


      link.setAttribute(
        "rel",
        [...values].join(" ")
      );

    }

  });

}


/* =========================================================
   CONTROLE DE ERROS
   ========================================================= */

window.addEventListener(
  "error",
  event => {

    /*
     * Pequenos erros opcionais não
     * devem interromper o site.
     */

    console.warn(
      "V8 Digital:",
      event.message
    );

  }
);


/* =========================================================
   API GLOBAL
   ========================================================= */

window.V8Digital = {

  initMobileMenu,

  initSmoothScroll,

  initHeaderScroll,

  initRevealAnimations

};
