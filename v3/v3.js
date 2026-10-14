(() => {
  const site = window.SITE;
  const projects = window.PROJECTS;
  const ongoing = window.ONGOING || [];
  const view = document.getElementById("view");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // where to centre each cover when it is cropped to a tall frame on the home strip
  const FOCUS = { anchor: 50, rebrush: 62, lapcare: 50, latent: 32, "audio-deck": 45, "creta-cmf": 70 };

  // ---- helpers ----

  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const asset = (path) => (!path || /^(https?:|data:)/.test(path) ? path || "" : `../${path}`);
  const list = (v) => [].concat(v || []).filter(Boolean);
  const paragraphs = (text) => list(text).map((t) => `<p>${esc(t)}</p>`).join("");
  const external = (url) => (/^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "");
  const image = (src, alt = "", { lazy = true, w, h, style = "" } = {}) =>
    src ? `<img src="${esc(asset(src))}" alt="${esc(alt)}"${w && h ? ` width="${w}" height="${h}"` : ""}${style ? ` style="${style}"` : ""}${lazy ? ' loading="lazy"' : ' fetchpriority="high"'} referrerpolicy="no-referrer">` : "";
  const LINK_NAMES = { linkedin: "LinkedIn", github: "GitHub", behance: "Behance", instagram: "Instagram" };
  const linkName = (key) => LINK_NAMES[key] || key[0].toUpperCase() + key.slice(1);
  const lines = (...rows) => rows.filter(Boolean).map(esc).join("<br>");

  // ---- pages ----

  function homePage() {
    const tiles = projects.map((p) => `
      <a class="tile" href="#/work/${p.slug}" data-slug="${p.slug}">
        <span class="label">${esc(p.title)}</span>
        <span class="frame">${image(p.cover, p.title, { w: 1600, h: 900, style: `object-position:${FOCUS[p.slug] ?? 50}% 50%` })}</span>
      </a>`).join("");

    const now = ongoing.map((o) => `
      <a class="tile now" href="#/now/${o.slug}">
        <span class="label">Now</span>
        <span class="frame">
          <span class="label"><span class="dot" aria-hidden="true"></span>${esc(o.status || "In progress")}</span>
          <span class="big">${esc(o.title)}<br>${esc(o.subtitle)}</span>
        </span>
      </a>`).join("");

    return {
      home: true,
      html: `
        <div class="strip" id="strip">${tiles}${now}</div>
        <div class="strip-foot label"><span>${esc(site.role)}, ${esc(site.school)}</span><span>${String(projects.length).padStart(2, "0")} projects</span></div>`,
    };
  }

  function projectPage(slug) {
    const i = projects.findIndex((p) => p.slug === slug);
    if (i < 0) return notFoundPage();
    const p = projects[i];
    const next = projects[(i + 1) % projects.length];
    const links = Object.entries(p.links || {}).filter(([, url]) => url);
    const details = [
      p.guide && `Guided by ${p.guide}`,
      p.duration,
      list(p.tools).length && list(p.tools).join(", "),
    ].filter(Boolean).map(esc);
    const linkHtml = links.map(([k, url]) => `<a href="${esc(url)}"${external(url)}>${esc(linkName(k))}</a>`);

    return {
      title: p.title,
      html: `
        <section class="hero grid">
          <figure class="hero-img">${image(p.cover, p.title, { lazy: false, w: 1600, h: 900 })}</figure>
          <h1 class="title lines">${esc(p.title)}</h1>
          <div class="intro lines">${paragraphs(p.summary)}</div>
          <div class="meta label">
            <div>${lines(p.team || site.name, p.year)}</div>
            <div>${lines(p.category, list(p.tags).join(", "))}</div>
            <div>${[...details, ...linkHtml].join("<br>")}</div>
          </div>
        </section>
        <section class="body grid">
          ${p.quote ? `<figure class="quote"><blockquote>“${esc(p.quote.text)}”</blockquote><figcaption class="label">${esc(p.quote.by)}</figcaption></figure>` : ""}
          ${p.slides.length ? `<div class="boards">${p.slides.map((s, k) =>
            `<img src="${esc(asset(s.src))}" width="${s.w}" height="${s.h}" alt="${esc(p.title)} case study, part ${k + 1}" loading="lazy">`).join("")}</div>` : ""}
          ${p.story ? chapters(p) : ""}
        </section>
        <a class="next" href="#/work/${next.slug}"><span class="label">Next project</span><span class="title">${esc(next.title)}</span></a>`,
    };
  }

  function chapters(p) {
    const pic = (k) => p.gallery[k];
    return p.story.map((block) => {
      if (block.images) {
        const figs = block.images.map(pic).filter(Boolean)
          .map((g) => `<figure style="flex:${(g.w / g.h).toFixed(3)}">${image(g.src, p.title, { w: g.w, h: g.h })}</figure>`).join("");
        return `<div class="pics">${figs}</div>${block.caption ? `<p class="caption label">${esc(block.caption)}</p>` : ""}`;
      }
      const g = block.image != null && pic(block.image);
      const rows = (block.list || []).map(([k, v]) => `${k}: ${v}`).join("\n");
      return `
        <div class="chapter">
          <p class="label">${esc(block.label || "")}</p>
          <div class="text">${paragraphs(block.text)}</div>
          ${rows ? `<pre>${esc(rows)}</pre>` : ""}
          ${g ? `<figure>${image(g.src, block.caption || p.title, { w: g.w, h: g.h })}${block.caption ? `<figcaption class="caption label">${esc(block.caption)}</figcaption>` : ""}</figure>` : ""}
        </div>`;
    }).join("");
  }

  const figmaEmbed = (url) =>
    `https://embed.figma.com/${url.replace(/^https:\/\/(www\.)?figma\.com\//, "")}${url.includes("?") ? "&" : "?"}embed-host=share`;

  function ongoingPage(slug) {
    const o = ongoing.find((x) => x.slug === slug);
    if (!o) return notFoundPage();
    return {
      title: o.title,
      html: `
        <section class="hero grid">
          <h1 class="title lines">${esc(o.title)}</h1>
          <div class="intro lines">${paragraphs(o.summary)}</div>
          <div class="meta label">
            <div><span class="dot" aria-hidden="true"></span>${esc(o.status || "In progress")}<br>${esc(o.year || "")}</div>
            <div>${lines(o.category, list(o.tags).join(", "))}</div>
            <div>${o.board ? `<a href="${esc(o.board)}" target="_blank" rel="noopener">Open the board in Figma</a>` : ""}</div>
          </div>
        </section>
        ${o.board ? `<section class="body grid board"><iframe src="${esc(figmaEmbed(o.board))}" title="${esc(o.title)} research board" loading="lazy" allowfullscreen></iframe></section>` : ""}`,
    };
  }

  let shelf = { music: [], movies: [], photos: [] };
  const spotifyEmbed = (url) => {
    const m = String(url || "").match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|artist)\/([A-Za-z0-9]+)/);
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : "";
  };

  function aboutPage() {
    const row = (label, content) => content ? `<div class="row"><p class="label">${label}</p><div class="content">${content}</div></div>` : "";
    const certs = (site.certifications || []).map((c) =>
      `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.title)}</a>, ${esc(c.issuer)}</li>`).join("");
    const photos = shelf.photos.map((ph) => `<figure>${image(ph.src, ph.caption || `Photo by ${site.name}`)}</figure>`).join("");
    const music = shelf.music.map((m) => {
      const embed = spotifyEmbed(m.link);
      return embed
        ? `<div class="spot"><iframe src="${esc(embed)}" title="${esc(m.title || "Spotify track")}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>`
        : `<p><a href="${esc(m.link)}" target="_blank" rel="noopener">${esc(m.title || m.link)}</a></p>`;
    }).join("");
    const movies = shelf.movies.map((v) =>
      `<a href="${esc(v.link || "#")}" target="_blank" rel="noopener">${image(v.poster, v.title)}<span class="label">${esc(v.title)}</span></a>`).join("");
    const contact = [["Email", `mailto:${site.email}`, site.email], ...Object.entries(site.links).filter(([, u]) => u).map(([k, u]) => [linkName(k), u, linkName(k)])]
      .map(([, url, text]) => `<li><a href="${esc(url)}"${external(url)}>${esc(text)}</a></li>`).join("");

    return {
      title: "About",
      html: `
        <section class="hero grid">
          ${site.portrait ? `<figure class="portrait">${image(site.portrait, `Portrait of ${site.name}`, { lazy: false, w: 900, h: 1200 })}</figure>` : ""}
          <div class="about-text lines">${paragraphs(site.about)}</div>
          <h1 class="title lines">About</h1>
          <div class="meta label"><div>${lines(site.name, site.location)}</div><div>${lines(site.role, site.school)}</div></div>
        </section>
        <section class="rows grid">
          ${row("Toolkit", `<p>${site.skills.map(esc).join(", ")}</p>`)}
          ${row("Certificates", certs && `<ul>${certs}</ul>`)}
          ${row("Photos", photos && `<div class="photos">${photos}</div>`)}
          ${row("On repeat", music)}
          ${row("Watching", movies && `<div class="movies">${movies}</div>`)}
          ${row("Contact", `<ul>${contact}</ul>`)}
        </section>`,
    };
  }

  fetch(`../data/shelf.json?v=${Date.now()}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data) return;
      shelf = { music: data.music || [], movies: data.movies || [], photos: data.photos || [] };
      if (route().name === "about") show(route(), { animate: false, scroll: false });
    })
    .catch(() => {});

  const privacyPage = () => ({
    title: "Privacy & terms",
    html: `
      <section class="hero grid">
        <h1 class="title">Privacy &amp; terms</h1>
        <div class="plain">
          <p>This site has no cookies, analytics, ads or sign-up forms, and it doesn't collect anything about you.</p>
          <p>It's hosted on GitHub Pages, which keeps standard server logs. The music players come from Spotify, the research board from Figma, and movie posters from Apple and Wikipedia; each of those follows its own privacy policy when it loads.</p>
          <p>If you email me, I'll only use your address to reply.</p>
          <p>All projects, images and text here are my own work unless credited. Please ask before reusing them, and credit me if you share them.</p>
        </div>
      </section>`,
  });

  const notFoundPage = () => ({
    title: "Page not found",
    html: `<section class="hero grid"><h1 class="title">Not found</h1><p class="plain"><a href="#/">Back to the work</a></p></section>`,
  });

  // ---- routing ----

  function route() {
    const [section, slug] = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    let page;
    if (!section || (section === "work" && !slug)) page = { name: "work", ...homePage() };
    else if (section === "work") page = { name: "work", ...projectPage(slug) };
    else if (section === "now" && slug) page = { name: "work", ...ongoingPage(slug) };
    else if (section === "about") page = { name: "about", ...aboutPage() };
    else if (section === "privacy") page = { name: "", ...privacyPage() };
    else page = { name: "", ...notFoundPage() };
    return page;
  }

  function show(page, { animate = true, scroll = true } = {}) {
    view.innerHTML = page.html;
    document.body.classList.toggle("home", !!page.home);
    document.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === page.name) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = page.home || !page.title ? `${site.name}, Industrial Design Portfolio` : `${page.title}, ${site.name}`;
    if (scroll) {
      window.scrollTo(0, 0);
      view.focus({ preventScroll: true });
    }
    if (page.home) setUpStrip();
    revealLines(animate);
  }

  // a fly-in from the strip skips the fade so the image can travel across
  let pendingFly = null;

  addEventListener("hashchange", () => {
    const page = route();
    if (pendingFly) {
      const fly = pendingFly;
      pendingFly = null;
      show(page);
      landFly(fly);
      return;
    }
    if (reducedMotion) return show(page);
    view.classList.add("leaving");
    setTimeout(() => {
      show(page);
      view.classList.remove("leaving");
    }, 350);
  });

  // ---- text that rises in line by line ----

  function splitLines(p) {
    const words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
    const groups = [];
    let top = null;
    p.querySelectorAll(".w").forEach((w) => {
      if (w.offsetTop !== top) { groups.push([]); top = w.offsetTop; }
      groups[groups.length - 1].push(w.textContent);
    });
    p.innerHTML = groups.map((g) => `<span class="ln"><span>${esc(g.join(" "))}</span></span>`).join("");
  }

  function revealLines(animate) {
    view.querySelectorAll(".lines").forEach((block) => {
      if (!animate || reducedMotion) return;
      const targets = block.querySelectorAll("p").length ? [...block.querySelectorAll("p")] : [block];
      const original = targets.map((t) => t.textContent);
      targets.forEach(splitLines);
      block.querySelectorAll(".ln > span").forEach((s, i) => (s.style.transitionDelay = `${120 + i * 70}ms`));
      requestAnimationFrame(() => requestAnimationFrame(() => block.classList.add("in")));
      // put plain text back afterwards so the paragraph reflows on resize
      setTimeout(() => {
        targets.forEach((t, i) => (t.textContent = original[i]));
        block.classList.remove("lines", "in");
      }, 2600);
    });
  }

  // ---- home strip: scroll wheel and drag move it sideways ----

  function setUpStrip() {
    const strip = document.getElementById("strip");
    if (!strip) return;

    strip.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = strip.scrollWidth - strip.clientWidth;
      if ((e.deltaY > 0 && strip.scrollLeft >= max) || (e.deltaY < 0 && strip.scrollLeft <= 0)) return;
      e.preventDefault();
      strip.scrollLeft += e.deltaY;
    }, { passive: false });

    let startX = 0, startScroll = 0, moved = false, down = false;
    strip.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = e.clientX; startScroll = strip.scrollLeft;
    });
    addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) { moved = true; strip.classList.add("dragging"); }
      if (moved) strip.scrollLeft = startScroll - dx;
    });
    addEventListener("pointerup", () => {
      down = false;
      requestAnimationFrame(() => strip.classList.remove("dragging"));
    });
    strip.addEventListener("click", (e) => {
      if (moved) { e.preventDefault(); moved = false; return; }
      const tile = e.target.closest(".tile[data-slug]");
      if (tile && !reducedMotion) startFly(e, tile);
    });
    strip.addEventListener("dragstart", (e) => e.preventDefault());
  }

  // ---- the clicked cover grows into the project page's cover ----

  function startFly(e, tile) {
    const img = tile.querySelector("img");
    if (!img) return;
    e.preventDefault();
    const r = img.getBoundingClientRect();
    const fly = document.createElement("figure");
    fly.className = "fly";
    fly.innerHTML = `<img src="${img.currentSrc || img.src}" alt="" style="object-position:${img.style.objectPosition}">`;
    Object.assign(fly.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    document.body.appendChild(fly);
    view.classList.add("leaving");
    pendingFly = fly;
    setTimeout(() => {
      view.classList.remove("leaving");
      location.hash = tile.getAttribute("href");
    }, 300);
  }

  function landFly(fly) {
    const target = view.querySelector(".hero-img");
    if (!target) return fly.remove();
    target.style.visibility = "hidden";
    const r = target.getBoundingClientRect();
    requestAnimationFrame(() => {
      Object.assign(fly.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
      fly.querySelector("img").style.objectPosition = "50% 50%";
    });
    const done = () => { target.style.visibility = ""; fly.remove(); };
    fly.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 1200);
  }

  // ---- header: turnaround and local time ----

  const sprite = new Image();
  sprite.onload = () => document.documentElement.style.setProperty("--frames", Math.round(sprite.naturalWidth / sprite.naturalHeight));
  sprite.src = "../assets/turnaround/turn.webp?v=4";

  const clock = document.getElementById("clock");
  const tick = () => {
    const [h, m] = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false })
      .format(new Date()).split(":");
    clock.innerHTML = `${h}&nbsp;&nbsp;${m} IST`;
  };
  tick();
  setInterval(tick, 15000);

  // ---- footer ----

  document.getElementById("links").innerHTML = Object.entries(site.links).filter(([, u]) => u)
    .map(([k, url]) => `<a href="${esc(url)}"${external(url)}>${esc(linkName(k))}</a>`).join("");
  document.getElementById("copy").innerHTML = `© ${new Date().getFullYear()} ${esc(site.name)}<br><a href="#/privacy">Privacy &amp; terms</a>`;

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
    if (reducedMotion) { cta.textContent = text; return; }
    const from = cta.textContent;
    const chars = Array.from({ length: Math.max(from.length, text.length) }, (_, i) => {
      const start = Math.floor(Math.random() * 8);
      return { from: from[i] || "", to: text[i] || "", start, end: start + 6 + Math.floor(Math.random() * 10) + i };
    });
    let t = 0;
    const step = () => {
      let done = 0;
      cta.innerHTML = chars.map((c) => {
        if (t >= c.end) { done++; return esc(c.to); }
        if (t >= c.start) return `<span class="x">${esc(GLYPHS[Math.floor(Math.random() * GLYPHS.length)])}</span>`;
        return esc(c.from);
      }).join("");
      if (done < chars.length) { t++; frame = requestAnimationFrame(step); }
    };
    step();
  }
  cta.addEventListener("pointerenter", () => scrambleTo(site.email));
  cta.addEventListener("pointerleave", () => scrambleTo(LABEL));
  cta.addEventListener("focus", () => scrambleTo(site.email));
  cta.addEventListener("blur", () => scrambleTo(LABEL));

  show(route());
})();
