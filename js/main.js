(() => {
  const S = window.SITE;
  const P = window.PROJECTS;
  const view = document.getElementById("view");

  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const no = (i) => `<span class="num">No. ${pad(i + 1)}</span>`;
  const paras = (t) => [].concat(t || []).filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join("");
  const NAMES = { linkedin: "LinkedIn", github: "GitHub", behance: "Behance", instagram: "Instagram" };
  const cap1 = (k) => NAMES[k] || k[0].toUpperCase() + k.slice(1);
  const linkList = (links) => Object.entries(links || {}).filter(([, v]) => v)
    .map(([k, v]) => `<a class="u" href="${esc(v)}" target="_blank" rel="noopener">${esc(cap1(k))}</a>`).join("");
  const img = (x, alt = "", eager = false, style = "") =>
    `<img src="${esc(x.src || x)}" ${x.w ? `width="${x.w}" height="${x.h}"` : ""} ${style ? `style="${style}"` : ""} alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} />`;
  const plate = (p, cls = "") =>
    `<div class="plate ${cls}">${p.cover ? img(p.cover, p.title) : `<span class="empty">Image to follow</span>`}</div>`;

  // ---------- catalogue ----------
  let filter = "All";
  function catalogue() {
    const tags = ["All", ...new Set(P.flatMap((p) => p.tags))];
    const count = (t) => (t === "All" ? P.length : P.filter((p) => p.tags.includes(t)).length);
    const list = P.map((p, i) => [p, i]).filter(([p]) => filter === "All" || p.tags.includes(filter));
    return `
      <section class="intro"><p>${esc(S.intro)}</p></section>
      <div class="filters" role="group" aria-label="Filter work">${tags.map((t) =>
        `<button data-filter="${esc(t)}" class="${t === filter ? "is-active" : ""}" aria-pressed="${t === filter}">${esc(t)}<sup class="num">${count(t)}</sup></button>`).join("")}
      </div>
      <section class="catalogue">${list.map(([p, i]) => `
        <a class="entry" href="#/work/${p.slug}">
          ${plate(p)}
          <div class="caption">
            <div class="no">${no(i)}</div>
            <div class="t">${esc(p.title)}</div>
            <div class="soft">${esc(p.category)}${p.year ? `, <span class="num">${esc(p.year)}</span>` : ""}</div>
          </div>
        </a>`).join("")}
      </section>`;
  }

  // ---------- object page ----------
  function object(slug) {
    const i = P.findIndex((p) => p.slug === slug);
    if (i < 0) return notFound();
    const p = P[i];
    const facts = [
      ["Year", p.year], ["Category", p.category], ["Team", p.team], ["Role", p.role],
      ["Guided by", p.guide], ["Duration", p.duration], ["Material", p.material], ["Tools", (p.tools || []).join(", ")],
    ].filter(([, v]) => v);
    const links = linkList(p.links);
    const prev = P[(i - 1 + P.length) % P.length], next = P[(i + 1) % P.length];

    return `
      <article class="object">
        <div class="object-text">
          <a href="#/" class="back">← Catalogue</a>
          <div class="soft">${no(i)}</div>
          <h1>${esc(p.title)}</h1>
          ${p.subtitle ? `<p class="sub">${esc(p.subtitle)}</p>` : ""}
          <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
          ${p.story ? "" : `<div class="prose">${paras(p.summary)}${links ? `<div class="links">${links}</div>` : ""}</div>`}
        </div>
        ${plate(p, "object-plate")}
      </article>
      ${p.story ? story(p, links) : ""}
      ${p.slides.length ? `
      <section class="study">
        <div class="study-head"><span>Case study</span><span>Scroll</span></div>
        <div class="slide-stack">${p.slides.map((s, k) => img(s, `${p.title} case study, part ${k + 1}`, k === 0)).join("")}</div>
      </section>` : ""}
      ${P.length > 1 ? `
      <nav class="pager" aria-label="More work">
        <a href="#/work/${prev.slug}"><span class="no">← ${no(P.indexOf(prev))}</span><span class="t">${esc(prev.title)}</span></a>
        <a href="#/work/${next.slug}"><span class="no">${no(P.indexOf(next))} →</span><span class="t">${esc(next.title)}</span></a>
      </nav>` : ""}`;
  }

  // A project told as alternating sections and images (see js/projects.js):
  //   { label, heading, text, list }                 text section
  //   { images: [i, j], caption }                    equal-height image row
  //   { label, heading, text, list, image, caption } image beside text
  // Image numbers index the project's uploaded gallery (0 = first).
  function story(p, links) {
    const g = (k) => p.gallery[k];
    const row = (xs) => `<div class="j-row">${xs.map((x) => img(x, "", false, `flex-grow:${(x.w / x.h).toFixed(4)}`)).join("")}</div>`;
    const spec = (rows) => rows ? `<dl class="spec">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : "";
    const body = (b) => `${b.heading ? `<h2 class="s-head">${esc(b.heading)}</h2>` : ""}${paras(b.text)}${spec(b.list)}`;
    const cap = (c) => c ? `<figcaption>${esc(c)}</figcaption>` : "";
    return `<div class="story">${p.story.map((b) => {
      if (b.images) return `<figure class="s-fig">${row(b.images.map(g).filter(Boolean))}${cap(b.caption)}</figure>`;
      if (b.image != null && g(b.image)) return `
        <section class="s-side">
          <figure>${img(g(b.image))}${cap(b.caption)}</figure>
          <div>${b.label ? `<div class="k">${esc(b.label)}</div>` : ""}${body(b)}</div>
        </section>`;
      return `<section class="s-text"><div class="k">${esc(b.label || "")}</div><div>${body(b)}</div></section>`;
    }).join("")}
    ${links ? `<section class="s-text"><div class="k">Links</div><div class="prose"><div class="links">${links}</div></div></section>` : ""}</div>`;
  }

  // ---------- about ----------
  function about() {
    return `
      <section class="about">
        <div><p class="lede">${esc(S.intro)}</p></div>
        <div>
          <h2>About</h2>
          <div class="prose">${paras(S.about)}</div>
          <h2>Toolkit</h2>
          <p>${S.skills.map(esc).join(", ")}.</p>
          ${(S.certifications || []).length ? `<h2>Certifications</h2>
          <ul class="plain">${S.certifications.map((c) =>
            `<li><a class="u" href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.title)}</a><span class="soft">${esc(c.issuer)}</span></li>`).join("")}</ul>` : ""}
          <h2>Contact</h2>
          <ul class="plain">
            <li><a class="u" href="mailto:${esc(S.email)}">${esc(S.email)}</a><span class="soft">Email</span></li>
            ${Object.entries(S.links).filter(([, v]) => v).map(([k, v]) =>
              `<li><a class="u" href="${esc(v)}" target="_blank" rel="noopener">${esc(v.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a><span class="soft">${esc(cap1(k))}</span></li>`).join("")}
          </ul>
        </div>
      </section>`;
  }

  function notFound() {
    return `<section class="intro"><p>Nothing catalogued here. <a class="u" href="#/">Back to the catalogue</a>.</p></section>`;
  }

  // ---------- router ----------
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (!parts.length || (parts[0] === "work" && !parts[1])) return { nav: "work", html: catalogue() };
    if (parts[0] === "work") return { nav: "", html: object(parts[1]) };
    if (parts[0] === "about") return { nav: "about", html: about() };
    return { nav: "", html: notFound() };
  }

  // images fade in as they arrive; ones already cached show at once
  function fadeImages() {
    view.querySelectorAll("img").forEach((el) => {
      if (el.complete && el.naturalWidth) return;
      el.classList.add("fade");
      const show = () => el.classList.add("in");
      el.addEventListener("load", show, { once: true });
      el.addEventListener("error", show, { once: true });
    });
  }

  function render(scroll = true) {
    const r = route();
    view.innerHTML = r.html;
    fadeImages();
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === r.nav));
    const h1 = view.querySelector("h1");
    document.title = h1 ? `${h1.textContent} — ${S.name}` : `${S.name} — Industrial Design`;
    if (scroll) window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", () => render());
  view.addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    filter = b.dataset.filter;
    render(false);
  });

  // ---------- header + footer ----------
  document.getElementById("nav-mail").href = `mailto:${S.email}`;
  if (S.resume) Object.assign(document.getElementById("nav-cv"), { href: S.resume, hidden: false, target: "_blank" });
  document.getElementById("foot-links").innerHTML =
    `<a href="mailto:${esc(S.email)}">${esc(S.email)}</a>` +
    Object.entries(S.links).filter(([, v]) => v).map(([k, v]) =>
      `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(cap1(k))}</a>`).join("");
  document.getElementById("foot-copy").textContent = `© ${new Date().getFullYear()} ${S.name}`;

  render();
})();
