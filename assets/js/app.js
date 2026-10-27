/* ============================================================
   Router, mode switcher, and the detail panel.
   Routes:  #/            home (title + timeline)
            #/map/<mode>  mindmap in that mode
   ============================================================ */

(function () {
  "use strict";

  const $ = s => document.querySelector(s);

  const viewHome = $("#view-home");
  const viewMap  = $("#view-map");
  const modesNav = $("#modes");
  const modeDesc = $("#modeDesc");
  const panelEmpty = $("#panelEmpty");
  const panelBody  = $("#panelBody");

  const DATA  = window.THESIS_MINDMAP || {};
  const REFS  = window.THESIS_REFS || {};
  const ORDER = (window.THESIS_MODE_ORDER || Object.keys(DATA)).filter(k => DATA[k]);

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------------- detail panel ---------------- */

  function renderRef(entry, override) {
    const r = REFS[entry.key];
    if (!r) {
      return '<div class="ref"><p class="ref__bib">Unknown reference key ' +
             '<code>' + esc(entry.key) + '</code> - add it to <code>data/refs.js</code>.</p></div>';
    }

    const ids = [];
    if (r.doi)  ids.push('<span class="ref__id">doi:' + esc(r.doi) + '</span>');
    if (r.isbn) ids.push('<span class="ref__id">isbn:' + esc(r.isbn) + '</span>');
    ids.push('<span class="ref__id">' + esc(entry.key) + '</span>');

    const quote = override && override.quote ? override.quote : r.quote;
    const page  = (override && override.page) || r.page;

    let quoteHtml;
    if (quote) {
      quoteHtml = '<blockquote class="ref__quote">“' + esc(quote) + '”</blockquote>';
    } else {
      quoteHtml = '<p class="ref__flag">Quote pending - nothing is quoted here that has not ' +
                  'been read and transcribed by hand. Add it in <code>data/refs.js</code>.</p>';
    }

    return '<div class="ref">' +
      '<p class="ref__bib">' + r.bib + '</p>' +
      '<p class="ref__ids">' + ids.join("") + '</p>' +
      quoteHtml +
      (page ? '<p class="ref__page">' + esc(page) + '</p>' : "") +
      (r.verify && r.verify.length
        ? '<p class="ref__flag">Unverified: ' + esc(r.verify.join(" · ")) + '</p>' : "") +
      (r.caution ? '<p class="ref__flag">' + esc(r.caution) + '</p>' : "") +
      (r.access ? '<p class="ref__access">' + esc(r.access) + '</p>' : "") +
      (r.file ? '<p class="ref__access ref__file">' + esc(r.file) + '</p>' : "") +
      '</div>';
  }

  function tagClass(tag) {
    const known = ["evidence", "method", "empirical", "new"];
    return known.indexOf(tag) >= 0 ? "tag tag--" + tag : "tag tag--new";
  }

  // Below 62rem the panel is a bottom sheet: it slides up only when a node is
  // pinned by tapping. Hover previews are meaningless on a touch screen and
  // would make the sheet flicker.
  const sheetMQ = window.matchMedia("(max-width: 62rem)");
  const panelEl = $("#panel");
  function setSheet(open) { panelEl.classList.toggle("is-open", !!open); }

  function showNode(node, pinned) {
    if (!node) {
      panelBody.hidden = true;
      panelEmpty.hidden = false;
      setSheet(false);
      return;
    }
    panelEmpty.hidden = true;
    panelBody.hidden = false;

    let html = "";
    if (node.badge) html += '<span class="pnl__badge">' + esc(node.badge) + '</span>';
    html += '<h2 class="pnl__title">' + esc(node.label) + '</h2>';

    if (node.scene) {
      html += '<button type="button" class="panel__scene" data-scene="' + esc(node.scene) + '">' +
              esc(node.sceneLabel || "Open the demo") + ' →</button>';
    }

    if (node.takeaway) {
      html += '<div class="pnl__sec">' +
                '<p class="pnl__lbl">My takeaway</p>' +
                '<p class="pnl__take">' + esc(node.takeaway) + '</p>' +
              '</div>';
    }

    if (node.fields && node.fields.length) {
      html += '<div class="pnl__sec"><dl class="kv">' +
        node.fields.map(f =>
          '<div class="kv__row">' +
            '<dt class="kv__k">' + esc(f.k) + '</dt>' +
            '<dd class="kv__v">' +
              (f.tag ? '<span class="' + tagClass(f.tag) + '">' + esc(f.tag) + '</span> ' : "") +
              esc(f.v) +
            '</dd>' +
          '</div>'
        ).join("") +
        '</dl></div>';
    }

    if (node.refs && node.refs.length) {
      html += '<div class="pnl__sec">' +
                '<p class="pnl__lbl">Reference' + (node.refs.length > 1 ? "s" : "") + '</p>' +
                node.refs.map(r => renderRef(r, r)).join("") +
              '</div>';
    }

    if (!pinned) {
      html += '<p class="pnl__hint">Click the node to pin this panel.</p>';
    }

    panelBody.innerHTML = html;
    panelBody.scrollTop = 0;
    setSheet(sheetMQ.matches && pinned);
  }

  /* ---------------- modes ---------------- */

  let map = null;
  let currentMode = null;

  function buildModeButtons() {
    modesNav.innerHTML = ORDER.map(key => {
      const m = DATA[key];
      return '<button type="button" class="mode" data-mode="' + esc(key) + '">' +
             esc(m.title) +
             (m.suggested ? '<span class="mode__sug" title="Suggested extra mode">★</span>' : "") +
             '</button>';
    }).join("");

    modesNav.querySelectorAll(".mode").forEach(btn => {
      btn.addEventListener("click", () => { location.hash = "#/map/" + btn.dataset.mode; });
    });
  }

  function setMode(key) {
    if (!DATA[key]) key = ORDER[0];
    currentMode = key;

    modesNav.querySelectorAll(".mode").forEach(b => {
      b.setAttribute("aria-current", b.dataset.mode === key ? "true" : "false");
    });

    const m = DATA[key];
    modeDesc.textContent = m.desc || "";
    showNode(null, false);

    if (!map) {
      map = new window.Mindmap.Map({
        svg:   $("#mapSvg"),
        links: $("#mapLinks"),
        nodes: $("#mapNodes"),
        onSelect: showNode
      });
    }
    map.render(m);
  }

  /* ---------------- routing ---------------- */

  function route() {
    const hash = location.hash || "#/";
    const m = hash.match(/^#\/map(?:\/([\w-]+))?/);

    if (m) {
      viewHome.hidden = true;
      viewMap.hidden = false;
      document.body.style.overflow = "hidden";
      setMode(m[1] || ORDER[0]);
    } else {
      viewMap.hidden = true;
      viewHome.hidden = false;
      document.body.style.overflow = "";
    }
  }

  /* ---------------- init ---------------- */

  window.Timeline.render($("#timelineList"));
  buildModeButtons();
  window.Scenes.init();

  // scene launchers: toolbar buttons, and the button inside the detail panel
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-scene]");
    if (btn) window.Scenes.open(btn.dataset.scene);
  });

  $("#panelClose").addEventListener("click", () => { if (map) map.unpin(); setSheet(false); });
  sheetMQ.addEventListener("change", () => setSheet(false));

  $("#zoomIn").addEventListener("click",  () => map && map.zoom(1.25));
  $("#zoomOut").addEventListener("click", () => map && map.zoom(1 / 1.25));
  $("#zoomFit").addEventListener("click", () => map && map.fit());

  window.addEventListener("hashchange", route);
  window.addEventListener("resize", () => { if (map && !viewMap.hidden) map.fit(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !viewMap.hidden) location.hash = "#/";
  });

  route();
})();
