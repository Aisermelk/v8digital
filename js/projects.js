/* =========================================================
   V8 DIGITAL — PROJECTS.JS
   Portfólio de projetos
   ========================================================= */

"use strict";


/* =========================================================
   PROJETOS
   ========================================================= */

const V8_PROJECTS = {

  "assistencia-tecnica": {

    id: "assistencia-tecnica",

    title: "Assistência Técnica",

    category: "Landing Page • Suporte Técnico",

    description:
      "Landing page desenvolvida para um serviço de suporte técnico especializado, com foco em apresentar o problema do cliente de forma clara, transmitir confiança e direcionar o visitante para o atendimento.",

    image:
      "assets/projects/assistencia-tecnica.jpg",

    url:
      "https://assistenciatecnica-eth.pages.dev/",

    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Cloudflare Pages",
      "Formulário",
      "WhatsApp"
    ],

    highlights: [
      "Landing page comercial",
      "Design responsivo",
      "Foco em conversão",
      "CTA para WhatsApp",
      "Formulário de atendimento",
      "Experiência mobile"
    ],

    challenge:
      "Criar uma página simples e objetiva para transformar visitantes que estão enfrentando problemas com o aparelho em potenciais clientes.",

    solution:
      "A estrutura foi organizada em torno da principal dor do visitante, utilizando chamadas diretas, elementos de confiança, apresentação do atendimento e CTAs distribuídos estrategicamente pela página."

  },


  "my-moments-paris": {

    id: "my-moments-paris",

    title: "My Moments Paris",

    category: "Landing Page • Marketing Digital",

    description:
      "Projeto de landing page desenvolvido para apresentar uma oportunidade comercial de forma visual, profissional e orientada à geração de leads.",

    image:
      "assets/projects/my-moments-paris.jpg",

    url:
      "https://mymonentsparis.pages.dev/",

    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Cloudflare Pages",
      "Formulário",
      "WhatsApp"
    ],

    highlights: [
      "Landing page de vendas",
      "Estratégia de conversão",
      "Design responsivo",
      "Captação de leads",
      "CTA para WhatsApp",
      "Estrutura comercial"
    ],

    challenge:
      "Apresentar uma oportunidade comercial de maneira profissional, mantendo a navegação simples e conduzindo o visitante até o contato.",

    solution:
      "Foi criada uma estrutura visual com hierarquia de informações, benefícios, chamadas para ação e formulário, permitindo que a página funcione como uma ferramenta de captação."

  },


  "v8-play": {

    id: "v8-play",

    title: "V8 Play",

    category: "Web App • Entretenimento",

    description:
      "Projeto desenvolvido para apresentar uma experiência digital voltada ao entretenimento, com interface moderna, navegação simples e identidade visual própria.",

    image:
      "assets/projects/v8-play.jpg",

    url:
      "https://v8play.pages.dev/",

    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Cloudflare Pages",
      "Interface Web",
      "Design Responsivo"
    ],

    highlights: [
      "Interface moderna",
      "Experiência responsiva",
      "Navegação simplificada",
      "Identidade visual",
      "Estrutura web",
      "Deploy na Cloudflare"
    ],

    challenge:
      "Criar uma interface visualmente atrativa e fácil de utilizar, mantendo uma experiência consistente em diferentes tamanhos de tela.",

    solution:
      "O projeto foi estruturado com foco na experiência do usuário, utilizando componentes visuais, organização de conteúdo e navegação objetiva."

  }

};


/* =========================================================
   FUNÇÕES AUXILIARES
   ========================================================= */

function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent =
    value ?? "";

  return div.innerHTML;

}


/* =========================================================
   CRIAÇÃO DO MODAL
   ========================================================= */

function createProjectModal() {

  let modal =
    document.querySelector(
      "#project-modal"
    );


  if (modal) {
    return modal;
  }


  modal =
    document.createElement("div");

  modal.id =
    "project-modal";

  modal.className =
    "project-modal";

  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  modal.innerHTML = `

    <div
      class="project-modal-backdrop"
      data-modal-close
    ></div>

    <div
      class="project-modal-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >

      <button
        class="project-modal-close"
        type="button"
        aria-label="Fechar projeto"
        data-modal-close
      >
        ×
      </button>

      <div
        class="project-modal-body"
        id="project-modal-body"
      ></div>

    </div>

  `;


  document.body.appendChild(
    modal
  );


  /*
   * Fechar modal
   */

  modal
    .querySelectorAll(
      "[data-modal-close]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        closeProjectModal
      );

    });


  /*
   * ESC
   */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        modal.classList.contains("active")
      ) {

        closeProjectModal();

      }

    }
  );


  return modal;

}


/* =========================================================
   ABRIR PROJETO
   ========================================================= */

function openProjectModal(
  projectId
) {

  const project =
    V8_PROJECTS[projectId];


  if (!project) {

    console.warn(
      `Projeto "${projectId}" não encontrado.`
    );

    return;

  }


  const modal =
    createProjectModal();


  const body =
    modal.querySelector(
      "#project-modal-body"
    );


  const technologies =
    project.technologies
      .map(
        tech =>
          `<span>${escapeHTML(tech)}</span>`
      )
      .join("");


  const highlights =
    project.highlights
      .map(
        item =>
          `<span>${escapeHTML(item)}</span>`
      )
      .join("");


  body.innerHTML = `

    <div class="project-modal-header">

      <div class="project-category">
        ${escapeHTML(project.category)}
      </div>

      <h2 id="project-modal-title">
        ${escapeHTML(project.title)}
      </h2>

      <p class="project-modal-description">
        ${escapeHTML(project.description)}
      </p>

    </div>


    <div class="project-modal-section">

      <h3>
        Sobre o projeto
      </h3>

      <p class="project-modal-description">
        ${escapeHTML(project.challenge)}
      </p>

    </div>


    <div class="project-modal-section">

      <h3>
        Solução
      </h3>

      <p class="project-modal-description">
        ${escapeHTML(project.solution)}
      </p>

    </div>


    <div class="project-modal-section">

      <h3>
        Destaques
      </h3>

      <div class="project-modal-highlights">
        ${highlights}
      </div>

    </div>


    <div class="project-modal-section">

      <h3>
        Tecnologias
      </h3>

      <div class="project-modal-tech">
        ${technologies}
      </div>

    </div>


    <div class="project-modal-actions">

      <a
        href="${escapeHTML(project.url)}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary"
      >
        Visitar projeto
      </a>

      <a
        href="${createWhatsAppLink(
          `Olá! Vi o projeto ${project.title} no portfólio da V8 Digital e gostaria de solicitar um orçamento.`
        )}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-secondary"
      >
        Quero um projeto assim
      </a>

    </div>

  `;


  modal.classList.add(
    "active"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );


  /*
   * Coloca o foco no botão fechar
   */

  const closeButton =
    modal.querySelector(
      ".project-modal-close"
    );


  if (closeButton) {

    setTimeout(
      () => closeButton.focus(),
      50
    );

  }

}


/* =========================================================
   FECHAR PROJETO
   ========================================================= */

function closeProjectModal() {

  const modal =
    document.querySelector(
      "#project-modal"
    );


  if (!modal) {
    return;
  }


  modal.classList.remove(
    "active"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


/* =========================================================
   WHATSAPP
   ========================================================= */

function createWhatsAppLink(
  message
) {

  const number =
    "54992756194";


  return (
    "https://wa.me/" +
    number +
    "?text=" +
    encodeURIComponent(message)
  );

}


/* =========================================================
   CONFIGURAÇÃO DOS CARDS
   ========================================================= */

function initProjectCards() {

  const cards =
    document.querySelectorAll(
      "[data-project-id]"
    );


  if (!cards.length) {
    return;
  }


  cards.forEach(card => {

    const projectId =
      card.dataset.projectId;


    const project =
      V8_PROJECTS[projectId];


    if (!project) {
      return;
    }


    /*
     * Abre o modal
     */

    card.addEventListener(
      "click",
      event => {

        /*
         * Se o usuário clicou
         * diretamente em um link,
         * não interceptamos.
         */

        if (
          event.target.closest("a")
        ) {
          return;
        }


        openProjectModal(
          projectId
        );

      }
    );


    /*
     * Acessibilidade
     */

    card.setAttribute(
      "role",
      "button"
    );

    card.setAttribute(
      "tabindex",
      "0"
    );


    card.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openProjectModal(
            projectId
          );

        }

      }
    );

  });

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    createProjectModal();

    initProjectCards();

  }
);


/* =========================================================
   API GLOBAL
   ========================================================= */

window.V8Projects = {

  projects:
    V8_PROJECTS,

  openProjectModal,

  closeProjectModal,

  createProjectModal

};
