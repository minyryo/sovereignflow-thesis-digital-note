#!/usr/bin/env python3
"""
Build data/methods.generated.js from the `site:methods` block in a markdown file.

Default source:
    ../thesis-artifacts/personal/research-method-guide.md

Format inside the block
    - root: <label>              (optional preamble)
    - desc: <mode description>
    ## Branch heading            -> a branch node
    - takeaway: ...              -> properties of the current node
    ### Leaf heading             -> a leaf under the current branch
    - badge: C-2
    - field: Label :: value
    - field: Label :: value :: tag
    - ref: bibkey
    - ref: bibkey | page: p. 12 | quote: verbatim text
    - scene: title | axes3d
    - scene-label: button text

Safety: if the block is missing or parses to zero branches, the existing
generated file is left untouched and the script exits non-zero. A typo can
never blank the mindmap.

Usage
    python3 tools/build_methods.py
    python3 tools/build_methods.py --src /path/to/file.md --check
"""

from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_SRC = "../thesis-artifacts/personal/research-method-guide.md"

# The markers must sit ALONE on their own line. That is what makes it safe for the
# prose above to talk about `<!-- site:methods -->` without the parser grabbing the
# whole document - which it did, silently, the first time this ran.
OPEN_RE  = re.compile(r"^[ \t]*<!--[ \t]*site:methods[ \t]*-->[ \t]*$", re.M)
CLOSE_RE = re.compile(r"^[ \t]*<!--[ \t]*/site:methods[ \t]*-->[ \t]*$", re.M)


def slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return "m-" + (s[:40] or "node")


def extract_block(md: str) -> str | None:
    o = OPEN_RE.search(md)
    if not o:
        return None
    c = CLOSE_RE.search(md, o.end())
    return md[o.end(): c.start()] if c else md[o.end():]


def parse_prop(line: str, node: dict, warn) -> None:
    m = re.match(r"-\s*([a-z-]+)\s*:\s*(.*)$", line.strip())
    if not m:
        warn(f"ignored line (not a `- key: value` property): {line.strip()[:70]}")
        return
    key, val = m.group(1), m.group(2).strip()
    if not val:
        return

    if key == "badge":
        node["badge"] = val
    elif key == "takeaway":
        node["takeaway"] = val
    elif key == "scene":
        node["scene"] = val
    elif key == "scene-label":
        node["sceneLabel"] = val
    elif key == "field":
        parts = [p.strip() for p in val.split("::")]
        if len(parts) < 2:
            warn(f"field needs `Label :: value`: {val[:60]}")
            return
        f = {"k": parts[0], "v": parts[1]}
        if len(parts) > 2 and parts[2]:
            f["tag"] = parts[2]
        node.setdefault("fields", []).append(f)
    elif key == "ref":
        segs = [p.strip() for p in val.split("|")]
        ref = {"key": segs[0]}
        for seg in segs[1:]:
            if ":" not in seg:
                warn(f"ref modifier needs `page:` or `quote:`: {seg[:40]}")
                continue
            k, v = seg.split(":", 1)
            k, v = k.strip().lower(), v.strip()
            if k in ("page", "quote") and v:
                ref[k] = v
            else:
                warn(f"unknown ref modifier `{k}`")
        node.setdefault("refs", []).append(ref)
    else:
        warn(f"unknown key `{key}`")


def parse(block: str, warn) -> tuple[dict, dict]:
    meta = {"root": "Research method", "desc": ""}
    branches: list[dict] = []
    current: dict | None = None     # node properties attach here
    branch: dict | None = None

    for raw in block.splitlines():
        line = raw.rstrip()
        if not line.strip() or line.strip().startswith("<!--"):
            continue

        m3 = re.match(r"###\s+(.*)$", line)
        m2 = re.match(r"##\s+(.*)$", line)

        if m3:
            if branch is None:
                warn(f"leaf `{m3.group(1)}` appears before any `## branch` - skipped")
                current = None
                continue
            leaf = {"id": slug(m3.group(1)), "label": m3.group(1).strip()}
            branch.setdefault("children", []).append(leaf)
            current = leaf
        elif m2:
            branch = {"id": slug(m2.group(1)), "label": m2.group(1).strip()}
            branches.append(branch)
            current = branch
        elif line.lstrip().startswith("-"):
            if current is None:
                # preamble: root / desc
                m = re.match(r"-\s*(root|desc)\s*:\s*(.*)$", line.strip())
                if m:
                    meta[m.group(1)] = m.group(2).strip()
                else:
                    warn(f"property before any heading: {line.strip()[:70]}")
            else:
                parse_prop(line, current, warn)
        # anything else (prose) is ignored by design

    mode = {
        "title": "Research methods",
        "desc": meta["desc"],
        "root": {"id": "m-root", "label": meta["root"], "children": branches},
    }
    return mode, meta


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--src", default=DEFAULT_SRC, help=f"markdown source (default: {DEFAULT_SRC})")
    ap.add_argument("--out", default=None, help="output (default: data/methods.generated.js)")
    ap.add_argument("--check", action="store_true", help="parse and report only; write nothing")
    args = ap.parse_args()

    src = pathlib.Path(args.src)
    if not src.is_absolute():
        src = (HERE / args.src).resolve()

    if not src.exists():
        print(f"error: source not found: {src}", file=sys.stderr)
        return 2

    block = extract_block(src.read_text(encoding="utf-8"))
    if block is None:
        print(f"error: no <!-- site:methods --> block in {src}", file=sys.stderr)
        print("       existing generated file left untouched", file=sys.stderr)
        return 2

    warnings: list[str] = []
    mode, _ = parse(block, warnings.append)

    branches = mode["root"]["children"]
    if not branches:
        print("error: block parsed to zero branches - refusing to write", file=sys.stderr)
        return 2

    # validate ref keys against data/refs.js (regex, so no JS engine needed)
    refs_js = HERE / "data" / "refs.js"
    known = set()
    if refs_js.exists():
        known = set(re.findall(r"^\s{2}([A-Za-z][A-Za-z0-9_]*)\s*:\s*\{",
                               refs_js.read_text(encoding="utf-8"), re.M))

    used, leaves = set(), 0
    for b in branches:
        for n in [b] + b.get("children", []):
            if n is not b:
                leaves += 1
            for r in n.get("refs", []):
                used.add(r["key"])
    unknown = sorted(k for k in used if known and k not in known)

    print(f"source   {src}")
    print(f"parsed   {len(branches)} branches, {leaves} leaves, {len(used)} distinct refs")
    for w in warnings:
        print(f"  warn:  {w}")
    for k in unknown:
        print(f"  warn:  ref key `{k}` is not in data/refs.js - it will render as an error card")

    if args.check:
        print("check only - nothing written")
        return 1 if (unknown or warnings) else 0

    out = pathlib.Path(args.out) if args.out else HERE / "data" / "methods.generated.js"
    out.write_text(
        "/* GENERATED by tools/build_methods.py - do not edit.\n"
        f"   Source: {args.src}  (block: site:methods)\n"
        "   Edit the markdown, then re-run the generator. */\n"
        "if (window.THESIS_MINDMAP) {\n"
        "  window.THESIS_MINDMAP.methods = "
        + json.dumps(mode, indent=2, ensure_ascii=False).replace("\n", "\n  ")
        + ";\n}\n",
        encoding="utf-8",
    )
    print(f"wrote    {out.relative_to(HERE)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
