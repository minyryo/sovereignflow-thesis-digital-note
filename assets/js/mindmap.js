/* ============================================================
   Mindmap: tidy two-sided tree laid out in SVG, with a detail panel.
   No dependencies.
   ============================================================ */

window.Mindmap = (function () {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";

  const COL   = 230;   // horizontal gap per depth level
  const ROW   = 46;    // vertical slot per leaf
  const PAD_X = 13;    // node padding
  const PAD_Y = 9;
  const LINE  = 17;    // label line height
  const MAXW  = 196;   // max label width before wrapping

  /* ---------- text measuring ---------- */

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  function measure(text, font) {
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  function wrap(text, font, maxw) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let cur = "";
    for (const w of words) {
      const next = cur ? cur + " " + w : w;
      if (measure(next, font) > maxw && cur) { lines.push(cur); cur = w; }
      else cur = next;
    }
    if (cur) lines.push(cur);
    return lines.length > 3 ? lines.slice(0, 3) : lines;   // hard cap
  }

  /* ---------- layout ---------- */

  function countLeaves(n) {
    if (!n.children || !n.children.length) return 1;
    return n.children.reduce((s, c) => s + countLeaves(c), 0);
  }

  function prepare(node, depth, side, branch, out) {
    const font = depth === 0 ? "600 15px " + FONT : "500 13px " + FONT;
    const lines = wrap(node.label, font, MAXW);
    const w = Math.max(...lines.map(l => measure(l, font))) + PAD_X * 2;
    const h = lines.length * LINE + PAD_Y * 2 + (node.badge ? 11 : 0);

    const item = {
      data: node, depth, side, branch, lines, font,
      w, h, x: 0, y: 0
    };
    out.push(item);
    item.kids = (node.children || []).map(
      c => prepare(c, depth + 1, side, depth === 0 ? out.branchSeq++ : branch, out)
    );
    return item;
  }

  const FONT = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  function place(item, cursor) {
    // leaf: take the next vertical slot; internal: centre on children
    if (!item.kids.length) {
      item.y = cursor.y;
      cursor.y += ROW;
      return item.y;
    }
    const ys = item.kids.map(k => place(k, cursor));
    item.y = (Math.min(...ys) + Math.max(...ys)) / 2;
    return item.y;
  }

  function layout(rootData) {
    const all = [];
    all.branchSeq = 0;

    // root
    const rootFont = "600 15px " + FONT;
    const rootLines = wrap(rootData.label, rootFont, MAXW);
    const root = {
      data: rootData, depth: 0, side: 0, branch: -1,
      lines: rootLines, font: rootFont,
      w: Math.max(...rootLines.map(l => measure(l, rootFont))) + PAD_X * 2.4,
      h: rootLines.length * LINE + PAD_Y * 2.4,
      x: 0, y: 0, kids: []
    };
    all.push(root);

    // split top-level branches across the two sides, balancing leaf counts
    const branches = rootData.children || [];
    const weights = branches.map(countLeaves);
    const total = weights.reduce((a, b) => a + b, 0);
    const sides = [[], []];
    let acc = 0;
    branches.forEach((b, i) => {
      const toRight = acc < total / 2;
      acc += weights[i];
      sides[toRight ? 0 : 1].push(b);
    });

    let seq = 0;
    [1, -1].forEach((dir, si) => {
      const cursor = { y: 0 };
      sides[si].forEach(b => {
        all.branchSeq = seq++;
        const item = prepare(b, 1, dir, all.branchSeq, all);
        root.kids.push(item);
        place(item, cursor);
      });
      // centre this side's stack on the root
      const mine = all.filter(n => n.side === dir);
      if (mine.length) {
        const ys = mine.map(n => n.y);
        const mid = (Math.min(...ys) + Math.max(...ys)) / 2;
        mine.forEach(n => { n.y -= mid; });
      }
    });

    // x by depth; `inX` faces the root, `outX` faces away
    all.forEach(n => {
      if (n.depth === 0) {
        n.x = -n.w / 2;
        n.inX = n.x; n.outX = n.x + n.w;
      } else {
        const base = n.side * (COL * n.depth);
        if (n.side > 0) { n.x = base; n.inX = n.x; n.outX = n.x + n.w; }
        else            { n.x = base - n.w; n.inX = n.x + n.w; n.outX = n.x; }
      }
    });

    const links = [];
    (function walk(p) {
      p.kids.forEach(k => {
        links.push({ p, k, branch: k.branch });
        walk(k);
      });
    })(root);

    return { nodes: all, links, root };
  }

  /* ---------- rendering ---------- */

  function el(name, attrs, parent) {
    const node = document.createElementNS(SVG_NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function linkPath(p, k) {
    const x1 = p.depth === 0 ? (k.side > 0 ? p.outX : p.inX) : p.outX;
    const y1 = p.y;
    const x2 = k.inX, y2 = k.y;
    const dx = (x2 - x1) * 0.5;
    return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
  }

  /* ---------- public ---------- */

  function Map(opts) {
    this.svg      = opts.svg;
    this.gLinks   = opts.links;
    this.gNodes   = opts.nodes;
    this.onSelect = opts.onSelect || function () {};
    this.view     = { x: 0, y: 0, w: 1000, h: 700 };
    this.base     = null;
    this.pinned   = null;
    this._bindPanZoom();

    // clicking empty canvas unpins - bound once, not per render
    const self = this;
    this.svg.addEventListener("click", function (e) {
      if (e.target.closest(".n")) return;
      if (self.pinned) { self.pinned = null; self._clear(); }
    });
  }

  Map.prototype.render = function (modeData) {
    const self = this;
    this.gLinks.textContent = "";
    this.gNodes.textContent = "";
    this.pinned = null;

    const { nodes, links } = layout(modeData.root);
    this.laid = { nodes, links };

    links.forEach(l => {
      const path = el("path", { class: "lk", d: linkPath(l.p, l.k) }, this.gLinks);
      l.el = path;
    });

    nodes.forEach(n => {
      const cls = ["n"];
      if (n.depth === 0) cls.push("n--root");
      else {
        cls.push("n--b" + (n.branch % 5));
        if (n.depth > 1) cls.push("n--leaf");
      }

      const g = el("g", {
        class: cls.join(" "),
        tabindex: "0",
        role: "button",
        "aria-label": n.data.label
      }, this.gNodes);

      el("rect", {
        class: "n__box",
        x: n.x, y: n.y - n.h / 2,
        width: n.w, height: n.h,
        rx: n.depth === 0 ? 12 : 8
      }, g);

      let ty = n.y - (n.lines.length - 1) * LINE / 2;
      if (n.data.badge) {
        el("text", {
          class: "n__badge",
          x: n.x + PAD_X, y: n.y - n.h / 2 + 14
        }, g).textContent = n.data.badge;
        ty += 7;   // push the label down to clear the badge line
      }
      n.lines.forEach((line, i) => {
        el("text", {
          class: "n__label",
          x: n.x + PAD_X,
          y: ty + i * LINE,
          "dominant-baseline": "middle"
        }, g).textContent = line;
      });

      n.el = g;

      g.addEventListener("mouseenter", () => { if (!self.pinned) self._show(n, false); });
      g.addEventListener("focus",      () => { if (!self.pinned) self._show(n, false); });
      g.addEventListener("mouseleave", () => { if (!self.pinned) self._clear(); });
      g.addEventListener("click", e => {
        e.stopPropagation();
        if (self.pinned === n) { self.pinned = null; self._clear(); }
        else { self.pinned = n; self._show(n, true); }
      });
      g.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); g.click(); }
        if (e.key === "Escape") { self.pinned = null; self._clear(); }
      });
    });

    this.fit();
  };

  Map.prototype._show = function (n, pinned) {
    this.laid.nodes.forEach(o => {
      o.el.classList.toggle("is-active", o === n);
      o.el.classList.toggle("is-dim", pinned && o !== n && o.branch !== n.branch && o.depth !== 0);
    });
    this.laid.links.forEach(l => {
      const hot = l.k === n || l.p === n;
      l.el.classList.toggle("is-hot", hot);
      l.el.classList.toggle("is-dim", pinned && !hot && l.branch !== n.branch);
    });
    this.onSelect(n.data, pinned);
  };

  Map.prototype.unpin = function () {
    this.pinned = null;
    this._clear();
  };

  Map.prototype._clear = function () {
    if (!this.laid) return;
    this.laid.nodes.forEach(o => o.el.classList.remove("is-active", "is-dim"));
    this.laid.links.forEach(l => l.el.classList.remove("is-hot", "is-dim"));
    this.onSelect(null, false);
  };

  Map.prototype.fit = function () {
    const ns = this.laid.nodes;
    const xs = ns.flatMap(n => [n.x, n.x + n.w]);
    const ys = ns.flatMap(n => [n.y - n.h / 2, n.y + n.h / 2]);
    const pad = 48;
    const x = Math.min(...xs) - pad, y = Math.min(...ys) - pad;
    const w = Math.max(...xs) - Math.min(...xs) + pad * 2;
    const h = Math.max(...ys) - Math.min(...ys) + pad * 2;
    this.base = { x, y, w, h };
    this.view = { x, y, w, h };

    // On a narrow screen, fitting the whole tree shrinks 13px labels to a
    // few pixels. Clamp to a legible scale and open at the root instead;
    // pinch and pan take it from there.
    const r = this.svg.getBoundingClientRect();
    if (r.width > 0) {
      const MIN = 0.8;                        // scale; 13px labels stay ~10px+
      if (r.width / w < MIN) {
        const vw = r.width / MIN;
        const vh = vw * (h / w);
        this.view = { x: -vw / 2, y: -vh / 2, w: vw, h: vh };   // root sits at 0,0
      }
    }
    this._apply();
  };

  Map.prototype.zoom = function (factor, cx, cy) {
    const v = this.view;
    const px = cx === undefined ? v.x + v.w / 2 : cx;
    const py = cy === undefined ? v.y + v.h / 2 : cy;
    const nw = Math.min(Math.max(v.w / factor, this.base.w * 0.25), this.base.w * 4);
    const nh = nw * (v.h / v.w);
    this.view = {
      x: px - (px - v.x) * (nw / v.w),
      y: py - (py - v.y) * (nh / v.h),
      w: nw, h: nh
    };
    this._apply();
  };

  Map.prototype._apply = function () {
    const v = this.view;
    this.svg.setAttribute("viewBox", `${v.x} ${v.y} ${v.w} ${v.h}`);
  };

  Map.prototype._toUser = function (evt) {
    const r = this.svg.getBoundingClientRect();
    const v = this.view;
    return {
      x: v.x + ((evt.clientX - r.left) / r.width) * v.w,
      y: v.y + ((evt.clientY - r.top) / r.height) * v.h
    };
  };

  Map.prototype._bindPanZoom = function () {
    const self = this;
    // Plain object, NOT `new Map()`: this module defines its own `Map`
    // constructor above, which shadows the built-in here.
    const pts = {};                 // pointerId -> {x, y}, for pinch
    let dragging = false, last = null;
    let pinch = null;               // {dist, cx, cy} at gesture start
    let lastTap = 0;

    function active() { return Object.keys(pts); }
    function centroid() {
      const a = active().map(k => pts[k]);
      let x = 0, y = 0;
      a.forEach(p => { x += p.x; y += p.y; });
      return { x: x / a.length, y: y / a.length };
    }
    function spread() {
      const a = active().map(k => pts[k]);
      return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
    }
    // client coords -> user space, without needing a wheel event
    function toUserXY(cx, cy) {
      const r = self.svg.getBoundingClientRect();
      const v = self.view;
      return { x: v.x + ((cx - r.left) / r.width) * v.w,
               y: v.y + ((cy - r.top) / r.height) * v.h };
    }

    this.svg.addEventListener("pointerdown", e => {
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };

      if (active().length === 2) {         // second finger: start pinching, stop panning
        dragging = false;
        self.svg.classList.remove("dragging");
        pinch = { dist: spread(), c: centroid() };
        return;
      }
      if (e.target.closest(".n")) return;

      // double tap anywhere on empty canvas refits
      const now = Date.now();
      if (now - lastTap < 300) { self.fit(); lastTap = 0; return; }
      lastTap = now;

      dragging = true; last = { x: e.clientX, y: e.clientY };
      self.svg.classList.add("dragging");
      self.svg.setPointerCapture(e.pointerId);
    });

    this.svg.addEventListener("pointermove", e => {
      if (pts[e.pointerId]) pts[e.pointerId] = { x: e.clientX, y: e.clientY };

      if (active().length === 2 && pinch) {
        const d = spread();
        if (pinch.dist > 0) {
          const c = centroid();
          const u = toUserXY(c.x, c.y);
          self.zoom(d / pinch.dist, u.x, u.y);
          pinch = { dist: d, c: c };
        }
        return;
      }

      if (!dragging) return;
      const r = self.svg.getBoundingClientRect();
      const dx = (e.clientX - last.x) / r.width * self.view.w;
      const dy = (e.clientY - last.y) / r.height * self.view.h;
      self.view.x -= dx; self.view.y -= dy;
      last = { x: e.clientX, y: e.clientY };
      self._apply();
    });

    const stop = e => {
      delete pts[e.pointerId];
      if (active().length < 2) pinch = null;
      dragging = false;
      self.svg.classList.remove("dragging");
      if (e.pointerId !== undefined && self.svg.hasPointerCapture(e.pointerId)) {
        self.svg.releasePointerCapture(e.pointerId);
      }
    };
    this.svg.addEventListener("pointerup", stop);
    this.svg.addEventListener("pointercancel", stop);
    this.svg.addEventListener("lostpointercapture", stop);

    this.svg.addEventListener("wheel", e => {
      e.preventDefault();
      const p = self._toUser(e);
      self.zoom(e.deltaY < 0 ? 1.14 : 1 / 1.14, p.x, p.y);
    }, { passive: false });
  };

  return { Map };
})();
