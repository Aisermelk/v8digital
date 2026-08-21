document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    renderProjects();
    renderServices();
    renderProcess();
    handleForm();
    setupLinks();
});

// Header scroll effect & Mobile Menu
function initHeader() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Renderizar Projetos Dinamicamente
function renderProjects() {
    const container = document.getElementById('projects-render');
    if (!container) return;

    container.innerHTML = projetos.map(proj => `
        <article class="project-card">
            <div class="project-img">
                <img src="${proj.imagem}" alt="${proj.nome}" loading="lazy">
            </div>
            <div class="project-info">
                <span class="category">${proj.categoria}</span>
                <h3>${proj.nome}</h3>
                <p>${proj.descricao}</p>
                <div class="tech-tags">
                    ${proj.tecnologias.map(t => `<span>${t}</span>`).join('')}
                </div>
                <a href="${proj.link}" class="btn-text">Ver projeto <i data-lucide="arrow-right"></i></a>
            </div>
        </article>
    `).join('');
    lucide.createIcons();
}

// Renderizar Serviços
function renderServices() {
    const services = [
        { icon: 'monitor', title: 'Sites Profissionais', desc: 'Sites modernos e responsivos que vendem.' },
        { icon: 'rocket', title: 'Landing Pages', desc: 'Páginas de alta conversão para seus anúncios.' },
        { icon: 'settings', title: 'Sistemas Web', desc: 'Soluções personalizadas para sua empresa.' },
        { icon: 'cpu', title: 'Automação', desc: 'Ganhe tempo automatizando processos manuais.' },
        { icon: 'bar-chart', title: 'SEO e Tráfego', desc: 'Apareça para as pessoas certas na hora certa.' },
        { icon: 'database', title: 'Integração de APIs', desc: 'Conectamos suas ferramentas favoritas.' }
    ];

    const container = document.getElementById('services-container');
    if (container) {
        container.innerHTML = services.map(s => `
            <div class="service-card">
                <i data-lucide="${s.icon}"></i>
                <h3>${s.title}</h3>
                <p>${s.desc}</p>
            </div>
        `).join('');
        lucide.createIcons();
    }
}

// Renderizar Processo de Trabalho
function renderProcess() {
    const steps = [
        { num: '01', title: 'Briefing', desc: 'Entendo seu negócio, objetivos e o que sua marca precisa comunicar.' },
        { num: '02', title: 'Planejamento', desc: 'Defino estrutura, conteúdo e a estratégia técnica do projeto.' },
        { num: '03', title: 'Design', desc: 'Crio a identidade visual e o layout, pensados para conversão.' },
        { num: '04', title: 'Desenvolvimento', desc: 'Codifico tudo com performance, responsividade e boas práticas.' },
        { num: '05', title: 'Revisão', desc: 'Ajustamos juntos os detalhes até o resultado ficar redondo.' },
        { num: '06', title: 'Entrega', desc: 'Publico, configuro e acompanho os primeiros passos no ar.' }
    ];

    const container = document.querySelector('.process-steps');
    if (container) {
        container.innerHTML = steps.map(s => `
            <div class="process-step">
                <span class="step-number">${s.num}</span>
                <h3>${s.title}</h3>
                <p>${s.desc}</p>
            </div>
        `).join('');
    }
}

// Configurar links de WhatsApp e Contatos
function setupLinks() {
    const waLinks = document.querySelectorAll('.whatsapp-link');
    const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.textos.ctaWhatsapp)}`;
    
    waLinks.forEach(link => link.href = waUrl);
    
    document.getElementById('contact-email').textContent = CONFIG.email;
    document.getElementById('contact-whatsapp').textContent = `WhatsApp: ${CONFIG.whatsapp}`;
}

// Formulário de Contato
function handleForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.textContent = "Enviando...";
            
            // Simulação de envio
            setTimeout(() => {
                alert('Mensagem enviada com sucesso! A V8 Digital entrará em contato.');
                form.reset();
                btn.textContent = "Enviar solicitação";
            }, 1500);
        });
    }
}