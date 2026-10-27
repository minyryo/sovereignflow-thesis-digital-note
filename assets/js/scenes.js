/* ============================================================
   Two explanatory scenes that open over the mindmap.

     "title"   the full thesis title, segmented into its phrases,
               re-annotated by each decomposition criterion.
     "axes3d"  the three axes as an actual 3-D space - drag to rotate.

   No dependencies; the 3-D is a hand-rolled yaw/pitch rotation with a
   weak perspective projection.
   ============================================================ */

window.Scenes = (function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const $ = s => document.querySelector(s);

  /* =====================================================================
     SCENE 1 - title breakdown
     ===================================================================== */

  // The title in reading order. `p` is the phrase number from the
  // topic-decomposition diagram; null = connective text.
  const TITLE = [
    { t: "Research and development of a", p: null },
    { t: "cross-border", p: 2 },
    { t: "personal data", p: 21 },
    { t: "flow monitoring", p: 2 },
    { t: "and enforcement system", p: 3 },
    { t: "for AI", p: 1 },
    { t: "- in Vietnam", p: 4 }
  ];

  const PHRASES = {
    1:  { name: "for AI", color: "var(--accent)" },
    2:  { name: "cross-border … flow monitoring", color: "var(--teal)" },
    21: { name: "personal data (legal meaning)", color: "var(--plum)" },
    3:  { name: "and enforcement system", color: "var(--slate)" },
    4:  { name: "in Vietnam", color: "var(--warn)" }
  };

  const LENSES = {
    completeness: {
      label: "Completeness",
      badge: "C-1",
      claim: "Every phrase has at least one component under it, and every component traces " +
             "back to at least one phrase. No orphans in either direction.",
      verdict: "Holds - no empty cell in Axis A.",
      rows: [
        { p: 1,  note: "ViPII-Flow dataset · safeguard model", n: 2 },
        { p: 21, note: "PII classification (basic vs sensitive)", n: 1 },
        { p: 2,  note: "PII detection · jurisdiction-labelled flow graph", n: 2 },
        { p: 3,  note: "in-path gateway · anonymisation · leakage trace", n: 3 },
        { p: 4,  note: "Vietnamese language + statutory identifiers - scopes everything above", n: 1 }
      ],
      foot: "This is our own stated criterion, demonstrated by the table having no gaps. " +
            "It is not borrowed from a project-management standard."
    },

    orthogonality: {
      label: "Orthogonality",
      badge: "C-2",
      claim: "No two components answer the same question. The operational test: if two gaps " +
             "share a refutation condition, the components behind them overlap.",
      verdict: "Held only after a fix - G1 was doing double duty.",
      rows: [
        { p: 1,  note: "G1b - benchmarks target files, not prompts / RAG / tool calls", flag: "was G1" },
        { p: 4,  note: "G1a - no Vietnamese statutory identifier coverage", flag: "was G1" },
        { p: 21, note: "G2 - no classification against a named statute" },
        { p: 2,  note: "G3 - lineage ignores jurisdiction" },
        { p: 3,  note: "G4 - protection/utility trade-off unquantified" }
      ],
      foot: "G1 was attached to both “for AI” and “in Vietnam”. An English-language prompt-PII " +
            "benchmark would kill one half and leave the other standing - so they are two " +
            "claims, not one. Splitting them into G1a and G1b is what made this criterion pass."
    },

    boundary: {
      label: "Component boundaries",
      badge: "C-3",
      claim: "Put the interface where the thing most likely to change sits, so change stays " +
             "behind one boundary (Parnas, information hiding).",
      verdict: "Decides the open gateway-placement question.",
      rows: [
        { p: 3,  note: "The gateway is a boundary question, not a deployment question", flag: "cut here" },
        { p: 2,  note: "The jurisdiction decision is the volatile part - the law changes" },
        { p: 21, note: "Statutory categories are versioned, so the taxonomy sits behind the boundary too" },
        { p: 1,  note: "The AI pipeline itself is comparatively stable" }
      ],
      foot: "So the boundary belongs at the jurisdiction decision: the law changes, the pipeline " +
            "does not. That is a decomposition argument with a citation - the answer to bring " +
            "to the next supervisor meeting."
    },

    scope: {
      label: "Feasibility & scope",
      badge: "C-4",
      claim: "What this thesis actually commits to delivering, under the A1 decision of " +
             "23/09/2026. Researcher judgement - labelled as judgement, not dressed up as a " +
             "formal criterion.",
      verdict: "Three tiers, and the proposal must say which is which.",
      rows: [
        { p: 1,  note: "Dataset + fine-tuned model - the contribution claim", tier: "critical" },
        { p: 21, note: "Taxonomy + annotation handbook - the contribution claim", tier: "critical" },
        { p: 2,  note: "Flow graph + simulation - measured, but engineering support", tier: "support" },
        { p: 3,  note: "Gateway, anonymisation, dossier - Phase 2, conditional on A3", tier: "open" },
        { p: 4,  note: "Scopes all of the above; not separately deliverable", tier: "scope" }
      ],
      foot: "Claiming G3 and G4 while executing A1 is the most attackable thing in the current " +
            "material. “We close these, we document those as open” is the stronger position."
    }
  };

  function titleHTML(activeLens) {
    const lens = LENSES[activeLens];
    const used = new Set(lens.rows.map(r => r.p));

    const title = TITLE.map(seg => {
      if (seg.p === null) return '<span class="ttl__plain">' + seg.t + "</span>";
      const on = used.has(seg.p);
      return '<span class="ttl__seg' + (on ? " is-on" : "") + '" data-p="' + seg.p +
             '" style="--pc:' + PHRASES[seg.p].color + '">' + seg.t + "</span>";
    }).join(" ");

    const rows = lens.rows.map(r => {
      const ph = PHRASES[r.p];
      const chips = [];
      if (r.n)    chips.push('<span class="brk__n">' + r.n + " component" + (r.n > 1 ? "s" : "") + "</span>");
      if (r.flag) chips.push('<span class="brk__flag">' + r.flag + "</span>");
      if (r.tier) chips.push('<span class="brk__tier brk__tier--' + r.tier + '">' + r.tier + "</span>");
      return '<li class="brk__row" style="--pc:' + ph.color + '">' +
               '<span class="brk__phrase">' + ph.name + "</span>" +
               '<span class="brk__note">' + r.note + "</span>" +
               (chips.length ? '<span class="brk__chips">' + chips.join("") + "</span>" : "") +
             "</li>";
    }).join("");

    return '' +
      '<p class="ttl__kicker">The full title, decomposed</p>' +
      '<p class="ttl">' + title + "</p>" +
      '<div class="brk">' +
        '<div class="brk__head">' +
          '<span class="pnl__badge">' + lens.badge + "</span>" +
          "<h3>" + lens.label + "</h3>" +
        "</div>" +
        '<p class="brk__claim">' + lens.claim + "</p>" +
        '<p class="brk__verdict">' + lens.verdict + "</p>" +
        '<ul class="brk__list">' + rows + "</ul>" +
        '<p class="brk__foot">' + lens.foot + "</p>" +
      "</div>";
  }

  function mountTitle(host) {
    const keys = Object.keys(LENSES);
    host.innerHTML =
      '<div class="scene__tabs" id="lensTabs">' +
        keys.map((k, i) =>
          '<button type="button" class="mode" data-lens="' + k + '"' +
          (i === 0 ? ' aria-current="true"' : "") + ">" + LENSES[k].label + "</button>"
        ).join("") +
      "</div>" +
      '<div class="scene__body" id="lensBody">' + titleHTML(keys[0]) + "</div>";

    host.querySelectorAll("[data-lens]").forEach(btn => {
      btn.addEventListener("click", () => {
        host.querySelectorAll("[data-lens]").forEach(b =>
          b.setAttribute("aria-current", b === btn ? "true" : "false"));
        $("#lensBody").innerHTML = titleHTML(btn.dataset.lens);
      });
    });
  }

  /* =====================================================================
     SCENE 2 - the three axes as a 3-D space
     ===================================================================== */

  const AX = {
    x: { key: "A", name: "Axis A - Scope", ticks: ["for AI", "personal data", "cross-border", "enforcement"] },
    y: { key: "B", name: "Axis B - Epistemic type", ticks: ["design problem", "knowledge question"] },
    z: { key: "C", name: "Axis C - Criticality", ticks: ["open / Phase 2", "support", "critical path"] }
  };

  // a: 1..4 along Axis A · b: design|knowledge · c: critical|support|open
  const POINTS = [
    { id: "O1", label: "Taxonomy + handbook",      a: 2, b: "design",    c: "critical" },
    { id: "O2", label: "ViPII-Flow dataset",       a: 1, b: "design",    c: "critical" },
    { id: "O3", label: "3-tier detector",          a: 1, b: "design",    c: "critical" },
    { id: "RQ1.1", label: "Detector vs baselines", a: 1, b: "knowledge", c: "critical" },
    { id: "RQ1.2", label: "Basic/sensitive + κ",   a: 2, b: "knowledge", c: "critical" },
    { id: "O4", label: "Flow-graph reconstruction", a: 3, b: "design",   c: "support" },
    { id: "O5", label: "Simulation scenarios",     a: 3, b: "design",    c: "support" },
    { id: "RQ1.3", label: "Graph coverage/accuracy", a: 3, b: "knowledge", c: "support" },
    { id: "GW", label: "In-path gateway",           a: 4, b: "design",    c: "open" },
    { id: "RQ2.x", label: "Utility loss · latency", a: 4, b: "knowledge", c: "open" }
  ];

  const BX = { design: -1, knowledge: 1 };
  const CZ = { open: -1, support: 0, critical: 1 };

  function coord(p) {
    return {
      x: (p.a - 2.5) / 1.5,          // −1 … 1
      y: BX[p.b],
      z: CZ[p.c]
    };
  }

  function rotate(p, yaw, pitch) {
    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const x1 = p.x * cy + p.z * sy;
    const z1 = -p.x * sy + p.z * cy;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    return { x: x1, y: p.y * cp - z1 * sp, z: p.y * sp + z1 * cp };
  }

  function Axes3D(svg, caption) {
    this.svg = svg;
    this.caption = caption;
    this.yaw = -0.62;
    this.pitch = 0.42;
    this.W = 640; this.H = 460;
    this.S = 118;              // world unit -> px
    this.D = 5.2;              // camera distance for perspective
    this.sel = null;
    this._bind();
  }

  Axes3D.prototype.project = function (p) {
    const r = rotate(p, this.yaw, this.pitch);
    const k = this.D / (this.D - r.z);
    return { x: this.W / 2 + r.x * this.S * k, y: this.H / 2 - r.y * this.S * k, z: r.z, k };
  };

  Axes3D.prototype.render = function () {
    const svg = this.svg;
    svg.setAttribute("viewBox", "0 0 " + this.W + " " + this.H);
    svg.textContent = "";

    const g = (n, a) => {
      const e = document.createElementNS(SVG_NS, n);
      for (const k in a) e.setAttribute(k, a[k]);
      svg.appendChild(e);
      return e;
    };

    const L = 1.18;

    /* cube wireframe */
    const corners = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1])
      corners.push({ x: sx, y: sy, z: sz });
    const edges = [];
    corners.forEach((a, i) => corners.forEach((b, j) => {
      if (j <= i) return;
      const d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
      if (Math.abs(d - 2) < 1e-9) edges.push([a, b]);
    }));
    edges.forEach(([a, b]) => {
      const pa = this.project(a), pb = this.project(b);
      g("line", { class: "ax__cube", x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y });
    });

    /* axes + labels */
    const origin = this.project({ x: 0, y: 0, z: 0 });
    const spec = [
      { v: { x: L, y: 0, z: 0 }, ax: AX.x, cls: "ax--x" },
      { v: { x: 0, y: L, z: 0 }, ax: AX.y, cls: "ax--y" },
      { v: { x: 0, y: 0, z: L }, ax: AX.z, cls: "ax--z" }
    ];
    spec.forEach(s => {
      const p = this.project(s.v);
      g("line", { class: "ax__line " + s.cls, x1: origin.x, y1: origin.y, x2: p.x, y2: p.y });
      const t = g("text", {
        class: "ax__label " + s.cls, x: p.x, y: p.y,
        dx: p.x >= this.W / 2 ? 8 : -8,
        dy: p.y <= this.H / 2 ? -6 : 14,
        "text-anchor": p.x >= this.W / 2 ? "start" : "end"
      });
      t.textContent = s.ax.name;
    });

    /* tick labels along each axis */
    AX.x.ticks.forEach((label, i) => {
      const xv = (i + 1 - 2.5) / 1.5;
      const p = this.project({ x: xv, y: -1.06, z: -1.06 });
      const t = g("text", { class: "ax__tick", x: p.x, y: p.y, "text-anchor": "middle" });
      t.textContent = label;
    });
    AX.y.ticks.forEach((label, i) => {
      const p = this.project({ x: -1.08, y: i === 0 ? -1 : 1, z: -1.08 });
      const t = g("text", { class: "ax__tick", x: p.x, y: p.y, "text-anchor": "end" });
      t.textContent = label;
    });
    AX.z.ticks.forEach((label, i) => {
      const p = this.project({ x: 1.1, y: -1.08, z: i - 1 });
      const t = g("text", { class: "ax__tick", x: p.x, y: p.y, "text-anchor": "start" });
      t.textContent = label;
    });

    /* points, far to near */
    const pts = POINTS.map(p => {
      const c = coord(p);
      const pr = this.project(c);
      return { data: p, c, pr };
    }).sort((a, b) => a.pr.z - b.pr.z);

    pts.forEach(p => {
      // drop line to the floor, so height reads
      const floor = this.project({ x: p.c.x, y: -1, z: p.c.z });
      g("line", { class: "ax__drop", x1: p.pr.x, y1: p.pr.y, x2: floor.x, y2: floor.y });

      const grp = document.createElementNS(SVG_NS, "g");
      grp.setAttribute("class", "ax__pt ax__pt--" + p.data.b +
        (this.sel === p.data.id ? " is-sel" : ""));
      grp.setAttribute("tabindex", "0");
      grp.setAttribute("role", "button");
      grp.setAttribute("aria-label", p.data.id + " - " + p.data.label);
      svg.appendChild(grp);

      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx", p.pr.x); c.setAttribute("cy", p.pr.y);
      c.setAttribute("r", 7.5 * p.pr.k);
      c.setAttribute("class", "ax__dot");
      grp.appendChild(c);

      const t = document.createElementNS(SVG_NS, "text");
      t.setAttribute("x", p.pr.x + 11 * p.pr.k);
      t.setAttribute("y", p.pr.y + 4);
      t.setAttribute("class", "ax__id");
      t.textContent = p.data.id;
      grp.appendChild(t);

      const pick = () => {
        this.sel = p.data.id;
        this.caption.innerHTML =
          '<strong>' + p.data.id + "</strong> " + p.data.label +
          '<span class="ax__coords">' +
            "A: " + AX.x.ticks[p.data.a - 1] + " · " +
            "B: " + p.data.b + " · " +
            "C: " + p.data.c +
          "</span>";
        this.render();
      };
      grp.addEventListener("mouseenter", pick);
      grp.addEventListener("focus", pick);
      grp.addEventListener("click", pick);
    });
  };

  Axes3D.prototype._bind = function () {
    const self = this;
    let drag = false, last = null;

    this.svg.addEventListener("pointerdown", e => {
      drag = true; last = { x: e.clientX, y: e.clientY };
      self.svg.classList.add("dragging");
      if (self.svg.setPointerCapture) self.svg.setPointerCapture(e.pointerId);
    });
    this.svg.addEventListener("pointermove", e => {
      if (!drag) return;
      self.yaw += (e.clientX - last.x) * 0.008;
      self.pitch = Math.max(-1.2, Math.min(1.2, self.pitch + (e.clientY - last.y) * 0.006));
      last = { x: e.clientX, y: e.clientY };
      self.render();
    });
    const stop = () => { drag = false; self.svg.classList.remove("dragging"); };
    this.svg.addEventListener("pointerup", stop);
    this.svg.addEventListener("pointerleave", stop);
    this.svg.addEventListener("pointercancel", stop);

    this.svg.addEventListener("keydown", e => {
      const step = 0.12;
      if (e.key === "ArrowLeft")  { self.yaw -= step; self.render(); e.preventDefault(); }
      if (e.key === "ArrowRight") { self.yaw += step; self.render(); e.preventDefault(); }
      if (e.key === "ArrowUp")    { self.pitch = Math.min(1.2, self.pitch + step); self.render(); e.preventDefault(); }
      if (e.key === "ArrowDown")  { self.pitch = Math.max(-1.2, self.pitch - step); self.render(); e.preventDefault(); }
    });
  };

  let axes = null;

  function mountAxes(host) {
    host.innerHTML =
      '<p class="scene__lead">One component set, placed by all three axes at once. ' +
      'Each point is a deliverable or a question: its <em>position</em> along A is which part ' +
      'of the title it serves, along B whether it is something built or something measured, ' +
      'along C how strongly the thesis claims it. Drag to rotate; arrow keys work too.</p>' +
      '<div class="ax"><svg id="axSvg" tabindex="0" role="img" ' +
      'aria-label="Three-axis scatter of deliverables and questions"></svg></div>' +
      '<p class="ax__caption" id="axCaption">Hover a point to read its coordinates.</p>' +
      '<p class="scene__foot">Why this matters: the title-phrase diagram is Axis A alone. ' +
      'A point\'s B coordinate decides which chapter it belongs in - built artefacts are ' +
      'objectives, measured claims are research questions. Its C coordinate decides whether ' +
      'the thesis claims to close the gap or documents it as open. ' +
      'Note that nothing sits at <em>knowledge × open</em> and is still claimed: that is the ' +
      'G3/G4 problem.</p>';

    axes = new Axes3D($("#axSvg"), $("#axCaption"));
    axes.render();
  }

  /* =====================================================================
     overlay plumbing
     ===================================================================== */

  const SCENES = {
    title:  { heading: "Title → decomposition criteria", mount: mountTitle },
    axes3d: { heading: "The three axes, in 3-D",        mount: mountAxes }
  };

  let lastFocus = null;

  function open(name) {
    const s = SCENES[name];
    if (!s) return;
    lastFocus = document.activeElement;
    $("#sceneTitle").textContent = s.heading;
    const host = $("#sceneHost");
    host.innerHTML = "";
    $("#scene").hidden = false;
    document.body.classList.add("scene-open");
    s.mount(host);
    $("#sceneClose").focus();
  }

  function close() {
    $("#scene").hidden = true;
    document.body.classList.remove("scene-open");
    axes = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function init() {
    $("#sceneClose").addEventListener("click", close);
    $("#sceneBackdrop").addEventListener("click", close);
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !$("#scene").hidden) { e.stopPropagation(); close(); }
    });
  }

  return { init, open, close, _test: { layoutPoints: () => POINTS.map(coord), Axes3D, LENSES, TITLE } };
})();
