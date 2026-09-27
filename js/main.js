(() => {
  const S = window.SITE;
  const P = window.PROJECTS;
  const view = document.getElementById("view");
  const wipe = document.getElementById("wipe");
  const preview = document.getElementById("preview");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const media = (src, label, alt = "") =>
    src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" referrerpolicy="no-referrer" />` : `<div class="ph">${esc(label)}</div>`;

  // ---------- views ----------
  function home() {
    const [first, ...rest] = S.name.toUpperCase().split(" ");
    const rows = P.map((p, i) => `
      <li class="index-row">
        <a href="#/work/${p.slug}" data-cover="${esc(p.cover)}">
          <span class="num">${pad(i + 1)}</span>
          <span class="title">${esc(p.title)}</span>
          <span class="label disc">${esc(p.category)}</span>
          <span class="label year">${esc(p.year || "")}</span>
          <span class="arrow">→</span>
          <span class="mthumb">${media(p.cover, "Image soon", p.title)}</span>
        </a>
      </li>`).join("");

    return `
      <section class="hero">
        <i class="reg tl"></i><i class="reg tr"></i>
        <h1 class="hero-name">
          <span class="line"><span>${esc(first)}</span></span>
          <span class="line"><span>${esc(rest.join(" "))}<span class="accent">.</span></span></span>
        </h1>
        <div class="hero-grid">
          <div class="hero-meta">
            <div class="row"><b>Discipline</b>${esc(S.role)}</div>
            <div class="row"><b>Studying</b>${esc(S.school)}</div>
            <div class="row"><b>Based</b>${esc(S.location)}</div>
          </div>
          ${S.intro ? `<p class="hero-intro">${esc(S.intro)}</p>` : ""}
        </div>
      </section>
      ${marquee(S.skills)}
      ${nowBlock()}
      <section class="section">
        <div class="section-head"><p class="label">Selected work</p><p class="label">(${pad(P.length)})</p></div>
        <ul class="index-list">${rows}</ul>
      </section>`;
  }

  // Work in progress, above the finished index.
  const O = window.ONGOING || [];
  function nowBlock() {
    if (!O.length) return "";
    return `<section class="section now">
      <div class="section-head"><p class="label">Now</p><p class="label">In progress</p></div>
      ${O.map((o) => `
      <a class="now-item" href="#/now/${o.slug}">
        <span class="label now-status"><i></i>${esc(o.status || "Ongoing")}</span>
        <span class="now-title">${esc(o.title)}</span>
        <span class="now-sub">${esc(o.subtitle)}</span>
        <span class="now-go">See the research →</span>
      </a>`).join("")}
    </section>`;
  }

  // Figma share link -> embeddable URL
  const figmaEmbed = (url) => `https://embed.figma.com/${url.replace(/^https:\/\/(www\.)?figma\.com\//, "")}${url.includes("?") ? "&" : "?"}embed-host=share`;

  function ongoing(slug) {
    const o = O.find((x) => x.slug === slug);
    if (!o) return notFound();
    const specs = [["Status", o.status], ["Category", o.category], ["Year", o.year], ["Team", o.team], ["Guided by", o.guide]].filter(([, v]) => v);
    const links = Object.entries(o.links || {}).filter(([, v]) => v);
    return `
      <section class="p-head">
        <a href="#/" class="back">← Index</a>
        <h1 class="p-title">${esc(o.title)}</h1>
        ${o.subtitle ? `<p class="p-sub">${esc(o.subtitle)}</p>` : ""}
      </section>
      <dl class="titleblock">${specs.map(([k, v]) => `<div><dt class="label">${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      <section class="p-body">
        <p class="label">So far</p>
        <div class="copy">
          ${[].concat(o.summary || []).map((t) => `<p>${esc(t)}</p>`).join("")}
          ${links.length ? `<div class="p-links">${links.map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)} ↗</a>`).join("")}</div>` : ""}
        </div>
      </section>
      ${o.board ? `
      <section class="board">
        <div class="section-head"><p class="label">Research board, live from FigJam</p><p class="label">Drag and zoom inside</p></div>
        <iframe src="${esc(figmaEmbed(o.board))}" title="${esc(o.title)} research board" loading="lazy" allowfullscreen></iframe>
      </section>` : ""}`;
  }

  function work(filter = "All") {
    const tags = ["All", ...new Set(P.flatMap((p) => p.tags))];
    const count = (t) => (t === "All" ? P.length : P.filter((p) => p.tags.includes(t)).length);
    const list = filter === "All" ? P : P.filter((p) => p.tags.includes(filter));
    return `
      <section class="section">
        <div class="section-head"><p class="label">Work</p><p class="label">(${pad(list.length)})</p></div>
        <div class="filters">${tags.map((t) =>
          `<button class="chip${t === filter ? " is-active" : ""}" data-filter="${esc(t)}">${esc(t)}<sup>${count(t)}</sup></button>`).join("")}
        </div>
        <div class="work-grid">${list.map((p) => {
          const i = P.indexOf(p);
          return `
          <a class="card" href="#/work/${p.slug}">
            <div class="card-media">${media(p.cover, "Image soon", p.title)}<span class="tag">${esc(p.category)}</span></div>
            <div class="card-info">
              <div><h3>${esc(p.title)}</h3><p>${esc(p.subtitle)}</p></div>
              <span class="label">${pad(i + 1)}${p.year ? " / " + esc(p.year) : ""}</span>
            </div>
          </a>`;
        }).join("")}</div>
      </section>`;
  }

  function project(slug) {
    const i = P.findIndex((p) => p.slug === slug);
    if (i < 0) return notFound();
    const p = P[i];
    const next = P[(i + 1) % P.length];
    const specs = [
      ["No.", pad(i + 1)], ["Category", p.category], ["Year", p.year],
      ["Team", p.team], ["Role", p.role], ["Guided by", p.guide], ["Duration", p.duration],
      ["Material", p.material], ["Tools", (p.tools || []).join(", ")],
    ].filter(([, v]) => v);
    const links = Object.entries(p.links || {}).filter(([, v]) => v);
    let n = 0;
    const img = (src) => `<img src="${esc(src)}" alt="${esc(p.title)}, image ${++n}" loading="lazy" referrerpolicy="no-referrer" />`;
    // Uploaded gallery: rows of up to 3 where every image in a row shares one
    // height; each image's width is proportional to its aspect ratio.
    const rows = [];
    for (let k = 0; k < p.gallery.length; ) {
      const left = p.gallery.length - k;
      const take = left === 4 ? 2 : Math.min(3, left);
      rows.push(p.gallery.slice(k, k + take)); k += take;
    }
    const justified = rows.map((row) => `<div class="j-row">${row.map((g) =>
      `<img src="${esc(g.src)}" width="${g.w}" height="${g.h}" style="flex-grow:${(g.w / g.h).toFixed(4)}" alt="${esc(p.title)}, image ${++n}" loading="lazy" />`).join("")}</div>`).join("");
    const gallery = justified + (p.images || []).map((item) =>
      Array.isArray(item) ? `<div class="g-row" style="--cols:${item.length}">${item.map(img).join("")}</div>` : img(item)).join("");

    return `
      <section class="p-head">
        <a href="#/work" class="back">← All work</a>
        <h1 class="p-title">${esc(p.title)}</h1>
        ${p.subtitle ? `<p class="p-sub">${esc(p.subtitle)}</p>` : ""}
      </section>
      <dl class="titleblock">${specs.map(([k, v]) => `<div><dt class="label">${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      ${p.slides.length ? "" : `<div class="p-cover">${media(p.cover, "Cover image soon", p.title)}</div>`}
      ${p.story ? story(p, links) : `
      <section class="p-body">
        <p class="label">Overview</p>
        <div class="copy">
          ${(Array.isArray(p.summary) ? p.summary : [p.summary]).filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("")}
          ${links.length ? `<div class="p-links">${links.map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)} ↗</a>`).join("")}</div>` : ""}
        </div>
      </section>
      ${p.slides.length ? `
      <section class="slides">
        <div class="section-head"><p class="label">Full case study</p><p class="label">Scroll ↓</p></div>
        <div class="slide-stack">${p.slides.map((s, k) =>
          `<img src="${esc(s.src)}" width="${s.w}" height="${s.h}" alt="${esc(p.title)} case study, part ${k + 1}" ${k ? 'loading="lazy"' : ""} />`).join("")}</div>
      </section>` : ""}
      ${gallery ? `<div class="gallery">${gallery}</div>` : p.slides.length ? "" : `<div class="gallery empty"><div class="ph">Process images coming soon</div></div>`}`}
      ${P.length > 1 ? `<a class="next" href="#/work/${next.slug}"><span class="label">Next project →</span><span class="n-title">${esc(next.title)}</span></a>` : ""}`;
  }

  // A project told as alternating sections and images, for work without a
  // presentation board. Blocks (see js/projects.js):
  //   { label, heading, text: [..], list: [[key, value]..] }  text section
  //   { images: [i, j], caption }                               equal-height row
  //   { label, heading, text, list, image: i, caption }         image beside text
  // Image numbers index the project's uploaded gallery (0 = first).
  function story(p, links) {
    const g = (k) => p.gallery[k];
    const pic = (x, eager) => `<img src="${esc(x.src)}" width="${x.w}" height="${x.h}" style="flex-grow:${(x.w / x.h).toFixed(4)}" alt="" ${eager ? "" : 'loading="lazy"'} />`;
    const list = (rows) => rows ? `<dl class="spec-list">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : "";
    const copy = (b) => `
      ${b.heading ? `<h2 class="s-head">${esc(b.heading)}</h2>` : ""}
      ${[].concat(b.text || []).map((t) => `<p>${esc(t)}</p>`).join("")}
      ${list(b.list)}`;
    const cap = (c) => c ? `<p class="label s-cap">${esc(c)}</p>` : "";
    const blocks = p.story.map((b) => {
      if (b.images) return `<figure class="s-fig">${`<div class="j-row">${b.images.map(g).filter(Boolean).map((x) => pic(x)).join("")}</div>`}${cap(b.caption)}</figure>`;
      if (b.image != null && g(b.image)) return `
        <section class="s-side">
          <figure class="s-side-img">${pic(g(b.image))}${cap(b.caption)}</figure>
          <div class="s-side-copy">${b.label ? `<p class="label">${esc(b.label)}</p>` : ""}<div class="copy">${copy(b)}</div></div>
        </section>`;
      return `<section class="p-body s-text"><p class="label">${esc(b.label || "")}</p><div class="copy">${copy(b)}</div></section>`;
    }).join("");
    const linkRow = links.length ? `<section class="p-body s-text"><p class="label">Links</p><div class="copy"><div class="p-links">${links.map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)} ↗</a>`).join("")}</div></div></section>` : "";
    return `<div class="story">${blocks}${linkRow}</div>`;
  }

  function about() {
    return `
      <section class="section">
        <div class="section-head" style="margin-bottom:clamp(32px,5vw,64px)"><p class="label">About</p><p class="label">${esc(S.school)}</p></div>
        <div class="about-grid">
          ${S.portrait ? `<figure class="portrait"><img src="${esc(S.portrait)}" alt="Portrait of ${esc(S.name)}" width="900" height="1200" /></figure>` : `<p class="label">About</p>`}
          <div class="copy">${S.about.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
          <p class="label">Toolkit</p>
          <div class="skills">${S.skills.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
          ${(S.certifications || []).length ? `<p class="label">Certifications</p>
          <ul class="certs">${S.certifications.map((c) => `
            <li><a href="${esc(c.url)}" target="_blank" rel="noopener"><span>${esc(c.title)}</span><span class="label">${esc(c.issuer)} ↗</span></a></li>`).join("")}
          </ul>` : ""}
          ${shelf()}
          ${S.resume ? `<p class="label">CV</p><div class="copy"><a href="${esc(S.resume)}" target="_blank" style="border-bottom:1px solid">Download résumé ↗</a></div>` : ""}
        </div>
      </section>`;
  }

  // Music, movies and photos, edited from admin.html and stored in data/shelf.json.
  // Each group only appears once it has something in it.
  let SHELF = { music: [], movies: [], photos: [] };
  // Spotify links play inline through Spotify's own small player, which
  // shows the title, artist and cover; anything else falls back to a card.
  const spotify = (url) => {
    const m = String(url || "").match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|artist)\/([A-Za-z0-9]+)/);
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : "";
  };
  function shelf() {
    const out = [];
    if (SHELF.music.length) out.push(`<p class="label">On repeat</p>
      <ul class="shelf-music">${SHELF.music.map((m) => {
        const embed = spotify(m.link);
        if (embed) return `<li class="spot"><iframe src="${esc(embed)}" title="${esc(m.title || "Spotify track")}" loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></li>`;
        const inner = `${m.cover ? `<img src="${esc(m.cover)}" alt="" loading="lazy" />` : `<span class="nocover"></span>`}
          <span><b>${esc(m.title || m.link)}</b><span class="soft">${esc(m.artist || "")}</span></span>`;
        return `<li>${m.link ? `<a href="${esc(m.link)}" target="_blank" rel="noopener">${inner}</a>` : `<div>${inner}</div>`}</li>`;
      }).join("")}</ul>`);
    if (SHELF.movies.length) out.push(`<p class="label">Watching</p>
      <ul class="shelf-movies">${SHELF.movies.map((v) => {
        const inner = `<span class="cover">${v.poster ? `<img src="${esc(v.poster)}" alt="" loading="lazy" referrerpolicy="no-referrer" />` : `<span class="nocover">${esc(v.title)}</span>`}</span>
          <b>${esc(v.title)}</b>${v.year ? `<span class="soft">${esc(v.year)}</span>` : ""}`;
        return `<li>${v.link ? `<a href="${esc(v.link)}" target="_blank" rel="noopener">${inner}</a>` : inner}</li>`;
      }).join("")}</ul>`);
    if (SHELF.photos.length) out.push(`<p class="label">Photos</p>
      <div class="shelf-photos">${SHELF.photos.map((p) =>
        `<figure><img src="${esc(p.src)}" alt="${esc(p.caption || "")}" loading="lazy" />${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}</figure>`).join("")}</div>`);
    return out.join("");
  }
  fetch(`data/shelf.json?v=${Date.now()}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d) return;
      SHELF = { music: d.music || [], movies: d.movies || [], photos: d.photos || [] };
      if (parse().name === "about") render(false);
    })
    .catch(() => {});

  // Plain privacy note and terms, written for what this site actually does.
  function privacy() {
    return `
      <section class="section legal">
        <div class="section-head" style="margin-bottom:clamp(32px,5vw,64px)"><p class="label">Privacy & terms</p><p class="label">Updated 2026</p></div>
        <div class="about-grid">
          <p class="label">Privacy</p>
          <div class="copy">
            <p>This site has no cookies, analytics, ads or sign-up forms, and it doesn't collect anything about you.</p>
            <p>It's hosted on GitHub Pages, which keeps standard server logs. Fonts load from Google Fonts. The music players come from Spotify, the research board from Figma, and movie posters from Apple and Wikipedia; each of those follows its own privacy policy when it loads.</p>
            <p>If you email me, I'll only use your address to reply.</p>
          </div>
          <p class="label">Terms</p>
          <div class="copy">
            <p>All projects, images and text here are my own work unless credited. Please ask before reusing them, and credit me if you share them.</p>
          </div>
        </div>
      </section>`;
  }

  function notFound() {
    return `<section class="section"><p class="label">404</p><h1 class="p-title">Not here.</h1><p><a class="back" href="#/">← Back to index</a></p></section>`;
  }

  function marquee(items) {
    const run = items.map((s) => `<span>${esc(s)}</span>`).join("");
    return `<div class="marquee" aria-hidden="true"><div class="marquee-track">${run}${run}</div></div>`;
  }

  // ---------- router ----------
  let workFilter = "All";
  function parse() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (!parts.length) return { name: "home", html: home() };
    if (parts[0] === "work" && parts[1]) return { name: "work", html: project(parts[1]) };
    if (parts[0] === "work") return { name: "work", html: work(workFilter) };
    if (parts[0] === "about") return { name: "about", html: about() };
    if (parts[0] === "privacy") return { name: "", html: privacy() };
    if (parts[0] === "now" && parts[1]) return { name: "", html: ongoing(parts[1]) };
    return { name: "", html: notFound() };
  }

  function render(animate) {
    const route = parse();
    view.innerHTML = route.html;
    view.classList.remove("view-enter");
    if (animate) { void view.offsetWidth; view.classList.add("view-enter"); }
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === route.name));
    const h1 = view.querySelector("h1");
    document.title = route.name === "home" || !h1 ? `${S.name}, Industrial Design` : `${h1.textContent} · ${S.name}`;
    window.scrollTo(0, 0);
    hidePreview();
  }

  window.addEventListener("hashchange", () => {
    if (location.hash === "#contact") return;
    if (reduceMotion) return render(false);
    wipe.className = "wipe in";
    setTimeout(() => { render(true); wipe.className = "wipe out"; }, 450);
  });

  // "Contact" should scroll to the footer, not route
  document.getElementById("header-contact").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  view.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-filter]");
    if (!chip) return;
    workFilter = chip.dataset.filter;
    view.innerHTML = work(workFilter);
  });

  // ---------- cursor preview on the index ----------
  let mx = 0, my = 0, px = 0, py = 0, raf = 0;
  const previewImg = preview.querySelector("img");
  function hidePreview() { preview.classList.remove("is-on"); }
  function loop() {
    px += (mx - px) * 0.14; py += (my - py) * 0.14;
    preview.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(loop);
  }
  view.addEventListener("mouseover", (e) => {
    const row = e.target.closest(".index-row a");
    if (!row || !row.dataset.cover) return;
    if (previewImg.getAttribute("src") !== row.dataset.cover) previewImg.src = row.dataset.cover;
    preview.classList.add("is-on");
  });
  view.addEventListener("mouseout", (e) => {
    const row = e.target.closest(".index-row a");
    if (row && !row.contains(e.relatedTarget)) hidePreview();
  });
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (!raf) { px = mx; py = my; loop(); }
  });

  // ---------- footer + clock ----------
  const email = document.getElementById("footer-email");
  email.href = `mailto:${S.email}`;

  // "Get in touch" scrambles into the email address on hover / focus / tap,
  // and back again when the pointer leaves.
  const scr = document.getElementById("scramble");
  const FROM = "Get in touch", TO = S.email, GLYPHS = "!<>-_\\/[]{}=+*^?#@%&$";
  let scrRaf = 0, scrTarget = FROM;
  function scrambleTo(target) {
    if (target === scrTarget) return;
    scrTarget = target;
    cancelAnimationFrame(scrRaf);
    if (reduceMotion) { scr.textContent = target; return; }
    const from = scr.textContent, len = Math.max(from.length, target.length);
    // each position gets its own start and settle frame, so the change ripples
    const q = Array.from({ length: len }, (_, i) => {
      const start = Math.floor(Math.random() * 12), end = start + 10 + Math.floor(Math.random() * 18) + i;
      return { from: from[i] || "", to: target[i] || "", start, end };
    });
    let frame = 0;
    const step = () => {
      let done = 0, html = "";
      for (const c of q) {
        if (frame >= c.end) { done++; html += esc(c.to); }
        else if (frame >= c.start) html += `<span class="x">${esc(GLYPHS[Math.floor(Math.random() * GLYPHS.length)])}</span>`;
        else html += esc(c.from);
      }
      scr.innerHTML = html;
      if (done < q.length) { frame++; scrRaf = requestAnimationFrame(step); }
    };
    step();
  }
  email.addEventListener("pointerenter", () => scrambleTo(TO));
  email.addEventListener("pointerleave", () => scrambleTo(FROM));
  email.addEventListener("focus", () => scrambleTo(TO));
  email.addEventListener("blur", () => scrambleTo(FROM));
  // on touch screens the first tap reveals the address, the second opens mail
  email.addEventListener("click", (e) => {
    if (matchMedia("(hover: none)").matches && scrTarget !== TO) { e.preventDefault(); scrambleTo(TO); }
  });
  document.getElementById("footer-links").innerHTML = [
    ["Email", `mailto:${S.email}`], ...Object.entries(S.links).filter(([, v]) => v),
  ].map(([k, v]) => `<a href="${esc(v)}" ${v.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(k)} ↗</a>`).join("");
  document.getElementById("footer-copy").innerHTML = `© ${new Date().getFullYear()} ${esc(S.name)} · <a href="#/privacy">Privacy & terms</a>`;

  const clock = document.getElementById("clock");
  const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
  const tick = () => (clock.textContent = `IN ${fmt.format(new Date())} IST`);
  tick(); setInterval(tick, 20000);

  render(!reduceMotion);
})();
