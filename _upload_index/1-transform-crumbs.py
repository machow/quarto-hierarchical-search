"""Transform crumbs from ["a", "b", ...] to {lvl0: "a", lvl1: "a > b", ...}.

Reads search.json and writes search_crumbs.json with hierarchical crumbs.
Optionally prepends a record field (e.g. indexName) as lvl0, shifting others down.

Usage:
    python 1-transform-crumbs.py [--prepend-field=FIELD] [--peek]
"""

import argparse
import json
import sys
from pathlib import Path


def transform_crumbs(crumbs_array: list[str]) -> dict[str, str]:
    """Convert ["a", "b", "c"] to {lvl0: "a", lvl1: "a > b", lvl2: "a > b > c"}."""
    return {f"lvl{i}": " > ".join(crumbs_array[: i + 1]) for i in range(len(crumbs_array))}


def prepend_to_crumbs(crumbs_obj: dict[str, str], prefix: str) -> dict[str, str]:
    """Shift all levels down by one and prepend prefix as lvl0."""
    entries = sorted(crumbs_obj.items(), key=lambda kv: int(kv[0][3:]))
    result = {"lvl0": prefix}
    for key, value in entries:
        old_level = int(key[3:])
        result[f"lvl{old_level + 1}"] = f"{prefix} > {value}"
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--prepend-field",
        default=None,
        help="Prepend a record field (e.g. indexName) as lvl0",
    )
    parser.add_argument(
        "--peek",
        action="store_true",
        help="Show 3 sample records and stats, then exit",
    )
    args = parser.parse_args()

    input_path = Path(__file__).parent.parent / "search.json"
    output_path = Path(__file__).parent.parent / "search_crumbs.json"

    records = json.loads(input_path.read_text())
    print(f"Loaded {len(records)} records from {input_path}", file=sys.stderr)

    if args.peek:
        for rec in records[:3]:
            print(json.dumps(rec, indent=2))
            print("---")
        with_crumbs = [r for r in records if "crumbs" in r]
        print(f"\nRecords with crumbs: {len(with_crumbs)}", file=sys.stderr)
        print(f"Records without crumbs: {len(records) - len(with_crumbs)}", file=sys.stderr)
        if with_crumbs:
            print(f"Sample crumbs: {json.dumps(with_crumbs[0]['crumbs'])}", file=sys.stderr)
        if args.prepend_field:
            values = sorted({r.get(args.prepend_field, "") for r in records} - {""})
            print(f'Unique "{args.prepend_field}" values: {values}', file=sys.stderr)
        return

    transformed = 0
    prepended = 0
    skipped = 0

    for record in records:
        # Step 1: convert array crumbs to {lvl0, lvl1, ...}
        crumbs = record.get("crumbs")
        if isinstance(crumbs, list):
            record["crumbs"] = transform_crumbs(crumbs)
            transformed += 1
        elif isinstance(crumbs, dict):
            pass  # already hierarchical
        else:
            skipped += 1

        # Step 2: prepend field value as lvl0 if requested
        if args.prepend_field:
            prefix = record.get(args.prepend_field)
            if prefix and "crumbs" in record:
                record["crumbs"] = prepend_to_crumbs(record["crumbs"], prefix)
                prepended += 1
            elif prefix and "crumbs" not in record:
                record["crumbs"] = {"lvl0": prefix}
                prepended += 1

    # Truncate records whose JSON representation exceeds 90,000 characters
    max_chars = 90_000
    truncated = 0
    for record in records:
        rec_json = json.dumps(record)
        if len(rec_json) > max_chars:
            overflow = len(rec_json) - max_chars
            text = record.get("text", "")
            record["text"] = text[: len(text) - overflow]
            truncated += 1

    print(
        f"Transformed: {transformed}, Prepended: {prepended}, Skipped (no crumbs): {skipped}, Truncated: {truncated}",
        file=sys.stderr,
    )

    output_path.write_text(json.dumps(records, indent=2) + "\n")
    print(f"Wrote {output_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
