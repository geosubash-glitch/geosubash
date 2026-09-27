// Shelf editor. The "passkey" is a GitHub fine-grained personal access token
// limited to this repository (Contents: read & write). It is kept in this
// browser's localStorage only and sent nowhere but api.github.com.
//
// Saving makes a single commit to main containing any new images
// (assets/shelf/…) and the updated data/shelf.json; GitHub Pages then
// republishes the site.
(() => {
  const OWNER = "geosubash-glitch", REPO = "geosubash", BRANCH = "main";
  const DATA = "data/shelf.json", IMG_DIR = "assets/shelf";
  const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
  const KEY_STORE = "shelf-passkey";
  const $ = (id) => document.getElementById(id);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let token = "";
  let shelf = { music: [], books: [], photos: [] };
  let original = "";          // JSON as loaded, to detect changes
  const pending = new Map();  // new image path -> base64 data, not yet committed
  const previews = new Map(); // new image path -> object URL for display

  const store = {
    get() { try { return localStorage.getItem(KEY_STORE) || ""; } catch { return ""; } },
    set(v) { try { localStorage.setItem(KEY_STORE, v); } catch {} },
    clear() { try { localStorage.removeItem(KEY_STORE); } catch {} },
  };

  async function gh(path, opts = {}) {
    const res = await fetch(path.startsWith("http") ? path : `${API}${path}`, {
      ...opts,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
      },
    });
    if (!res.ok) {
      let msg = `${res.status}`;
      try { msg += ` ${(await res.json()).message}`; } catch {}
      throw new Error(msg);
    }
    return res.status === 204 ? null : res.json();
  }

  const status = (id, text, bad = false) => { const el = $(id); el.textContent = text; el.classList.toggle("bad", bad); };

  // ---------- unlock ----------
  async function unlock(t) {
    token = t.trim();
    if (!token) return;
    status("key-status", "Checking…");
    try {
      const repo = await gh("");
      if (!repo.permissions || !repo.permissions.push) throw new Error("This passkey can read but not write to the repo.");
      store.set(token);
      $("forget").hidden = false;
      await load();
      status("key-status", "Unlocked.");
      $("editor").hidden = false;
    } catch (e) {
      token = "";
      status("key-status", `Couldn't unlock: ${e.message}`, true);
    }
  }

  async function load() {
    try {
      const file = await gh(`/contents/${DATA}?ref=${BRANCH}`);
      const text = decodeURIComponent(escape(atob(file.content.replace(/\n/g, ""))));
      const d = JSON.parse(text);
      shelf = { music: d.music || [], books: d.books || [], photos: d.photos || [] };
    } catch (e) {
      if (!String(e.message).startsWith("404")) throw e;
      shelf = { music: [], books: [], photos: [] };
    }
    original = JSON.stringify(shelf);
    draw();
  }

  // ---------- list rendering ----------
  const src = (p) => (p ? previews.get(p) || `${p}?v=${Date.now()}` : "");
  function draw() {
    for (const kind of ["music", "books", "photos"]) {
      $(`list-${kind}`).innerHTML = shelf[kind].map((it, i) => {
        const img = kind === "photos" ? it.src : it.cover;
        const title = kind === "photos" ? (it.caption || "Untitled photo") : it.title;
        const sub = kind === "music" ? it.artist : kind === "books" ? it.author : "";
        return `<li>
          ${img ? `<img src="${esc(src(img))}" alt="" />` : `<span class="noimg"></span>`}
          <span class="t"><b>${esc(title)}</b>${sub ? `<span class="soft">${esc(sub)}</span>` : ""}</span>
          <span class="acts">
            <button data-kind="${kind}" data-i="${i}" data-act="up" ${i ? "" : "disabled"} aria-label="Move up">↑</button>
            <button data-kind="${kind}" data-i="${i}" data-act="down" ${i < shelf[kind].length - 1 ? "" : "disabled"} aria-label="Move down">↓</button>
            <button data-kind="${kind}" data-i="${i}" data-act="del" aria-label="Remove">Remove</button>
          </span>
        </li>`;
      }).join("") || `<li class="empty soft">Nothing here yet.</li>`;
    }
    const dirty = JSON.stringify(shelf) !== original;
    $("save").disabled = !dirty;
    if (dirty) status("save-status", "Unsaved changes.");
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const list = shelf[b.dataset.kind], i = +b.dataset.i;
    if (b.dataset.act === "del") list.splice(i, 1);
    if (b.dataset.act === "up" && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
    if (b.dataset.act === "down" && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
    draw();
  });

  // ---------- adding ----------
  // Shrink images in the browser before upload: covers to 600px, photos to 1600px.
  async function shrink(file, max) {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.85));
    const b64 = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result.split(",")[1]); fr.readAsDataURL(blob); });
    return { b64, url: URL.createObjectURL(blob) };
  }
  const slug = (s) => String(s || "img").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "img";

  document.querySelectorAll(".admin-add").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const kind = form.dataset.kind, f = new FormData(form), file = f.get("image");
      let path = "";
      if (file && file.size) {
        const btn = form.querySelector("button"); btn.disabled = true; btn.textContent = "Preparing image…";
        try {
          const { b64, url } = await shrink(file, kind === "photos" ? 1600 : 600);
          path = `${IMG_DIR}/${kind}-${Date.now()}-${slug(f.get("title") || f.get("caption") || file.name)}.jpg`;
          pending.set(path, b64); previews.set(path, url);
        } finally { btn.disabled = false; btn.textContent = { music: "Add song", books: "Add book", photos: "Add photo" }[kind]; }
      }
      const clean = (v) => String(v || "").trim();
      if (kind === "music") shelf.music.push({ title: clean(f.get("title")), artist: clean(f.get("artist")), link: clean(f.get("link")), cover: path });
      if (kind === "books") shelf.books.push({ title: clean(f.get("title")), author: clean(f.get("author")), link: clean(f.get("link")), cover: path });
      if (kind === "photos") shelf.photos.push({ src: path, caption: clean(f.get("caption")) });
      form.reset();
      draw();
    });
  });

  // ---------- saving: one commit with images + shelf.json ----------
  async function save() {
    $("save").disabled = true;
    status("save-status", "Saving…");
    try {
      const used = new Set([...shelf.music.map((m) => m.cover), ...shelf.books.map((b) => b.cover), ...shelf.photos.map((p) => p.src)].filter(Boolean));
      const before = JSON.parse(original);
      const had = new Set([...before.music.map((m) => m.cover), ...before.books.map((b) => b.cover), ...before.photos.map((p) => p.src)]
        .filter((p) => p && p.startsWith(`${IMG_DIR}/`)));

      const ref = await gh(`/git/ref/heads/${BRANCH}`);
      const head = await gh(`/git/commits/${ref.object.sha}`);
      const tree = [];
      for (const [path, b64] of pending) {
        if (!used.has(path)) continue;                     // added then removed before saving
        const blob = await gh("/git/blobs", { method: "POST", body: JSON.stringify({ content: b64, encoding: "base64" }) });
        tree.push({ path, mode: "100644", type: "blob", sha: blob.sha });
      }
      for (const path of had) if (!used.has(path)) tree.push({ path, mode: "100644", type: "blob", sha: null }); // delete removed images
      tree.push({ path: DATA, mode: "100644", type: "blob", content: JSON.stringify(shelf, null, 2) + "\n" });

      const newTree = await gh("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: head.tree.sha, tree }) });
      const commit = await gh("/git/commits", { method: "POST", body: JSON.stringify({ message: "Update shelf from the site editor", tree: newTree.sha, parents: [head.sha] }) });
      await gh(`/git/refs/heads/${BRANCH}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });

      pending.clear();
      original = JSON.stringify(shelf);
      draw();
      status("save-status", "Saved. The site will show it in about a minute.");
    } catch (e) {
      status("save-status", `Save failed: ${e.message}`, true);
      $("save").disabled = false;
    }
  }

  $("save").addEventListener("click", save);
  $("unlock").addEventListener("click", () => unlock($("key").value));
  $("key").addEventListener("keydown", (e) => { if (e.key === "Enter") unlock($("key").value); });
  $("forget").addEventListener("click", () => { store.clear(); location.reload(); });
  window.addEventListener("beforeunload", (e) => { if (!$("save").disabled) { e.preventDefault(); e.returnValue = ""; } });

  const saved = store.get();
  if (saved) { $("key").value = saved; unlock(saved); }
})();
