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
    src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" />` : `<div class="ph">${esc(label)}</div>`;

  // ---------- views ----------
  function home() {
    const [first, ...rest] = S.name.toUpperCase().split(" ");
    const rows = P.map((p, i) => `
      <li class="index-row">
        <a href="#/work/${p.slug}" data-cover="${esc(p.cover)}">
          <span class="num">${pad(i + 1)}</span>
          <span class="title">${esc(p.title)}</span>
          <span class="label disc">${esc(p.category)}</span>
          <span class="label year">${esc(p.year || "—")}</span>
          <span class="arrow">→</span>
          <span class="mthumb">${media(p.cover, `${pad(i + 1)} — image soon`, p.title)}</span>
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
          <p class="hero-intro">${esc(S.intro)}</p>
        </div>
      </section>
      ${marquee(S.skills)}
      <section class="section">
        <div class="section-head"><p class="label">Selected work</p><p class="label">(${pad(P.length)})</p></div>
        <ul class="index-list">${rows}</ul>
      </section>`;
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
            <div class="card-media">${media(p.cover, `${pad(i + 1)} — image soon`, p.title)}<span class="tag">${esc(p.category)}</span></div>
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
      ["Role", p.role], ["Duration", p.duration], ["Tools", (p.tools || []).join(", ")],
    ].filter(([, v]) => v);
    const links = Object.entries(p.links || {}).filter(([, v]) => v);
    const gallery = (p.images || []).map((src, k) => `<img src="${esc(src)}" alt="${esc(p.title)} — ${k + 1}" loading="lazy" />`).join("");

    return `
      <section class="p-head">
        <a href="#/work" class="back">← All work</a>
        <h1 class="p-title">${esc(p.title)}</h1>
        ${p.subtitle ? `<p class="p-sub">${esc(p.subtitle)}</p>` : ""}
      </section>
      <dl class="titleblock">${specs.map(([k, v]) => `<div><dt class="label">${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      <div class="p-cover">${media(p.cover, "Cover image soon", p.title)}</div>
      <section class="p-body">
        <p class="label">Overview</p>
        <div class="copy">
          ${(Array.isArray(p.summary) ? p.summary : [p.summary]).filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("")}
          ${links.length ? `<div class="p-links">${links.map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(k)} ↗</a>`).join("")}</div>` : ""}
        </div>
      </section>
      <div class="gallery${gallery ? "" : " empty"}">${gallery || `<div class="ph">Process images coming soon</div>`}</div>
      ${P.length > 1 ? `<a class="next" href="#/work/${next.slug}"><span class="label">Next project →</span><span class="n-title">${esc(next.title)}</span></a>` : ""}`;
  }

  function about() {
    return `
      <section class="section">
        <div class="section-head" style="margin-bottom:clamp(32px,5vw,64px)"><p class="label">About</p><p class="label">${esc(S.school)}</p></div>
        <p class="about-lede">${esc(S.intro)}</p>
        <div class="about-grid">
          <p class="label">Approach</p>
          <div class="copy">${S.about.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
          <p class="label">Toolkit</p>
          <div class="skills">${S.skills.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
          ${S.resume ? `<p class="label">CV</p><div class="copy"><a href="${esc(S.resume)}" target="_blank" style="border-bottom:1px solid">Download résumé ↗</a></div>` : ""}
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
    return { name: "", html: notFound() };
  }

  function render(animate) {
    const route = parse();
    view.innerHTML = route.html;
    view.classList.remove("view-enter");
    if (animate) { void view.offsetWidth; view.classList.add("view-enter"); }
    document.querySelectorAll("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === route.name));
    const h1 = view.querySelector("h1");
    document.title = route.name === "home" || !h1 ? `${S.name} — Industrial Design` : `${h1.textContent} — ${S.name}`;
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
  document.getElementById("footer-links").innerHTML = [
    ["Email", `mailto:${S.email}`], ...Object.entries(S.links).filter(([, v]) => v),
  ].map(([k, v]) => `<a href="${esc(v)}" ${v.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(k)} ↗</a>`).join("");
  document.getElementById("footer-copy").textContent = `© ${new Date().getFullYear()} ${S.name}`;

  const clock = document.getElementById("clock");
  const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
  const tick = () => (clock.textContent = `IN ${fmt.format(new Date())} IST`);
  tick(); setInterval(tick, 20000);

  render(!reduceMotion);
})();
