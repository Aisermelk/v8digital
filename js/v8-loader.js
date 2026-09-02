/**
 * V8 ADMIN — Universal | Loader de integração (completo)
 *
 * Coloque este arquivo em qualquer site (ex: js/v8-loader.js) e inclua assim,
 * perto do fim do <body>, trocando SEU_PROJECT_ID pelo ID gerado no painel:
 *
 *   <script src="js/v8-loader.js" data-project-id="SEU_PROJECT_ID"></script>
 *
 * O que ele faz sozinho, sem mais nada:
 *   1. Busca a config pública do projeto no Worker
 *   2. Injeta Meta Pixel / Google Analytics / Google Tag, se preenchidos
 *   3. Preenche qualquer elemento com atributo data-v8="..." (contato, redes,
 *      e também os campos de Conteúdo — ver convenção abaixo)
 *   4. Aplica SEO (title, meta description, canonical, robots, og:image)
 *   5. Injeta os Scripts customizados (head / body / footer) do painel
 *   6. Preenche a galeria de imagens (Mídia) e o embed do Google Maps
 *      (Localização), se ativados no painel
 *   7. Se existir um formulário com data-v8-form, aponta ele pro Formspree
 *      certo E também salva uma cópia do lead no painel (aba Leads do projeto)
 *
 * ================================================================
 * CONVENÇÃO data-v8 — preenche texto/link automaticamente
 * ================================================================
 *
 *   <a data-v8="contact.whatsapp">Falar no WhatsApp</a>
 *   <a data-v8="contact.email">E-mail</a>
 *   <a data-v8="contact.phone">Telefone</a>
 *   <a data-v8="social.instagram">Instagram</a>
 *   <a data-v8="social.facebook">Facebook</a>
 *   <a data-v8="social.tiktok">TikTok</a>
 *   <a data-v8="social.youtube">YouTube</a>
 *   <a data-v8="social.linkedin">LinkedIn</a>
 *
 *   <span data-v8="content.name"></span>
 *   <span data-v8="content.job"></span>
 *   <h1 data-v8="content.headline"></h1>
 *   <p data-v8="content.description"></p>
 *   <p data-v8="content.specialization"></p>
 *   <p data-v8="content.experience"></p>
 *   <p data-v8="content.address"></p>
 *   <span data-v8="content.registration"></span>
 *
 * Qualquer um desses campos que estiver vazio no painel some da tela sozinho
 * (display:none) — não precisa checar nada manualmente no HTML.
 *
 * ================================================================
 * GALERIA (Mídia)
 * ================================================================
 *
 *   <div data-v8-gallery></div>
 *
 * Só aparece se "Ativar galeria" estiver marcado no painel. Cada imagem
 * vira um <img class="v8-gallery-item"> dentro da div — estilize com CSS
 * do próprio site.
 *
 * ================================================================
 * VÍDEO (Mídia)
 * ================================================================
 *
 *   <iframe data-v8-video hidden></iframe>
 *
 * Só aparece (remove o "hidden") se "Ativar vídeo" estiver marcado.
 *
 * ================================================================
 * GOOGLE MAPS (Localização)
 * ================================================================
 *
 *   <div data-v8-maps-embed></div>
 *
 * Só aparece se "Ativar Google Maps" estiver marcado no painel — recebe o
 * código de incorporação (embed) definido lá.
 *
 * ================================================================
 * FORMULÁRIO
 * ================================================================
 *
 *   <form data-v8-form>
 *     <input name="name">
 *     <input name="email">
 *     <textarea name="message"></textarea>
 *     <button type="submit">Enviar</button>
 *   </form>
 */

(function () {
  const scriptTag = document.currentScript;
  const PROJECT_ID = scriptTag && scriptTag.dataset.projectId;
  const API_URL =
    (scriptTag && scriptTag.dataset.apiUrl) ||
    "https://v8adminuniversal.aisermelk.workers.dev";

  if (!PROJECT_ID) {
    console.warn("V8 Loader: defina data-project-id no <script> do v8-loader.js");
    return;
  }

  function getByPath(obj, path) {
    return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  }

  function injectScriptSrc(src) {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    document.head.appendChild(s);
  }

  // --------------------------------------------------------------
  // RASTREAMENTO
  // --------------------------------------------------------------

  function injectTracking(tracking) {
    if (!tracking) return;

    if (tracking.pixel) {
      /* eslint-disable */
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", tracking.pixel);
      window.fbq("track", "PageView");
      /* eslint-enable */
    }

    if (tracking.analytics) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      injectScriptSrc(`https://www.googletagmanager.com/gtag/js?id=${tracking.analytics}`);
      window.gtag("js", new Date());
      window.gtag("config", tracking.analytics);
    }

    if (tracking.tag) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        const f = d.getElementsByTagName(s)[0], j = d.createElement(s);
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", tracking.tag);
    }
  }

  // --------------------------------------------------------------
  // CAMPOS data-v8 (contato, redes, conteúdo)
  // --------------------------------------------------------------

  function fillFields(config) {
    document.querySelectorAll("[data-v8]").forEach((el) => {
      const path = el.dataset.v8;
      const value = getByPath(config, path);

      if (!value) {
        el.style.display = "none";
        return;
      }

      if (el.tagName === "A") {
        if (path === "contact.whatsapp") {
          const digits = String(value).replace(/\D/g, "");
          el.href = `https://wa.me/${digits}`;
        } else if (path === "contact.email") {
          el.href = `mailto:${value}`;
        } else if (path === "contact.phone") {
          el.href = `tel:${String(value).replace(/\D/g, "")}`;
        } else {
          el.href = value;
        }
      } else if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.value = value;
      } else {
        el.textContent = value;
      }
    });
  }

  // --------------------------------------------------------------
  // SEO
  // --------------------------------------------------------------

  function setMeta(attr, attrValue, content) {
    let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function applySeo(seo) {
    if (!seo) return;

    if (seo.title) document.title = seo.title;

    if (seo.description) setMeta("name", "description", seo.description);

    if (seo.keywords) setMeta("name", "keywords", seo.keywords);

    if (seo.robots) setMeta("name", "robots", seo.robots);

    if (seo.ogImage) {
      setMeta("property", "og:image", seo.ogImage);
    }

    if (seo.title) setMeta("property", "og:title", seo.title);
    if (seo.description) setMeta("property", "og:description", seo.description);

    if (seo.canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", seo.canonical);
    }
  }

  // --------------------------------------------------------------
  // SCRIPTS CUSTOMIZADOS
  // --------------------------------------------------------------

  function injectCustomScripts(scripts) {
    if (!scripts) return;

    if (scripts.head) {
      const div = document.createElement("div");
      div.innerHTML = scripts.head;
      Array.from(div.childNodes).forEach((node) => document.head.appendChild(node));
    }

    if (scripts.body) {
      const div = document.createElement("div");
      div.innerHTML = scripts.body;
      Array.from(div.childNodes).forEach((node) => {
        // insere no ponto onde o v8-loader.js está, mantendo a ordem natural da página
        scriptTag.parentNode.insertBefore(node, scriptTag);
      });
    }

    if (scripts.footer) {
      const div = document.createElement("div");
      div.innerHTML = scripts.footer;
      Array.from(div.childNodes).forEach((node) => document.body.appendChild(node));
    }
  }

  // --------------------------------------------------------------
  // MÍDIA (galeria + vídeo)
  // --------------------------------------------------------------

  function applyMedia(media) {
    if (!media) return;

    const galleryEl = document.querySelector("[data-v8-gallery]");
    if (galleryEl) {
      if (media.galleryEnabled && Array.isArray(media.galleryImages) && media.galleryImages.length) {
        galleryEl.innerHTML = media.galleryImages
          .map((src) => `<img class="v8-gallery-item" src="${src}" loading="lazy" alt="">`)
          .join("");
      } else {
        galleryEl.style.display = "none";
      }
    }

    const videoEl = document.querySelector("[data-v8-video]");
    if (videoEl) {
      if (media.videoEnabled && media.video) {
        videoEl.src = media.video;
        videoEl.hidden = false;
      } else {
        videoEl.hidden = true;
      }
    }
  }

  // --------------------------------------------------------------
  // LOCALIZAÇÃO (Google Maps)
  // --------------------------------------------------------------

  function applyLocation(location) {
    if (!location) return;

    const mapsEl = document.querySelector("[data-v8-maps-embed]");
    if (mapsEl) {
      if (location.enabled && location.embed) {
        mapsEl.innerHTML = location.embed;
      } else {
        mapsEl.style.display = "none";
      }
    }
  }

  // --------------------------------------------------------------
  // FORMULÁRIO + LEADS
  // --------------------------------------------------------------

  function wireForm(projectId, formspreeUrl) {
    const form = document.querySelector("[data-v8-form]");
    if (!form) return;

    if (formspreeUrl) form.action = formspreeUrl;

    form.addEventListener("submit", async () => {
      const data = Object.fromEntries(new FormData(form).entries());

      // salva cópia do lead no painel (não bloqueia o envio ao Formspree)
      fetch(`${API_URL}/api/public/leads/${encodeURIComponent(projectId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name || data.nome || "",
          email: data.email || "",
          message: data.message || data.mensagem || "",
        }),
      }).catch(() => {});

      // o envio pro Formspree em si segue o comportamento normal do <form>
      // (não fazemos preventDefault — deixa o Formspree cuidar do resto)
    });
  }

  // --------------------------------------------------------------
  // CARREGAR TUDO
  // --------------------------------------------------------------

  fetch(`${API_URL}/api/public/config/${encodeURIComponent(PROJECT_ID)}`)
    .then((r) => r.json())
    .then((res) => {
      if (res.error) {
        console.warn("V8 Loader: projeto não encontrado ou config indisponível.");
        return;
      }
      // O Worker responde como { ok: true, project: {...} } — desembrulha aqui
      // pra manter o resto do loader simples.
      const config = res.project || res;

      injectTracking(config.tracking);
      fillFields(config);
      applySeo(config.seo);
      injectCustomScripts(config.scripts);
      applyMedia(config.media);
      applyLocation(config.location);
      wireForm(PROJECT_ID, config.formspree);
    })
    .catch(() => {
      console.warn("V8 Loader: não foi possível carregar a config do projeto.");
    });
})();
