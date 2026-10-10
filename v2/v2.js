// v2 preview: a mid-2000s portal over the same data as the live site
// (js/projects.js, js/assets.generated.js, data/shelf.json).
(() => {
  const S = window.SITE, P = window.PROJECTS, O = window.ONGOING || [];
  const view = document.getElementById("view");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const u = (p) => (!p || /^(https?:|data:)/.test(p) ? p || "" : `../${p}`);   // data paths are relative to the site root
  const paras = (t) => [].concat(t || []).filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join("");
  const NAMES = { linkedin: "LinkedIn", github: "GitHub", behance: "Behance", instagram: "Instagram" };
  const nice = (k) => NAMES[k] || k[0].toUpperCase() + k.slice(1);
  const ext = (v) => (/^https?:/.test(v) ? ' target="_blank" rel="noopener"' : "");
  const img = (src, alt = "", lazy = true) => (src ? `<img src="${esc(u(src))}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""} referrerpolicy="no-referrer" />` : "");
  const short = (t, n) => (t.length > n ? t.slice(0, t.lastIndexOf(" ", n)).replace(/[.,;:]+$/, "") + "…" : t);
  const contacts = () => [["Email", `mailto:${S.email}`], ...Object.entries(S.links).filter(([, v]) => v).map(([k, v]) => [nice(k), v])];
  const box = (title, body, right = "", cls = "") =>
    `<section class="box ${cls}"><div class="box-head"><h2>${title}</h2>${right}</div><div class="box-body">${body}</div></section>`;
  const kv = (rows) => `<table class="kv">${rows.filter(([, v]) => v).map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>`;
  const cats = [...new Set(P.map((p) => p.category))];

  // ---------- shared pieces ----------
  function row(p) {
    const sum = [].concat(p.summary || [])[0] || "";
    const parts = p.slides.length ? `${p.slides.length} boards` : p.story ? `${p.story.length} sections` : "";
    return `<li>
      <a class="thumb" href="#/work/${p.slug}" tabindex="-1" aria-hidden="true">${img(p.cover, "")}</a>
      <div>
        <h3><a href="#/work/${p.slug}">${esc(p.title)}</a></h3>
        <div class="sub">${esc(p.subtitle)}</div>
        <p class="desc">${esc(short(sum, 120))} <a href="#/work/${p.slug}">(more)</a></p>
      </div>
      <div class="info">
        ${p.year ? `Year: <b>${esc(p.year)}</b><br>` : ""}
        Type: <b>${esc(p.category)}</b><br>
        ${p.team ? `Team: <b>${esc(p.team)}</b><br>` : ""}
        ${parts ? `Length: <b>${parts}</b>` : ""}
      </div>
    </li>`;
  }
  function nowBox() {
    if (!O.length) return "";
    return box("Now working on", O.map((o) => `
      <div class="side-item">
        <a class="t" href="#/now/${o.slug}">${esc(o.title)}</a>
        <p>${esc(o.subtitle)}</p>
        <p class="meta"><span class="live" aria-hidden="true"></span>${esc(o.status || "In progress")}</p>
      </div>`).join("") + `<a class="more-link" href="#/now/${O[0].slug}">See the research board »</a>`, "", "note");
  }
  function aboutBox() {
    return box("About me", `<div class="me-mini">
      ${S.portrait ? `<a class="thumb" href="#/about">${img(S.portrait, `Portrait of ${S.name}`)}</a>` : ""}
      <div><p><b>${esc(S.name)}</b><br>${esc(S.role)}<br>${esc(S.school)}, ${esc(S.location)}</p>
        <a class="more-link" href="#/about">More about me »</a></div></div>`);
  }
  const contactBox = () => box("Contact", kv(contacts().map(([k, v]) => [k, `<a href="${esc(v)}"${ext(v)}>${esc(k === "Email" ? S.email : v.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a>`])));

  // ---------- home ----------
  function home() {
    const f = P[0], rest = P.slice(1);
    return `<div class="cols">
      <div class="main">
        <div>
          <div class="sect"><h2>Featured project</h2><a href="#/work">All ${P.length} projects »</a></div>
          <div class="featured" style="padding-top:10px">
            <a class="thumb" href="#/work/${f.slug}" tabindex="-1" aria-hidden="true">${img(f.cover, "", false)}</a>
            <div>
              <h3><a href="#/work/${f.slug}">${esc(f.title)}</a></h3>
              <div class="sub">${esc(f.subtitle)}</div>
              ${paras(f.summary)}
              <div class="meta">${[f.year, f.category, f.team].filter(Boolean).map(esc).join(" · ")}</div>
              <p style="margin-top:6px"><a class="more-link" href="#/work/${f.slug}">View project »</a></p>
            </div>
          </div>
        </div>
        <div>
          <div class="sect"><h2>More projects</h2><a href="#/work">See all »</a></div>
          <ul class="list">${rest.map(row).join("")}</ul>
        </div>
      </div>
      <aside class="side">${nowBox()}${aboutBox()}${contactBox()}</aside>
    </div>`;
  }

  // ---------- work: search + category ----------
  function work(params) {
    const q = (params.get("q") || "").trim().toLowerCase(), cat = params.get("cat") || "";
    const hit = (p) => !q || [p.title, p.subtitle, p.category, ...(p.tags || []), ...(p.tools || []), ...[].concat(p.summary || [])].join(" ").toLowerCase().includes(q);
    const list = P.filter((p) => (!cat || p.category === cat) && hit(p));
    const link = (c, label) => (c === cat ? `<b>${esc(label)}</b>` : `<a href="#/work${c ? `?cat=${encodeURIComponent(c)}` : ""}">${esc(label)}</a>`);
    const what = [cat && esc(cat), q && `“${esc(q)}”`].filter(Boolean).join(", ");
    return `<div class="crumbs"><a href="#/">Home</a> › Work</div>
    <div class="cols">
      <div class="main">
        <div>
          <div class="sect"><h2>${what ? `Results for ${what}` : "All projects"}</h2><span class="meta">${list.length} of ${P.length}</span></div>
          <div class="filterbar">${link("", "All")}${cats.map((c) => link(c, c)).join("")}</div>
          ${list.length ? `<ul class="list">${list.map(row).join("")}</ul>` : `<p class="empty">Nothing matches that. <a href="#/work">Show all projects</a>.</p>`}
        </div>
      </div>
      <aside class="side">${nowBox()}${box("Browse by type", `<ul class="plainlist">${cats.map((c) =>
        `<li><a href="#/work?cat=${encodeURIComponent(c)}">${esc(c)}</a> (${P.filter((p) => p.category === c).length})</li>`).join("")}</ul>`)}</aside>
    </div>`;
  }

  // ---------- project ----------
  function project(sl) {
    const i = P.findIndex((p) => p.slug === sl);
    if (i < 0) return notFound();
    const p = P[i], prev = P[(i - 1 + P.length) % P.length], next = P[(i + 1) % P.length];
    const links = Object.entries(p.links || {}).filter(([, v]) => v);
    const others = P.filter((x) => x !== p).slice(0, 4);
    return `<div class="crumbs"><a href="#/">Home</a> › <a href="#/work">Work</a> › ${esc(p.title)}</div>
    <div class="cols">
      <div class="main">
        <div class="title-block"><h1>${esc(p.title)}</h1><div class="sub">${esc(p.subtitle)}</div></div>
        <div class="thumb">${img(p.cover, p.title, false)}</div>
        <div class="reading">${paras(p.summary)}</div>
        ${p.quote ? `<figure class="quote" style="margin-left:0;margin-right:0"><blockquote>“${esc(p.quote.text)}”</blockquote><cite>${esc(p.quote.by)}</cite></figure>` : ""}
        ${p.slides.length ? box("Case study", `<p class="slides-note">${p.slides.length} boards. Scroll to read.</p><div class="slides">${p.slides.map((s, k) =>
          `<img src="${esc(u(s.src))}" width="${s.w}" height="${s.h}" alt="${esc(p.title)} case study, board ${k + 1}" loading="lazy" />`).join("")}</div>`, `<span>${esc(p.category)}</span>`) : ""}
        ${p.story ? box("Build notes", story(p)) : ""}
        <div class="pager"><a href="#/work/${prev.slug}">« ${esc(prev.title)}</a><a href="#/work">All projects</a><a href="#/work/${next.slug}">${esc(next.title)} »</a></div>
      </div>
      <aside class="side">
        ${box("Project info", kv([["Year", esc(p.year)], ["Type", esc(p.category)], ["Team", esc(p.team)], ["Guided by", esc(p.guide)], ["Duration", esc(p.duration)], ["Tools", esc((p.tools || []).join(", "))], ["Tags", esc((p.tags || []).join(", "))]]))}
        ${links.length ? box("Links", `<ul class="plainlist">${links.map(([k, v]) => `<li><a href="${esc(v)}"${ext(v)}>${esc(nice(k))}</a></li>`).join("")}</ul>`) : ""}
        ${box("Other projects", `<ul class="related">${others.map((x) => `<li>
          <a class="thumb" href="#/work/${x.slug}" tabindex="-1" aria-hidden="true">${img(x.cover, "")}</a>
          <div><a class="t" href="#/work/${x.slug}">${esc(x.title)}</a><div class="meta">${esc(x.subtitle)}</div></div></li>`).join("")}</ul>`, `<a href="#/work">See all</a>`)}
      </aside>
    </div>`;
  }
  function story(p) {
    const g = (k) => p.gallery[k];
    const fig = (x, cap) => (x ? `<figure class="fig" style="margin:8px 0 0"><span class="thumb">${img(x.src, cap || p.title)}</span>${cap ? `<figcaption>${esc(cap)}</figcaption>` : ""}</figure>` : "");
    return p.story.map((b) => {
      if (b.images) return `<div class="chap"><div class="figs">${b.images.map(g).filter(Boolean).map((x) =>
        `<figure style="flex:${(x.w / x.h).toFixed(3)}"><span class="thumb">${img(x.src, p.title)}</span></figure>`).join("")}</div>${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}</div>`;
      return `<div class="chap">${b.label ? `<h3>${esc(b.label)}</h3>` : ""}${paras(b.text)}
        ${b.list ? kv(b.list.map(([k, v]) => [esc(k), esc(v)])) : ""}${b.image != null ? fig(g(b.image), b.caption) : ""}</div>`;
    }).join("");
  }

  // ---------- ongoing ----------
  const figmaEmbed = (url) => `https://embed.figma.com/${url.replace(/^https:\/\/(www\.)?figma\.com\//, "")}${url.includes("?") ? "&" : "?"}embed-host=share`;
  function ongoing(sl) {
    const o = O.find((x) => x.slug === sl);
    if (!o) return notFound();
    return `<div class="crumbs"><a href="#/">Home</a> › Now › ${esc(o.title)}</div>
    <div class="cols">
      <div class="main">
        <div class="title-block"><h1>${esc(o.title)}</h1><div class="sub"><span class="live" aria-hidden="true"></span>${esc(o.status || "In progress")}. ${esc(o.subtitle)}.</div></div>
        <div class="reading">${paras(o.summary)}</div>
        ${o.board ? box("Research board", `<div class="board"><iframe src="${esc(figmaEmbed(o.board))}" title="${esc(o.title)} research board" loading="lazy" allowfullscreen></iframe></div>`,
          `<a href="${esc(o.board)}" target="_blank" rel="noopener">Open in Figma</a>`) : ""}
      </div>
      <aside class="side">
        ${box("Project info", kv([["Status", esc(o.status)], ["Year", esc(o.year)], ["Type", esc(o.category)], ["Tags", esc((o.tags || []).join(", "))]]))}
        ${box("Finished projects", `<ul class="plainlist">${P.map((x) => `<li><a href="#/work/${x.slug}">${esc(x.title)}</a></li>`).join("")}</ul>`)}
      </aside>
    </div>`;
  }

  // ---------- about ----------
  let SHELF = { music: [], movies: [], photos: [] };
  const spotify = (url) => {
    const m = String(url || "").match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|artist)\/([A-Za-z0-9]+)/);
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0` : "";
  };
  function about() {
    const music = SHELF.music.map((m) => {
      const e = spotify(m.link);
      return e ? `<div class="spot"><iframe src="${esc(e)}" title="${esc(m.title || "Spotify track")}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>`
        : `<p><a href="${esc(m.link)}" target="_blank" rel="noopener">${esc(m.title || m.link)}</a></p>`;
    }).join("");
    return `<div class="crumbs"><a href="#/">Home</a> › About</div>
    <div class="cols">
      <div class="main">
        <div class="title-block"><h1>About me</h1></div>
        <div class="about-top">
          ${S.portrait ? `<div><span class="thumb">${img(S.portrait, `Portrait of ${S.name}`, false)}</span></div>` : ""}
          <div class="reading">${paras(S.about)}</div>
        </div>
        ${SHELF.photos.length ? box("Photos I took", `<div class="photos">${SHELF.photos.map((p) =>
          `<figure style="margin:0"><span class="thumb">${img(p.src, p.caption || "Photo by Geo Subash")}</span>${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ""}</figure>`).join("")}</div>`, `<span>${SHELF.photos.length} photos</span>`) : ""}
        ${SHELF.movies.length ? box("Watching", `<div class="movies">${SHELF.movies.map((v) =>
          `<a href="${esc(v.link || "#")}" target="_blank" rel="noopener"><span class="thumb">${img(v.poster, v.title)}</span>${esc(v.title)}${v.year ? ` (${esc(v.year)})` : ""}</a>`).join("")}</div>`) : ""}
      </div>
      <aside class="side">
        ${box("Profile", kv([["Name", esc(S.name)], ["Studying", esc(S.role)], ["School", esc(S.school)], ["Based in", esc(S.location)]]))}
        ${box("Toolkit", `<div class="chips">${S.skills.map(esc).join(" · ")}</div>`)}
        ${(S.certifications || []).length ? box("Certificates", `<ul class="certs">${S.certifications.map((c) =>
          `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.title)}</a><div class="meta">${esc(c.issuer)}</div></li>`).join("")}</ul>`) : ""}
        ${music ? box("On repeat", music) : ""}
        ${contactBox()}
      </aside>
    </div>`;
  }
  fetch(`../data/shelf.json?v=${Date.now()}`).then((r) => (r.ok ? r.json() : null)).then((d) => {
    if (!d) return;
    SHELF = { music: d.music || [], movies: d.movies || [], photos: d.photos || [] };
    if (route().name === "about") render(false);
  }).catch(() => {});

  function privacy() {
    return `<div class="crumbs"><a href="#/">Home</a> › Privacy &amp; terms</div>
      <section class="plain reading">
        <h1>Privacy &amp; terms</h1>
        <h2>Privacy</h2>
        <p>This site has no cookies, analytics, ads or sign-up forms, and it doesn't collect anything about you.</p>
        <p>It's hosted on GitHub Pages, which keeps standard server logs. The music players come from Spotify, the research board from Figma, and movie posters from Apple and Wikipedia; each of those follows its own privacy policy when it loads.</p>
        <p>If you email me, I'll only use your address to reply.</p>
        <h2>Terms</h2>
        <p>All projects, images and text here are my own work unless credited. Please ask before reusing them, and credit me if you share them.</p>
      </section>`;
  }
  const notFound = () => `<section class="plain"><h1>Page not found</h1><p><a href="#/">Go to the home page</a></p></section>`;

  // ---------- router ----------
  function route() {
    const [path, qs = ""] = location.hash.replace(/^#\/?/, "").split("?");
    const parts = path.split("/").filter(Boolean), params = new URLSearchParams(qs);
    if (!parts.length) return { name: "home", html: home() };
    if (parts[0] === "work" && parts[1]) return { name: "work", html: project(parts[1]) };
    if (parts[0] === "work") return { name: "work", html: work(params), params };
    if (parts[0] === "now" && parts[1]) return { name: "", html: ongoing(parts[1]) };
    if (parts[0] === "about") return { name: "about", html: about() };
    if (parts[0] === "privacy") return { name: "", html: privacy() };
    return { name: "", html: notFound() };
  }
  const q = document.getElementById("q"), cat = document.getElementById("cat");
  function render(top = true) {
    const r = route();
    view.innerHTML = r.html;
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const on = a.dataset.nav === r.name;
      a.classList.toggle("is-active", on);
      on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
    });
    q.value = r.params ? r.params.get("q") || "" : "";
    cat.value = r.params ? r.params.get("cat") || "" : "";
    const h = view.querySelector("h1");
    document.title = r.name === "home" || !h ? `${S.name}, Industrial Design Portfolio` : `${h.textContent} - ${S.name}`;
    if (top) { window.scrollTo(0, 0); view.focus({ preventScroll: true }); }
  }
  addEventListener("hashchange", () => render());

  // ---------- search bar ----------
  q.placeholder = "Search projects";
  cat.innerHTML = `<option value="">All types</option>` + cats.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
  const form = document.getElementById("search");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.value.trim()) p.set("q", q.value.trim());
    if (cat.value) p.set("cat", cat.value);
    location.hash = `#/work${p.toString() ? `?${p}` : ""}`;
  });
  cat.addEventListener("change", () => form.requestSubmit());

  // ---------- header + footer ----------
  document.getElementById("mail").href = `mailto:${S.email}`;
  document.getElementById("util").innerHTML = contacts().map(([k, v]) => `<a href="${esc(v)}"${ext(v)}>${esc(k)}</a>`).join(" | ");
  document.getElementById("copy").textContent = `© ${new Date().getFullYear()} ${S.name}. All work shown is my own unless credited.`;

  // "Get in touch" turns into the email address on hover (kept from the live site)
  const cta = document.getElementById("cta"), scr = document.getElementById("scramble");
  cta.href = `mailto:${S.email}`;
  const FROM = "Get in touch", TO = S.email, GLYPHS = "!<>-_\\/[]{}=+*^?#@%&$";
  let target = FROM, sraf = 0;
  function scrambleTo(t) {
    if (t === target) return;
    target = t; cancelAnimationFrame(sraf);
    if (reduce) { scr.textContent = t; return; }
    const from = scr.textContent, len = Math.max(from.length, t.length);
    const qd = Array.from({ length: len }, (_, i) => { const s = Math.floor(Math.random() * 8); return { a: from[i] || "", b: t[i] || "", s, e: s + 6 + Math.floor(Math.random() * 10) + i }; });
    let f = 0;
    const step = () => {
      let done = 0, html = "";
      for (const c of qd) {
        if (f >= c.e) { done++; html += esc(c.b); }
        else if (f >= c.s) html += `<span class="x">${esc(GLYPHS[Math.floor(Math.random() * GLYPHS.length)])}</span>`;
        else html += esc(c.a);
      }
      scr.innerHTML = html;
      if (done < qd.length) { f++; sraf = requestAnimationFrame(step); }
    };
    step();
  }
  cta.addEventListener("pointerenter", () => scrambleTo(TO));
  cta.addEventListener("pointerleave", () => scrambleTo(FROM));
  cta.addEventListener("focus", () => scrambleTo(TO));
  cta.addEventListener("blur", () => scrambleTo(FROM));

  render(false);
})();
