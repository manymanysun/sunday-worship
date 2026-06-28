#!/usr/bin/env python3
"""Audit a Sunday worship HTML project using only the Python standard library."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import unquote


ENTRY_RE = re.compile(
    r"\{\s*label:\s*['\"](?P<label>[^'\"]+)['\"]\s*,\s*"
    r"src:\s*['\"](?P<src>[^'\"]+)['\"]\s*,\s*pages:\s*(?P<pages>\d+)\s*\}"
)
ARTICLE_RE = re.compile(r"<article\s+class=['\"][^'\"]*\bslide\b", re.I)
LOCAL_REF_RE = re.compile(
    r"['\"](?P<path>\.\.?/[^'\"?#]+\.(?:html|css|js|png|jpe?g|webp|svg))['\"]",
    re.I,
)
PHOTO_NAME_RE = re.compile(r"['\"](?P<name>[^'\"]+\.(?:png|jpe?g|webp))['\"]", re.I)


def strip_line_comments(text: str) -> str:
    return "\n".join(line for line in text.splitlines() if not line.lstrip().startswith("//"))


def count_config_slides(text: str) -> int | None:
    match = re.search(r"\bslides\s*:\s*\[", text)
    if not match:
        return None
    start = text.find("[", match.start())
    square_depth = 0
    count = 0
    quote = None
    escaped = False
    index = start
    while index < len(text):
        char = text[index]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            index += 1
            continue
        if char in "'\"`":
            quote = char
        elif char == "[":
            square_depth += 1
        elif char == "]":
            square_depth -= 1
            if square_depth == 0:
                return count
        elif char == "{" and square_depth == 1:
            count += 1
        index += 1
    return None


def infer_pages(path: Path, text: str) -> int:
    article_count = len(ARTICLE_RE.findall(text))
    if article_count:
        return article_count
    config_count = count_config_slides(text)
    if config_count:
        return config_count
    return 1


def audit(root: Path) -> int:
    errors: list[str] = []
    warnings: list[str] = []
    service_path = root / "service.js"
    if not service_path.exists():
        print(f"ERROR missing {service_path}")
        return 1

    service_text = strip_line_comments(service_path.read_text(encoding="utf-8"))
    entries = list(ENTRY_RE.finditer(service_text))
    if not entries:
        print("ERROR no service entries found")
        return 1

    total = 0
    labels: set[str] = set()
    print("Worship sections")
    print("#  declared actual label")
    for number, match in enumerate(entries, 1):
        label = match.group("label")
        src = match.group("src")
        declared = int(match.group("pages"))
        total += declared
        if label in labels:
            warnings.append(f"duplicate label: {label}")
        labels.add(label)

        relative_src = unquote(src.split("?", 1)[0])
        section_path = root / relative_src
        if not section_path.exists():
            errors.append(f"missing section: {relative_src}")
            print(f"{number:02d} {declared:8d} {'-':>6} {label}")
            continue

        section_text = section_path.read_text(encoding="utf-8")
        actual = infer_pages(section_path, section_text)
        print(f"{number:02d} {declared:8d} {actual:6d} {label}")
        if actual != declared:
            errors.append(
                f"page mismatch for {label}: service={declared}, section={actual} ({relative_src})"
            )

        for reference in LOCAL_REF_RE.finditer(section_text):
            reference_path = unquote(reference.group("path"))
            resolved = (section_path.parent / reference_path).resolve()
            if not resolved.exists():
                errors.append(f"missing asset in {relative_src}: {reference_path}")

        for photo in PHOTO_NAME_RE.finditer(section_text):
            name = photo.group("name")
            if name.startswith(("../", "./")):
                continue
            if name.startswith("微信图片_") and not (root / "photo" / name).exists():
                errors.append(f"missing photo referenced by {relative_src}: {name}")

    print(f"\nDeclared total pages: {total}")
    for warning in sorted(set(warnings)):
        print(f"WARNING {warning}")
    for error in sorted(set(errors)):
        print(f"ERROR {error}")
    if errors:
        print(f"Audit failed with {len(set(errors))} error(s).")
        return 1
    print("Audit passed.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", help="Worship project root")
    args = parser.parse_args()
    return audit(Path(args.root).resolve())


if __name__ == "__main__":
    sys.exit(main())
