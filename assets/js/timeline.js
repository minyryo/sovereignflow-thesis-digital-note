/* ============================================================
   Homepage timeline. Renders window.THESIS_TIMELINE newest-first.
   ============================================================ */

window.Timeline = (function () {
  "use strict";

  const LINK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
    '<path d="M10 14 21 3M15 3h6v6M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmtRange(from, to) {
    if (!from) return "";
    const opts = { day: "2-digit", month: "short" };
    try {
      const a = new Date(from + "T00:00:00");
      const b = to ? new Date(to + "T00:00:00") : null;
      const as = a.toLocaleDateString("en-GB", opts);
      if (!b) return as + " " + a.getFullYear();
      return as + " - " + b.toLocaleDateString("en-GB", opts) + " " + b.getFullYear();
    } catch (e) { return from; }
  }

  function render(mount) {
    const data = window.THESIS_TIMELINE;
    if (!data || !data.events || !data.events.length) {
      mount.innerHTML =
        '<li class="timeline__empty">No entries yet. Write summaries in ' +
        '<code>data/timeline-manual.json</code>, then run ' +
        '<code>python3 tools/build_timeline.py</code> to regenerate ' +
        '<code>data/timeline.js</code>. Weeks you leave out fall back to that week’s ' +
        'latest commit.</li>';
      return;
    }

    const events = data.events.slice().sort((a, b) => (b.week || 0) - (a.week || 0));

    mount.innerHTML = events.map(ev => {
      const auto = ev.source === "auto";
      const chip = auto
        ? '<span class="chip chip--auto" title="Fallback: this week’s latest commit">auto</span>'
        : '<span class="chip chip--manual" title="Written by hand">noted</span>';

      const proof = ev.proof && ev.proof.url
        ? '<span class="ev__proof">' + LINK_ICON +
          '<span>' + esc(ev.proof.label || "proof") + '</span>' +
          (ev.proof.sha ? ' <code>' + esc(ev.proof.sha.slice(0, 7)) + '</code>' : "") +
          '</span>'
        : '<span class="ev__proof"><span class="chip chip--pending">no proof link</span></span>';

      const inner =
        '<div class="ev__meta">' +
          '<span class="ev__week">' + esc(ev.label || ("W" + ev.week)) + '</span>' +
          '<span class="ev__date">' + esc(fmtRange(ev.from, ev.to)) + '</span>' +
          chip +
        '</div>' +
        '<p class="ev__summary">' + esc(ev.summary) + '</p>' +
        (ev.detail ? '<p class="ev__detail">' + esc(ev.detail) + '</p>' : "") +
        proof;

      const card = ev.proof && ev.proof.url
        ? '<a class="ev__card" href="' + esc(ev.proof.url) + '" target="_blank" rel="noopener">' + inner + '</a>'
        : '<div class="ev__card">' + inner + '</div>';

      return '<li class="ev"><span class="ev__dot" aria-hidden="true"></span>' + card + '</li>';
    }).join("");
  }

  return { render };
})();
