#!/usr/bin/env python3
"""
Regenerate data/timeline.js for the thesis digital note.

Rule (as specified):
  * a hand-written entry in data/timeline-manual.json always wins;
  * any week without one falls back to that week's LATEST commit -
    its subject line becomes the summary, its commit URL becomes the proof.

Plan weeks follow the master plan: W1 = Monday 2026-09-07.

Usage
    python3 tools/build_timeline.py
    python3 tools/build_timeline.py --repo ../thesis-artifacts
    python3 tools/build_timeline.py --all-branches      # include every branch

The generated file is committed, so GitHub Pages needs no build step.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import re
import subprocess
import sys

WEEK1_MONDAY = dt.date(2026, 9, 7)      # master plan: plan week 1
HERE = pathlib.Path(__file__).resolve().parent.parent


# ----------------------------------------------------------------- helpers

def run(args, cwd):
    out = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
    if out.returncode != 0:
        raise RuntimeError(" ".join(args) + "\n" + out.stderr.strip())
    return out.stdout


def remote_web_url(repo: pathlib.Path) -> str | None:
    """git@github.com:u/r.git  /  https://github.com/u/r.git  ->  https://github.com/u/r"""
    try:
        url = run(["git", "remote", "get-url", "origin"], repo).strip()
    except RuntimeError:
        return None
    m = re.match(r"^git@([^:]+):(.+?)(?:\.git)?$", url)
    if m:
        return f"https://{m.group(1)}/{m.group(2)}"
    m = re.match(r"^https?://([^/]+)/(.+?)(?:\.git)?$", url)
    if m:
        return f"https://{m.group(1)}/{m.group(2)}"
    return None


def plan_week(d: dt.date) -> int:
    """Plan-week index for a date. W1 = week of 2026-09-07. May be <= 0."""
    monday = d - dt.timedelta(days=d.weekday())
    return (monday - WEEK1_MONDAY).days // 7 + 1


def week_bounds(week: int) -> tuple[str, str]:
    start = WEEK1_MONDAY + dt.timedelta(weeks=week - 1)
    return start.isoformat(), (start + dt.timedelta(days=6)).isoformat()


def collect_commits(repo: pathlib.Path, all_branches: bool) -> dict[int, dict]:
    """Latest commit per plan week."""
    args = ["git", "log", "--date=short", "--pretty=%H%x1f%ad%x1f%s"]
    if all_branches:
        args.insert(2, "--all")
    latest: dict[int, dict] = {}
    for line in run(args, repo).splitlines():
        if not line.strip():
            continue
        sha, date, subject = line.split("\x1f", 2)
        try:
            d = dt.date.fromisoformat(date)
        except ValueError:
            continue
        wk = plan_week(d)
        # git log is newest-first, so the first one seen for a week is its latest
        latest.setdefault(wk, {"sha": sha, "date": date, "subject": subject})
    return latest


# ----------------------------------------------------------------- build

def build(repo: pathlib.Path, all_branches: bool) -> dict:
    manual_path = HERE / "data" / "timeline-manual.json"
    manual = {}
    if manual_path.exists():
        raw = json.loads(manual_path.read_text(encoding="utf-8"))
        for item in raw.get("events", []):
            if "week" in item:
                manual[int(item["week"])] = item

    web = remote_web_url(repo)
    commits = collect_commits(repo, all_branches)

    weeks = sorted(set(manual) | set(commits))
    events = []

    for wk in weeks:
        frm, to = week_bounds(wk)
        m = manual.get(wk)
        c = commits.get(wk)

        if m and m.get("summary"):
            proof = m.get("proof") or {}
            if not proof.get("url") and c and web:
                proof = {"url": f"{web}/commit/{c['sha']}",
                         "label": "commit", "sha": c["sha"]}
            events.append({
                "week": wk,
                "label": m.get("label") or f"W{wk:02d}",
                "from": m.get("from") or frm,
                "to": m.get("to") or to,
                "summary": m["summary"],
                "detail": m.get("detail", ""),
                "source": "manual",
                "proof": proof,
            })
        elif c:
            proof = {"url": f"{web}/commit/{c['sha']}", "label": "commit",
                     "sha": c["sha"]} if web else {}
            events.append({
                "week": wk,
                "label": f"W{wk:02d}",
                "from": frm,
                "to": to,
                "summary": c["subject"],
                "detail": "",
                "source": "auto",
                "proof": proof,
            })

    return {
        "generated": dt.datetime.now().astimezone().isoformat(timespec="seconds"),
        "repo": web or "",
        "week1Monday": WEEK1_MONDAY.isoformat(),
        "events": events,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo", default="../thesis-artifacts",
                    help="path to the thesis-artifacts git repo (default: ../thesis-artifacts)")
    ap.add_argument("--all-branches", action="store_true",
                    help="scan every branch, not just the checked-out one")
    ap.add_argument("--out", default=None, help="output path (default: data/timeline.js)")
    args = ap.parse_args()

    repo = (HERE / args.repo).resolve() if not pathlib.Path(args.repo).is_absolute() \
        else pathlib.Path(args.repo)

    if not (repo / ".git").exists():
        print(f"error: {repo} is not a git repository", file=sys.stderr)
        print("       pass --repo /path/to/thesis-artifacts", file=sys.stderr)
        return 2

    try:
        data = build(repo, args.all_branches)
    except RuntimeError as e:
        print(f"error: git failed\n{e}", file=sys.stderr)
        return 1

    out = pathlib.Path(args.out) if args.out else HERE / "data" / "timeline.js"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        "/* GENERATED by tools/build_timeline.py - do not edit.\n"
        "   Hand-written summaries live in data/timeline-manual.json. */\n"
        "window.THESIS_TIMELINE = "
        + json.dumps(data, indent=2, ensure_ascii=False)
        + ";\n",
        encoding="utf-8",
    )

    manual_n = sum(1 for e in data["events"] if e["source"] == "manual")
    auto_n = len(data["events"]) - manual_n
    print(f"wrote {out.relative_to(HERE)}")
    print(f"  {len(data['events'])} week(s): {manual_n} hand-written, {auto_n} auto from commits")
    if not data["repo"]:
        print("  warning: no origin remote found - proof links omitted", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
