(() => {
  const site = window.SITE;
  const projects = window.PROJECTS;
  const ongoing = window.ONGOING || [];
  const view = document.getElementById("view");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // where to centre each cover when it is cropped to a tall frame on the home strip
  const FOCUS = { anchor: 50, rebrush: 62, lapcare: 50, latent: 32, "audio-deck": 45, "creta-cmf": 70 };

  const main = projects.filter((p) => !p.other);
  const others = projects.filter((p) => p.other);

  // brand marks from Simple Icons (CC0)
  const ICONS = {
      "behance": "M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z",
      "linkedin": "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
      "instagram": "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
      "github": "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
  };

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
    const count = main.length;
    const tiles = main.map((p, i) => `
      <a class="tile" href="#/work/${p.slug}" data-slug="${p.slug}">
        <span class="label"><span class="n">${String(i + 1).padStart(2, "0")}</span><span>${esc(p.title)}</span></span>
        <span class="frame"><span class="pan">${image(p.cover, p.title, { lazy: false, w: 1600, h: 900, style: `object-position:${FOCUS[p.slug] ?? 50}% 50%` })}</span></span>
      </a>`);

    return {
      home: true,
      html: `
        <div class="strip" id="strip"><div class="track" id="track">${tiles.join("")}</div></div>
        <div class="home-foot">
          <a id="cta-home" href="mailto:${esc(site.email)}">Get in touch</a>
          <span><span id="pos">01</span><span class="of">/${String(count).padStart(2, "0")}</span></span>
        </div>`,
    };
  }

  function otherPage() {
    const items = [
      ...ongoing.map((o) => ({ href: `#/now/${o.slug}`, title: o.title, sub: o.subtitle, meta: o.status || "In progress", live: true })),
      ...others.map((p) => ({ href: `#/work/${p.slug}`, title: p.title, sub: p.subtitle, meta: [p.category, p.year].filter(Boolean).join(", "), cover: p.cover })),
    ];
    const cards = items.map((it, i) => `
      <a class="card" href="${it.href}">
        <span class="card-img">${it.cover ? image(it.cover, it.title, { w: 1600, h: 900 }) : `<span class="card-empty label">${it.live ? '<span class="dot" aria-hidden="true"></span>' : ""}${esc(it.meta)}</span>`}</span>
        <span class="label"><span class="n">${String(i + 1).padStart(2, "0")}</span>${esc(it.title)}</span>
        <span class="card-sub">${esc(it.sub)}</span>
      </a>`).join("");
    return {
      title: "Archive",
      html: `
        <section class="hero grid"><h1 class="title lines">Archive</h1></section>
        <section class="cards grid">${cards}</section>`,
    };
  }

  function projectPage(slug) {
    const i = projects.findIndex((p) => p.slug === slug);
    if (i < 0) return notFoundPage();
    const p = projects[i];
    const group = p.other ? others : main;
    const next = group[(group.indexOf(p) + 1) % group.length];
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
            <div>${lines(p.category, list(p.tags).filter((t) => t.toLowerCase() !== String(p.category).toLowerCase()).join(", "))}</div>
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

    return {
      title: "About",
      html: `
        <section class="hero grid">
          ${site.portrait ? `<figure class="portrait">${image(site.portrait, `Portrait of ${site.name}`, { lazy: false, w: 900, h: 1200 })}</figure>` : ""}
          <div class="about-text lines">${paragraphs(site.about)}</div>
          <h1 class="title lines">${esc(site.name)}</h1>
          <div class="meta label"><div>${lines(...site.location.split(/,\s*/))}</div><div>${lines(site.role, site.school)}</div></div>
        </section>
        <section class="rows grid">
          ${row("Toolkit", `<p>${site.skills.map(esc).join(", ")}</p>`)}
          ${row("Certificates", certs && `<ul>${certs}</ul>`)}
          ${row("Photos", photos && `<div class="photos">${photos}</div>`)}
          ${row("Watching", movies && `<div class="movies">${movies}</div>`)}
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
    else if (section === "work") page = { name: projects.find((p) => p.slug === slug)?.other ? "other" : "work", ...projectPage(slug) };
    else if (section === "now" && slug) page = { name: "other", ...ongoingPage(slug) };
    else if (section === "other") page = { name: "other", ...otherPage() };
    else if (section === "about") page = { name: "about", ...aboutPage() };
    else if (section === "privacy") page = { name: "", ...privacyPage() };
    else page = { name: "", ...notFoundPage() };
    return page;
  }

  function show(page, { animate = true, scroll = true, intro = false } = {}) {
    stopStrip();
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
    if (page.home) setUpStrip({ intro });
    wireScramble(document.getElementById("cta-home"));
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

  // ---- home strip: an endless loop moved by wheel, drag and swipe ----

  let stopStrip = () => {};

  function setUpStrip({ intro = false } = {}) {
    stopStrip();
    const strip = document.getElementById("strip");
    const track = document.getElementById("track");
    if (!strip || !track) return;

    // three copies so there is always something either side of the visible set
    const original = track.innerHTML;
    track.innerHTML = original + original + original;
    const tiles = [...track.children];
    const perSet = tiles.length / 3;
    tiles.forEach((t, i) => {
      if (i < perSet || i >= perSet * 2) { t.setAttribute("tabindex", "-1"); t.setAttribute("aria-hidden", "true"); }
    });

    // phones scroll the cards up and down, wider screens left and right
    let vertical = matchMedia("(max-width: 760px)").matches;
    const along = (el) => (vertical ? el.offsetTop : el.offsetLeft);
    const length = (el) => (vertical ? el.offsetHeight : el.offsetWidth);
    const setWidth = () => along(tiles[perSet]) - along(tiles[0]);
    const pos = document.getElementById("pos");
    let width = setWidth();
    // on phones start with the first card in the middle of the screen rather than under the header
    const lead = () => (vertical ? (innerHeight - length(tiles[0])) / 2 : 0);
    let target = -lead();
    let current = target;
    let ease = .085;
    let raf = 0;
    let shrink = 1;
    // resting the pointer on a card for a moment (or holding a finger on it) brings it forward
    // and sends the others back out of focus; any scrolling or dragging cancels it
    let hot = -1;
    let held = false, holdTimer = 0;
    let anchor = 0;            // the card the others close up around while sizes change
    let mouse = null;          // last mouse position over the strip
    let stillSince = performance.now();
    const DWELL = 700;
    const setHot = (i) => {
      if (i === hot) return;
      hot = i;
      if (i >= 0) anchor = i;
      tiles.forEach((x, k) => x.classList.toggle("hot", k === hot));
      strip.classList.toggle("focus", hot >= 0);
    };
    // each card's size and blur glide to their new values on a slow ease-in-out, like a focus pull,
    // starting from wherever they are so a change of mind mid-way stays smooth
    const PULL = 1700;
    const inOut = (k) => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
    const glide = (v) => ({ from: v, to: v, at: 0, now: v });
    const glideTo = (g, want, now, ms) => {
      if (want !== g.to) { g.from = g.now; g.to = want; g.at = now; }
      const k = Math.min(1, (now - g.at) / ms);
      g.now = g.from + (g.to - g.from) * inOut(k);
      return g.now;
    };
    const sizes = tiles.map(() => glide(1));
    const blurs = tiles.map(() => glide(0));

    const pans = tiles.map((t) => t.querySelector(".pan"));
    const frames = tiles.map((t) => t.querySelector(".frame"));
    const labels = tiles.map((t) => t.querySelector(".label"));

    const frame = () => {
      const delta = (target - current) * ease;
      current += delta;
      if (Math.abs(target - current) < .1) current = target;
      const x = ((current % width) + width) % width;
      const offset = -(x + width);
      // cards shrink a little when moving fast; pictures drift inside their frames
      shrink += ((reducedMotion ? 1 : 1 - Math.min(.14, Math.abs(delta) * .006)) - shrink) * .12;
      track.style.transform = vertical ? `translate3d(0,${offset}px,0)` : `translate3d(${offset}px,0,0)`;
      const now = performance.now();
      if (Math.abs(target - current) > 25 || (down && !held)) { stillSince = now; setHot(-1); }
      else if (mouse && now - stillSince > DWELL && hot < 0) {
        const t = document.elementFromPoint(mouse.x, mouse.y)?.closest(".tile");
        if (t) setHot(tiles.indexOf(t));
      }
      if (!document.body.classList.contains("is-intro")) {
        tiles.forEach((t, i) => glideTo(sizes[i], reducedMotion || hot < 0 ? 1 : i === hot ? 1.03 : .86, now, PULL));
        // slide the cards towards the one in focus so the gaps between them stay the same as they shrink
        const shifts = tiles.map(() => 0);
        const half = (k) => (length(tiles[k]) * sizes[k].now) / 2;
        for (let k = anchor + 1; k < tiles.length; k++) {
          const grew = half(k - 1) - length(tiles[k - 1]) / 2 + half(k) - length(tiles[k]) / 2;
          shifts[k] = shifts[k - 1] + grew;
        }
        for (let k = anchor - 1; k >= 0; k--) {
          const grew = half(k + 1) - length(tiles[k + 1]) / 2 + half(k) - length(tiles[k]) / 2;
          shifts[k] = shifts[k + 1] - grew;
        }
        tiles.forEach((t, i) => {
          // shallow depth of field: the further a card is from the one in focus, the softer it gets
          const away = hot < 0 || reducedMotion ? 0 : Math.abs(i - hot);
          const wantBlur = away ? Math.min(10, 3 + away * 3) : 0;
          const size = sizes[i].now;
          // the blur trails the size a little, the way a lens catches up
          const blur = glideTo(blurs[i], wantBlur, now, PULL + 400);
          const shift = shifts[i].toFixed(2);
          t.style.transform = `translate3d(${vertical ? `0,${shift}px` : `${shift}px,0`},0) scale(${(size * shrink).toFixed(4)})`;
          // and the cards sent back slowly dim, so the one in focus is the only one lit
          const dim = Math.min(1, blur / 6) * .55;
          frames[i].style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px) brightness(${(1 - dim).toFixed(3)})` : "";
          // the name sits a little in front of the picture, nearer the lens, so it goes less soft
          if (labels[i]) labels[i].style.filter = blur > .05 ? `blur(${(blur * .35).toFixed(2)}px)` : "";
        });
      }
      if (!reducedMotion) {
        const span = vertical ? innerHeight : innerWidth;
        tiles.forEach((t, i) => {
          const start = along(t) + offset;
          if (start > span + 50 || start + length(t) < -50) return;
          const drift = (((start + length(t) / 2) - span / 2) / span) * -60;
          pans[i].style.transform = `translate3d(${vertical ? `0,${drift}px` : `${drift}px,0`},0) scale(1.14)`;
        });
      }
      if (pos) {
        const step = width / perSet;
        const i = Math.round((x + lead()) / step) % perSet;
        pos.textContent = String(i + 1).padStart(2, "0");
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onWheel = (e) => {
      e.preventDefault();
      target += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    };
    const onKey = (e) => {
      const step = width / perSet;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") target += step;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") target -= step;
    };
    const onResize = () => { vertical = matchMedia("(max-width: 760px)").matches; width = setWidth(); };
    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("keydown", onKey);
    addEventListener("resize", onResize);

    // drag or swipe in either direction; up and left both move forward
    let down = false, moved = false, startX = 0, startY = 0, startTarget = 0, last = 0, velocity = 0;
    const travel = (e) => {
      const dx = e.clientX - startX, dy = e.clientY - startY;
      return Math.abs(dx) >= Math.abs(dy) ? dx : dy;
    };
    view.addEventListener("pointerdown", (e) => {
      if (!document.body.classList.contains("home")) return;
      down = true; moved = false; startX = e.clientX; startY = e.clientY; last = 0; startTarget = target; velocity = 0;
      // no cursor on touch screens, so holding a finger on a card brings it forward instead
      const tile = e.pointerType !== "mouse" && e.target.closest(".tile");
      if (tile) holdTimer = setTimeout(() => { if (down && !moved) { held = true; target = current; setHot(tiles.indexOf(tile)); } }, 450);
    });
    const onMove = (e) => {
      if (!down) return;
      const d = travel(e);
      if (Math.abs(d) > 6 && !held) { moved = true; clearTimeout(holdTimer); strip.classList.add("dragging"); }
      velocity = d - last; last = d;
      if (moved) target = startTarget - d * 1.4;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      clearTimeout(holdTimer);
      // letting go after a hold lets the card settle back without opening it
      if (held) { held = false; setHot(-1); moved = true; velocity = 0; }
      if (moved) target -= velocity * 12;
      strip.classList.remove("dragging");
    };
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);
    strip.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const t = document.elementFromPoint(e.clientX, e.clientY)?.closest(".tile");
      const i = t ? tiles.indexOf(t) : -1;
      mouse = { x: e.clientX, y: e.clientY };
      // moving onto a different card restarts the wait
      if (i !== hot) { setHot(-1); stillSince = performance.now(); }
    });
    strip.addEventListener("pointerleave", () => { mouse = null; setHot(-1); });
    strip.addEventListener("click", (e) => {
      if (moved) { e.preventDefault(); moved = false; return; }
      const tile = e.target.closest(".tile[data-slug]");
      if (tile && !reducedMotion) startFly(e, tile);
    });
    strip.addEventListener("dragstart", (e) => e.preventDefault());
    strip.addEventListener("contextmenu", (e) => { if (e.pointerType !== "mouse") e.preventDefault(); });

    stopStrip = () => {
      cancelAnimationFrame(raf);
      removeEventListener("wheel", onWheel);
      removeEventListener("keydown", onKey);
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
      stopStrip = () => {};
    };
  }

  // ---- the clicked cover grows into the project page's cover ----

  function startFly(e, tile) {
    const img = tile.querySelector("img");
    if (!img) return;
    e.preventDefault();
    const r = (tile.querySelector(".frame") || img).getBoundingClientRect();
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

  // ---- footer ----

  document.getElementById("links").innerHTML = Object.entries(site.links).filter(([, u]) => u)
    .map(([k, url]) => `<a href="${esc(url)}"${external(url)} aria-label="${esc(linkName(k))}" title="${esc(linkName(k))}">${ICONS[k] ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[k]}"/></svg>` : esc(linkName(k))}</a>`).join("");
  document.getElementById("copy").textContent = `© ${new Date().getFullYear()} ${site.name}`;

  // "Get in touch" scrambles into the email address on hover and focus
  const GLYPHS = "!<>-_\\/[]{}=+*^?#@%&$";

  function wireScramble(link) {
    if (!link || link.dataset.wired) return;
    link.dataset.wired = "1";
    const label = link.textContent;
    let shown = label;
    let frame = 0;
    link.href = `mailto:${site.email}`;

    const scrambleTo = (text) => {
      if (text === shown) return;
      shown = text;
      cancelAnimationFrame(frame);
      if (reducedMotion) { link.textContent = text; return; }
      const from = link.textContent;
      const chars = Array.from({ length: Math.max(from.length, text.length) }, (_, i) => {
        const start = Math.floor(Math.random() * 8);
        return { from: from[i] || "", to: text[i] || "", start, end: start + 6 + Math.floor(Math.random() * 10) + i };
      });
      let t = 0;
      const step = () => {
        let done = 0;
        link.innerHTML = chars.map((c) => {
          if (t >= c.end) { done++; return esc(c.to); }
          if (t >= c.start) return `<span class="x">${esc(GLYPHS[Math.floor(Math.random() * GLYPHS.length)])}</span>`;
          return esc(c.from);
        }).join("");
        if (done < chars.length) { t++; frame = requestAnimationFrame(step); }
      };
      step();
    };
    link.addEventListener("pointerenter", () => scrambleTo(site.email));
    link.addEventListener("pointerleave", () => scrambleTo(label));
    link.addEventListener("focus", () => scrambleTo(site.email));
    link.addEventListener("blur", () => scrambleTo(label));
  }

  wireScramble(document.getElementById("cta"));

  // first visit to the home page: the projects drop onto a pile in the middle one by one,
  // then deal out into the strip; the header and the rest of the text arrive last
  const first = route();
  if (first.home && !reducedMotion) {
    document.body.classList.add("is-intro", "is-white");
    show(first, { intro: true });
    // wait one frame so the strip has moved into its looping position before measuring
    requestAnimationFrame(() => requestAnimationFrame(introPile));
  } else {
    show(first);
  }

  function introPile() {
    const tiles = [...view.querySelectorAll(".tile")];
    const strip = document.getElementById("strip").getBoundingClientRect();
    const cx = innerWidth / 2, cy = strip.top + strip.height / 2;
    const onScreen = [];
    tiles.forEach((t, i) => {
      const r = t.getBoundingClientRect();
      const turn = ((i * 37) % 11) - 5;
      t.style.transition = "none";
      // each card waits above the window, then drops onto the pile
      const pile = `translate(${cx - (r.left + r.width / 2)}px, ${cy - (r.top + r.height / 2)}px) rotate(${turn}deg) scale(.46)`;
      t.dataset.pile = pile;
      t.style.transform = `translate(${cx - (r.left + r.width / 2)}px, ${-innerHeight}px) rotate(${turn * 3}deg) scale(.5)`;
      t.classList.add("stacked", "on-table");
      if (r.right > -40 && r.left < innerWidth + 40) onScreen.push(t);
    });
    const PILE = 260, DEAL = 1500;
    const imgs = onScreen.map((t) => t.querySelector("img")).filter(Boolean);
    Promise.race([
      Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))),
      new Promise((r) => setTimeout(r, 1500)),
    ]).then(() => {
      onScreen.forEach((t, k) => setTimeout(() => {
        t.style.transition = "transform .9s cubic-bezier(.2,.9,.25,1.02)";
        t.style.transform = t.dataset.pile;
      }, 200 + k * PILE));
      const dealAt = 200 + onScreen.length * PILE + 500;
      setTimeout(() => {
        document.body.classList.remove("is-white");
        tiles.forEach((t) => {
          const k = Math.max(0, onScreen.indexOf(t));
          t.style.transition = `transform ${DEAL}ms var(--ease), opacity .6s ease`;
          t.style.transitionDelay = `${k * 90}ms`;
          t.style.opacity = "1";
          t.style.transform = "";
          t.classList.remove("stacked");
        });
      }, dealAt);
      setTimeout(() => tiles.forEach((t) => t.classList.remove("on-table")), dealAt + DEAL - 200);
      setTimeout(() => document.body.classList.remove("is-intro"), dealAt + DEAL + 200);
      setTimeout(() => tiles.forEach((t) => { t.style.transition = ""; t.style.transitionDelay = ""; }), dealAt + DEAL + 1200);
    });
  }
})();
