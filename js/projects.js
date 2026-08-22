/* =========================================================
   V8 DIGITAL — PROJECTS.JS
   Portfólio oficial
   ========================================================= */

const projects = [
  {
    id: "assistencia-tecnica",

    title: "Assistência Técnica",

    shortTitle: "Assistência Técnica",

    category: "Landing Page",

    categoryLabel: "LEADS • WHATSAPP • CONVERSÃO",

    description:
      "Landing page comercial desenvolvida para apresentar serviços de assistência técnica, responder às principais dúvidas do público e direcionar visitantes para atendimento.",

    longDescription:
      "Projeto desenvolvido com foco em geração e qualificação de leads. A estrutura utiliza comunicação direta, apresentação de benefícios, chamadas para ação, formulário de contato e integração com WhatsApp para facilitar o atendimento.",

    url: "https://assistenciatecnica-eth.pages.dev/",

    type: "Landing Page",

    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Formulário",
      "WhatsApp",
      "Cloudflare"
    ],

    features: [
      "Landing page responsiva",
      "Estrutura orientada à conversão",
      "CTA para WhatsApp",
      "Formulário de captação",
      "Qualificação de leads",
      "Seção de serviços",
      "FAQ",
      "Design adaptado para dispositivos móveis"
    ],

    highlights: [
      "Geração de leads",
      "Atendimento via WhatsApp",
      "Estratégia de conversão"
    ],

    image: "assets/projects/assistencia-tecnica.jpg",

    featured: true,

    year: "2026",

    status: "Publicado"
  },

  {
    id: "my-moments-paris",

    title: "My Moments Paris",

    shortTitle: "My Moments Paris",

    category: "Landing Page",

    categoryLabel: "MARKETING • PRODUTO • CAPTAÇÃO",

    description:
      "Landing page comercial desenvolvida para apresentar produtos, comunicar uma oportunidade de negócio e conduzir visitantes para cadastro e contato.",

    longDescription:
      "Projeto desenvolvido combinando apresentação de produtos, comunicação comercial, chamadas para ação e captação de contatos. A página foi estruturada para criar uma jornada clara entre apresentação, interesse e ação.",

    url: "https://mymonentsparis.pages.dev/",

    type: "Landing Page",

    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Formulário",
      "WhatsApp",
      "Cloudflare"
    ],

    features: [
      "Landing page responsiva",
      "Apresentação de produtos",
      "Seções comerciais",
      "Chamadas para ação",
      "Formulário de captação",
      "Integração com plataforma externa",
      "WhatsApp",
      "Estrutura orientada à conversão"
    ],

    highlights: [
      "Marketing digital",
      "Captação de leads",
      "Apresentação de produtos"
    ],

    image: "assets/projects/my-moments-paris.jpg",

    featured: true,

    year: "2026",

    status: "Publicado"
  },

  {
    id: "v8-play",

    title: "V8 Play+",

    shortTitle: "V8 Play+",

    category: "Aplicação Web",

    categoryLabel: "CATÁLOGO • UX • APLICAÇÃO",

    description:
      "Aplicação web desenvolvida com experiência de catálogo, busca, categorias, autenticação e organização dinâmica de conteúdo.",

    longDescription:
      "Projeto desenvolvido para demonstrar uma experiência web mais próxima de uma aplicação do que de um site institucional. A interface foi estruturada para facilitar descoberta, pesquisa e navegação entre diferentes categorias de conteúdo.",

    url: "https://v8play.pages.dev/",

    type: "Aplicação Web",

    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "APIs",
      "Cloudflare"
    ],

    features: [
      "Catálogo de conteúdo",
      "Busca",
      "Categorias",
      "Interface responsiva",
      "Sistema de autenticação",
      "Organização dinâmica",
      "Experiência de navegação",
      "Interface adaptada para entretenimento"
    ],

    highlights: [
      "Aplicação Web",
      "Experiência do usuário",
      "Catálogo dinâmico"
    ],

    image: "assets/projects/v8-play.jpg",

    featured: true,

    year: "2026",

    status: "Publicado"
  }
];


/* =========================================================
   CONFIGURAÇÃO DO PORTFÓLIO
   ========================================================= */

const projectsConfig = {

  sectionTitle: "Projetos que colocam a estratégia em prática.",

  sectionDescription:
    "Conheça alguns dos projetos desenvolvidos pela V8 Digital.",

  showFeaturedOnly: false,

  openExternalLinks: true,

  currentYear: new Date().getFullYear()
};


/* =========================================================
   FUNÇÕES
   ========================================================= */

/**
 * Retorna todos os projetos.
 */
function getProjects() {
  return projects;
}


/**
 * Retorna somente os projetos em destaque.
 */
function getFeaturedProjects() {
  return projects.filter(project => project.featured === true);
}


/**
 * Busca um projeto pelo ID.
 */
function getProjectById(id) {
  return projects.find(project => project.id === id);
}


/**
 * Busca projetos por categoria.
 */
function getProjectsByCategory(category) {
  return projects.filter(
    project =>
      project.category.toLowerCase() === category.toLowerCase()
  );
}


/**
 * Retorna as categorias disponíveis.
 */
function getProjectCategories() {
  return [
    ...new Set(
      projects.map(project => project.category)
    )
  ];
}


/* =========================================================
   RENDERIZAÇÃO DOS PROJETOS
   ========================================================= */

function renderProjects(containerSelector = ".projects-grid") {

  const container =
    document.querySelector(containerSelector);

  if (!container) {
    return;
  }

  const list =
    projectsConfig.showFeaturedOnly
      ? getFeaturedProjects()
      : getProjects();

  if (!list.length) {

    container.innerHTML = `
      <div class="projects-empty">
        <p>Nenhum projeto disponível no momento.</p>
      </div>
    `;

    return;
  }


  container.innerHTML = list
    .map(project => createProjectCard(project))
    .join("");
}


/* =========================================================
   CARD DO PROJETO
   ========================================================= */

function createProjectCard(project) {

  const technologies =
    project.technologies
      .slice(0, 4)
      .map(
        technology =>
          `<span>${escapeHTML(technology)}</span>`
      )
      .join("");


  return `
    <article
      class="project-card"
      data-project-id="${escapeHTML(project.id)}"
    >

      <div
        class="project-image"
        style="background-image: url('${escapeAttribute(project.image)}')"
      >

        <div class="project-image-overlay"></div>

        <span class="project-type">
          ${escapeHTML(project.type)}
        </span>

      </div>


      <div class="project-content">

        <span class="project-category">
          ${escapeHTML(project.categoryLabel)}
        </span>

        <h3>
          ${escapeHTML(project.title)}
        </h3>

        <p>
          ${escapeHTML(project.description)}
        </p>


        <div class="project-tags">

          ${technologies}

        </div>


        <div class="project-actions">

          <a
            href="${escapeAttribute(project.url)}"
            class="project-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver projeto
            <span aria-hidden="true">→</span>
          </a>

        </div>

      </div>

    </article>
  `;
}


/* =========================================================
   MODAL / DETALHES DO PROJETO
   ========================================================= */

function openProjectModal(projectId) {

  const project =
    getProjectById(projectId);

  if (!project) {
    return;
  }


  let modal =
    document.querySelector(".project-modal");


  if (!modal) {

    modal =
      document.createElement("div");

    modal.className =
      "project-modal";

    modal.innerHTML = `
      <div
        class="project-modal-backdrop"
        data-close-modal
      ></div>

      <div
        class="project-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="projectModalTitle"
      >

        <button
          class="project-modal-close"
          type="button"
          aria-label="Fechar"
          data-close-modal
        >
          ×
        </button>

        <div class="project-modal-body"></div>

      </div>
    `;

    document.body.appendChild(modal);


    modal
      .querySelectorAll("[data-close-modal]")
      .forEach(button => {

        button.addEventListener(
          "click",
          closeProjectModal
        );

      });


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
  }


  const body =
    modal.querySelector(
      ".project-modal-body"
    );


  body.innerHTML = `

    <span class="eyebrow">
      ${escapeHTML(project.category)}
    </span>

    <h2 id="projectModalTitle">
      ${escapeHTML(project.title)}
    </h2>

    <p class="project-modal-description">
      ${escapeHTML(project.longDescription)}
    </p>


    <div class="project-modal-section">

      <h3>Destaques</h3>

      <div class="project-modal-highlights">

        ${project.highlights
          .map(
            item =>
              `<span>${escapeHTML(item)}</span>`
          )
          .join("")
        }

      </div>

    </div>


    <div class="project-modal-section">

      <h3>Principais recursos</h3>

      <ul>

        ${project.features
          .map(
            feature =>
              `<li>${escapeHTML(feature)}</li>`
          )
          .join("")
        }

      </ul>

    </div>


    <div class="project-modal-section">

      <h3>Tecnologias</h3>

      <div class="project-modal-tech">

        ${project.technologies
          .map(
            technology =>
              `<span>${escapeHTML(technology)}</span>`
          )
          .join("")
        }

      </div>

    </div>


    <div class="project-modal-actions">

      <a
        href="${escapeAttribute(project.url)}"
        class="btn btn-primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visitar projeto
      </a>

      <a
        href="https://wa.me/54992756194?text=${encodeURIComponent(
          `Olá V8 Digital! Vi o projeto "${project.title}" no portfólio e gostaria de conversar sobre um projeto semelhante.`
        )}"
        class="btn btn-secondary"
        target="_blank"
        rel="noopener noreferrer"
      >
        Quero um projeto assim
      </a>

    </div>

  `;


  modal.classList.add("active");

  document.body.classList.add(
    "modal-open"
  );
}


/* =========================================================
   FECHAR MODAL
   ========================================================= */

function closeProjectModal() {

  const modal =
    document.querySelector(".project-modal");

  if (!modal) {
    return;
  }

  modal.classList.remove("active");

  document.body.classList.remove(
    "modal-open"
  );
}


/* =========================================================
   FILTROS
   ========================================================= */

function filterProjects(category) {

  const container =
    document.querySelector(".projects-grid");

  if (!container) {
    return;
  }


  let filteredProjects;


  if (
    !category ||
    category === "Todos"
  ) {

    filteredProjects =
      getProjects();

  } else {

    filteredProjects =
      getProjectsByCategory(category);

  }


  container.innerHTML =
    filteredProjects
      .map(project =>
        createProjectCard(project)
      )
      .join("");
}


/* =========================================================
   UTILITÁRIOS DE SEGURANÇA
   ========================================================= */

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

  return escapeHTML(value)
    .replace(/`/g, "&#096;");
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
     * Só renderiza automaticamente se
     * existir uma grade de projetos.
     */

    const projectGrid =
      document.querySelector(
        ".projects-grid"
      );


    if (projectGrid) {

      /*
       * Como o novo index.html já possui
       * os cards diretamente no HTML,
       * não sobrescrevemos automaticamente.
       *
       * Caso você queira deixar o JS
       * responsável pelos cards no futuro,
       * basta chamar:
       *
       * renderProjects();
       */

    }


    /*
     * Botões que possuírem
     * data-project-id abrirão
     * os detalhes do projeto.
     */

    document.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "[data-project-id]"
          );

        if (!button) {
          return;
        }


        const projectId =
          button.dataset.projectId;


        if (projectId) {

          event.preventDefault();

          openProjectModal(
            projectId
          );

        }

      }
    );

  }
);


/* =========================================================
   EXPORTAÇÃO GLOBAL
   ========================================================= */

window.V8Projects = {

  projects,

  config: projectsConfig,

  getProjects,

  getFeaturedProjects,

  getProjectById,

  getProjectsByCategory,

  getProjectCategories,

  renderProjects,

  createProjectCard,

  openProjectModal,

  closeProjectModal,

  filterProjects

};
