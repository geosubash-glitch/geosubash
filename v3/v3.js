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
    const count = projects.length + ongoing.length;
    const num = (i) => String(i + 1).padStart(2, "0");

    const tiles = projects.map((p, i) => `
      <a class="tile" href="#/work/${p.slug}" data-slug="${p.slug}">
        <span class="label"><span class="n">${num(i)}</span><span>${esc(p.title)}</span></span>
        <span class="frame">${image(p.cover, p.title, { lazy: false, w: 1600, h: 900, style: `object-position:${FOCUS[p.slug] ?? 50}% 50%` })}</span>
      </a>`);

    const now = ongoing.map((o, i) => `
      <a class="tile now" href="#/now/${o.slug}">
        <span class="label"><span class="n">${num(projects.length + i)}</span><span>Now</span></span>
        <span class="frame">
          <span class="label"><span><span class="dot" aria-hidden="true"></span>${esc(o.status || "In progress")}</span></span>
          <span class="big">${esc(o.title)}<br>${esc(o.subtitle)}</span>
        </span>
      </a>`);

    return {
      home: true,
      html: `
        <div class="strip" id="strip"><div class="track" id="track">${[...tiles, ...now].join("")}</div></div>
        <div class="home-foot grid label">
          <span>${esc(site.role)}</span>
          <a id="cta-home" href="mailto:${esc(site.email)}">Get in touch</a>
          <span><span id="pos">01</span><span class="of">/${String(count).padStart(2, "0")}</span></span>
        </div>`,
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

    const setWidth = () => tiles[perSet].offsetLeft - tiles[0].offsetLeft;
    const pos = document.getElementById("pos");
    let width = setWidth();
    let target = 0;
    let current = intro && !reducedMotion ? -innerWidth * .9 : 0;
    let ease = intro ? .045 : .09;
    let raf = 0;

    const frame = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < .1) current = target;
      const x = ((current % width) + width) % width;
      track.style.transform = `translate3d(${-(x + width)}px,0,0)`;
      if (pos) {
        const step = width / perSet;
        const i = Math.round(x / step) % perSet;
        pos.textContent = String(i + 1).padStart(2, "0");
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    if (intro) setTimeout(() => (ease = .09), 1400);

    const onWheel = (e) => {
      e.preventDefault();
      target += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    };
    const onKey = (e) => {
      const step = width / perSet;
      if (e.key === "ArrowRight") target += step;
      if (e.key === "ArrowLeft") target -= step;
    };
    const onResize = () => { width = setWidth(); };
    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("keydown", onKey);
    addEventListener("resize", onResize);

    let down = false, moved = false, startX = 0, startTarget = 0, lastX = 0, velocity = 0;
    strip.addEventListener("pointerdown", (e) => {
      down = true; moved = false; startX = lastX = e.clientX; startTarget = target; velocity = 0;
    });
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) { moved = true; strip.classList.add("dragging"); }
      velocity = e.clientX - lastX; lastX = e.clientX;
      if (moved) target = startTarget - dx * 1.4;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (moved) target -= velocity * 12;
      strip.classList.remove("dragging");
    };
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);
    strip.addEventListener("click", (e) => {
      if (moved) { e.preventDefault(); moved = false; return; }
      const tile = e.target.closest(".tile[data-slug]");
      if (tile && !reducedMotion) startFly(e, tile);
    });
    strip.addEventListener("dragstart", (e) => e.preventDefault());

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

  // ---- header: local time ----

  const clock = document.getElementById("clock");
  const tick = () => {
    const [h, m] = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false })
      .format(new Date()).split(":");
    clock.textContent = `${h}:${m} IST`;
  };
  tick();
  setInterval(tick, 15000);

  // ---- footer ----

  document.getElementById("links").innerHTML = Object.entries(site.links).filter(([, u]) => u)
    .map(([k, url]) => `<a href="${esc(url)}"${external(url)}>${esc(linkName(k))}</a>`).join("");
  document.getElementById("copy").innerHTML = `© ${new Date().getFullYear()} ${esc(site.name)}<br><a href="#/privacy">Privacy &amp; terms</a>`;

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

  show(route());
})();
