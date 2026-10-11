(() => {
  const site = window.SITE;
  const projects = window.PROJECTS;
  const ongoing = window.ONGOING || [];
  const view = document.getElementById("view");
  const backLink = document.getElementById("back");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- helpers ----

  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // asset paths in projects.js are relative to the site root
  const asset = (path) => (!path || /^(https?:|data:)/.test(path) ? path || "" : `../${path}`);

  const paragraphs = (text) => [].concat(text || []).filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("");

  const firstSentence = (text) => {
    const t = [].concat(text || [])[0] || "";
    const m = t.match(/^.*?[.!?](\s|$)/);
    return (m ? m[0] : t).trim();
  };

  const image = (src, alt = "", { lazy = true } = {}) =>
    src ? `<img src="${esc(asset(src))}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""} referrerpolicy="no-referrer">` : "";

  const external = (url) => (/^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "");

  const LINK_NAMES = { linkedin: "LinkedIn", github: "GitHub", behance: "Behance", instagram: "Instagram" };
  const linkName = (key) => LINK_NAMES[key] || key[0].toUpperCase() + key.slice(1);

  const socialLinks = () => Object.entries(site.links).filter(([, url]) => url);

  // label / value rows set as a small monospace block
  const facts = (rows) => {
    rows = rows.filter(([, v]) => v);
    if (!rows.length) return "";
    const width = Math.max(...rows.map(([k]) => k.length)) + 3;
    return `<pre>${rows.map(([k, v]) => esc(k.toLowerCase().padEnd(width)) + esc(v)).join("\n")}</pre>`;
  };

  const lastUpdated = (() => {
    const d = new Date(document.lastModified);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return isNaN(d) ? "" : `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  })();

  // ---- pages ----

  function homePage() {
    const now = ongoing.map((o) => `
      <p class="reading"><span class="live" aria-hidden="true"></span>Now: <a href="#/now/${o.slug}">${esc(o.title)}</a>,
        ${esc(o.subtitle.toLowerCase())} (${esc((o.status || "in progress").toLowerCase())}).</p>`).join("");

    const cards = projects.map((p) => `
      <li>
        <a class="card" href="#/work/${p.slug}">
          <span class="pic">${image(p.cover)}</span>
          <span>
            <span class="title">${esc(p.title)}</span>
            <span class="sub">${esc(p.subtitle)}</span>
            <span class="desc">${esc(firstSentence(p.summary))}</span>
            <span class="meta">${esc([p.category, p.year].filter(Boolean).join(", "))}</span>
          </span>
        </a>
      </li>`).join("");

    return `
      <div class="masthead">
        <span class="turn" role="img" aria-label="Line drawing of ${esc(site.name)} turning around"></span>
        <div>
          <h1>${esc(site.name)}</h1>
          <p class="byline">${esc(site.role)}, ${esc(site.school)}</p>
          <p class="byline"><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
          <p class="byline">${esc(lastUpdated)}</p>
        </div>
      </div>
      <hr>
      ${now}
      <h2>Work</h2>
      <ul class="cards">${cards}</ul>`;
  }

  function projectPage(slug) {
    const i = projects.findIndex((p) => p.slug === slug);
    if (i < 0) return notFoundPage();
    const p = projects[i];
    const next = projects[(i + 1) % projects.length];
    const links = Object.entries(p.links || {}).filter(([, url]) => url);
    const credit = [p.team, p.year].filter(Boolean).join(", ");

    return `
      <h1>${esc(p.title)}</h1>
      <p class="byline">${esc(p.subtitle)}</p>
      ${credit ? `<p class="byline">${esc(credit)}</p>` : ""}
      <hr>
      <div class="cover">${image(p.cover, p.title, { lazy: false })}</div>
      ${facts([["Guided by", p.guide], ["Duration", p.duration], ["Tools", (p.tools || []).join(", ")], ["Type", p.category]])}
      <h2>Summary</h2>
      <div class="reading">
        ${paragraphs(p.summary)}
        ${links.length ? `<p>${links.map(([k, url]) => `<a href="${esc(url)}"${external(url)}>${esc(linkName(k))}</a>`).join(" · ")}</p>` : ""}
      </div>
      ${p.quote ? `<figure class="quote"><blockquote>“${esc(p.quote.text)}”</blockquote><figcaption>${esc(p.quote.by)}</figcaption></figure>` : ""}
      ${p.slides.length ? `<h2>Case study</h2><div class="study">${p.slides.map((s, k) =>
        `<img src="${esc(asset(s.src))}" width="${s.w}" height="${s.h}" alt="${esc(p.title)} case study, part ${k + 1}" loading="lazy">`).join("")}</div>` : ""}
      ${p.story ? storyBlocks(p) : ""}
      <hr>
      <p class="pager"><a href="#/">All work</a><a href="#/work/${next.slug}">Next: ${esc(next.title)}</a></p>`;
  }

  function storyBlocks(p) {
    const pic = (k) => p.gallery[k];
    return p.story.map((block) => {
      if (block.images) {
        const figs = block.images.map(pic).filter(Boolean)
          .map((g) => `<figure style="flex:${(g.w / g.h).toFixed(3)}">${image(g.src, p.title)}</figure>`).join("");
        return `<div class="gallery">${figs}</div>${block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ""}`;
      }
      const g = block.image != null && pic(block.image);
      return `
        <div class="reading">
          ${block.label ? `<h3>${esc(block.label)}</h3>` : ""}
          ${paragraphs(block.text)}
          ${block.list ? facts(block.list) : ""}
          ${g ? `<figure class="fig">${image(g.src, block.caption || p.title)}${block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ""}</figure>` : ""}
        </div>`;
    }).join("");
  }

  const figmaEmbed = (url) =>
    `https://embed.figma.com/${url.replace(/^https:\/\/(www\.)?figma\.com\//, "")}${url.includes("?") ? "&" : "?"}embed-host=share`;

  function ongoingPage(slug) {
    const o = ongoing.find((x) => x.slug === slug);
    if (!o) return notFoundPage();
    return `
      <h1>${esc(o.title)}</h1>
      <p class="byline">${esc(o.subtitle)}</p>
      <p class="byline"><span class="live" aria-hidden="true"></span>${esc(o.status || "In progress")}</p>
      <hr>
      <div class="reading">${paragraphs(o.summary)}</div>
      ${o.board ? `
        <h2>Research board</h2>
        <div class="board">
          <iframe src="${esc(figmaEmbed(o.board))}" title="${esc(o.title)} research board" loading="lazy" allowfullscreen></iframe>
          <figcaption><a href="${esc(o.board)}" target="_blank" rel="noopener">Open the board in Figma</a></figcaption>
        </div>` : ""}`;
  }

  let shelf = { music: [], movies: [], photos: [] };

  const spotifyEmbed = (url) => {
    const m = String(url || "").match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|artist)\/([A-Za-z0-9]+)/);
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : "";
  };

  function aboutPage() {
    const section = (title, body) => `<h2>${title}</h2>${body}`;
    const certs = site.certifications || [];

    const photos = shelf.photos.map((ph) =>
      `<figure>${image(ph.src, ph.caption || `Photo by ${site.name}`)}${ph.caption ? `<figcaption>${esc(ph.caption)}</figcaption>` : ""}</figure>`).join("");

    const music = shelf.music.map((m) => {
      const embed = spotifyEmbed(m.link);
      return embed
        ? `<div class="spot"><iframe src="${esc(embed)}" title="${esc(m.title || "Spotify track")}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>`
        : `<p><a href="${esc(m.link)}" target="_blank" rel="noopener">${esc(m.title || m.link)}</a></p>`;
    }).join("");

    const movies = shelf.movies.map((v) =>
      `<a href="${esc(v.link || "#")}" target="_blank" rel="noopener">${image(v.poster, v.title)}${esc(v.title)}</a>`).join("");

    return `
      <h1>About</h1>
      <p class="byline">${esc(site.role)}, ${esc(site.school)}, ${esc(site.location)}</p>
      <hr>
      <div class="intro">
        ${site.portrait ? image(site.portrait, `Portrait of ${site.name}`, { lazy: false }) : ""}
        <div class="reading">${paragraphs(site.about)}</div>
      </div>
      ${section("Toolkit", `<p>${site.skills.map(esc).join(", ")}</p>`)}
      ${certs.length ? section("Certificates", `<ul>${certs.map((c) =>
        `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.title)}</a>, <i>${esc(c.issuer)}</i></li>`).join("")}</ul>`) : ""}
      ${photos ? section("Photos", `<div class="photos">${photos}</div>`) : ""}
      ${music ? section("On repeat", music) : ""}
      ${movies ? section("Watching", `<div class="movies">${movies}</div>`) : ""}`;
  }

  fetch(`../data/shelf.json?v=${Date.now()}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data) return;
      shelf = { music: data.music || [], movies: data.movies || [], photos: data.photos || [] };
      if (currentRoute().nav === "about") render({ scroll: false });
    })
    .catch(() => {});

  const privacyPage = () => `
    <h1>Privacy &amp; terms</h1>
    <hr>
    <div class="reading">
      <p>This site has no cookies, analytics, ads or sign-up forms, and it doesn't collect anything about you.</p>
      <p>It's hosted on GitHub Pages, which keeps standard server logs. The music players come from Spotify, the research board from Figma, and movie posters from Apple and Wikipedia; each of those follows its own privacy policy when it loads.</p>
      <p>If you email me, I'll only use your address to reply.</p>
      <p>All projects, images and text here are my own work unless credited. Please ask before reusing them, and credit me if you share them.</p>
    </div>`;

  const notFoundPage = () => `<h1>Page not found</h1><p><a href="#/">Back to the work</a></p>`;

  // ---- routing ----

  function currentRoute() {
    const [section, slug] = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (!section || (section === "work" && !slug)) return { nav: "work", home: true, html: homePage() };
    if (section === "work") return { nav: "work", html: projectPage(slug) };
    if (section === "now" && slug) return { nav: "work", html: ongoingPage(slug) };
    if (section === "about") return { nav: "about", html: aboutPage() };
    if (section === "privacy") return { nav: "", html: privacyPage() };
    return { nav: "", html: notFoundPage() };
  }

  // Back returns to the previous page on this site, or to the work list on a direct visit
  let navigatedInSite = false;
  backLink.addEventListener("click", (e) => {
    if (navigatedInSite) {
      e.preventDefault();
      history.back();
    }
  });

  function render({ scroll = true } = {}) {
    const route = currentRoute();
    view.innerHTML = route.html;
    backLink.hidden = !!route.home;

    document.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === route.nav) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    const heading = view.querySelector("h1");
    document.title = route.home || !heading ? `${site.name}, Industrial Design Portfolio` : `${heading.textContent} - ${site.name}`;

    if (scroll) {
      window.scrollTo(0, 0);
      view.focus({ preventScroll: true });
    }
  }

  addEventListener("hashchange", () => {
    navigatedInSite = true;
    render();
  });

  // ---- turnaround: frames sit side by side in one image, so frames = width / height ----

  const sprite = new Image();
  sprite.onload = () =>
    document.documentElement.style.setProperty("--frames", Math.round(sprite.naturalWidth / sprite.naturalHeight));
  sprite.src = "../assets/turnaround/turn.webp?v=4";

  // ---- footer ----

  document.getElementById("links").innerHTML = socialLinks()
    .map(([k, url]) => `<a href="${esc(url)}"${external(url)}>${esc(linkName(k))}</a>`).join(" | ");
  document.getElementById("copy").innerHTML =
    `<i>© ${new Date().getFullYear()} ${esc(site.name)}${lastUpdated ? `, last updated ${esc(lastUpdated)}` : ""}</i> | <a href="#/privacy">Privacy &amp; terms</a>`;

  // "Get in touch" scrambles into the email address on hover and focus
  const cta = document.getElementById("cta");
  const LABEL = "Get in touch";
  const GLYPHS = "!<>-_\\/[]{}=+*^?#@%&$";
  let shown = LABEL;
  let frame = 0;

  cta.href = `mailto:${site.email}`;

  function scrambleTo(text) {
    if (text === shown) return;
    shown = text;
    cancelAnimationFrame(frame);
    if (reducedMotion) {
      cta.textContent = text;
      return;
    }
    const from = cta.textContent;
    const chars = Array.from({ length: Math.max(from.length, text.length) }, (_, i) => {
      const start = Math.floor(Math.random() * 8);
      return { from: from[i] || "", to: text[i] || "", start, end: start + 6 + Math.floor(Math.random() * 10) + i };
    });
    let tick = 0;
    const step = () => {
      let done = 0;
      cta.textContent = chars.map((c) => {
        if (tick >= c.end) { done++; return c.to; }
        if (tick >= c.start) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        return c.from;
      }).join("");
      if (done < chars.length) {
        tick++;
        frame = requestAnimationFrame(step);
      }
    };
    step();
  }

  cta.addEventListener("pointerenter", () => scrambleTo(site.email));
  cta.addEventListener("pointerleave", () => scrambleTo(LABEL));
  cta.addEventListener("focus", () => scrambleTo(site.email));
  cta.addEventListener("blur", () => scrambleTo(LABEL));

  render({ scroll: false });
})();
