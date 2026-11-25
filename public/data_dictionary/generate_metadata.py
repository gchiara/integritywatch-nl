#!/usr/bin/env python3
"""Convert the Integrity Watch NL data dictionary (Markdown) into machine-readable
metadata: a dataset-level CSV, a variable-level CSV and a DCAT-AP catalogue in
JSON-LD.

The dictionary keeps its own layout: five-column secondary tables with the
'Personal data.' and 'Values/format:' markers written inside the Notes column.
This script lifts those markers out into separate CSV columns; the document
itself is never rewritten.

The mapping from section number to dataset id comes from the overview table
under 'How to read this document', not from a table hard-coded here, so adding
a fifth dataset needs no change to this script.

Structural problems (an unknown section, a duplicate key, a variable row that
sits outside any sub-table) are errors and stop the run, because they mean the
output would silently lose or mislabel rows. Content problems (a categorical
without a value list, an unconfirmed licence) are warnings: they are reported
and the files are still written.

Usage:  python3 generate_metadata.py [dictionary.md] [output_dir]
"""
from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

DEFAULT_SRC = Path("Integrity_Watch_NL_Data_Dictionary.md")
DEFAULT_OUT = Path("/mnt/user-data/outputs")

PUBLISHER = "Transparency International Nederland"
LANDING_PAGE = "https://www.integritywatch.nl"
LANGUAGE = "nl"
THEME = "GOVE"

DATA_TYPES = {"Text", "Numeric", "Date", "Categorical", "Boolean"}

FREQUENCY_URI = "http://publications.europa.eu/resource/authority/frequency/"
THEME_URI = "http://publications.europa.eu/resource/authority/data-theme/"

PRIMARY_FIELDS = {
    "Dataset": "dataset",
    "Source": "source",
    "Description": "description",
    "Related legislation": "related_legislation",
    "Period covered": "period_covered",
    "Geographical scope": "geographical_scope",
    "Notes/Limitations": "notes_limitations",
    "Update frequency": "update_frequency",
    "Download link": "download_link",
}
REQUIRED_PRIMARY = ["dataset", "description", "source", "period_covered", "update_frequency"]


class Report:
    """Collects errors and warnings so the whole document is checked in one pass."""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    def print(self) -> None:
        if self.errors:
            print(f"\nERRORS ({len(self.errors)}) — output not written:")
            for e in self.errors:
                print("  -", e)
        if self.warnings:
            state = "not written, see errors above" if self.errors else "output written"
            print(f"\nWARNINGS ({len(self.warnings)}) — {state}, review needed:")
            for w in self.warnings:
                print("  -", w)
        if not self.errors and not self.warnings:
            print("\nNo issues found.")


# ------------------------------------------------------------------ parsing --
def clean(s: str | None) -> str:
    """Undo markdown escaping and inline formatting, normalise whitespace."""
    if not s:
        return ""
    s = re.sub(r"<br\s*/?>", " ", s)
    s = re.sub(r"\\+_", "_", s)
    s = s.replace("**", "").replace("`", "")
    s = re.sub(r"\\+", "", s)
    return re.sub(r"\s+", " ", s).strip()


def split_row(line: str) -> list[str]:
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|"):
        line = line[:-1]
    return [c.strip() for c in line.split("|")]


def extract_markers(notes: str) -> tuple[str, str, bool]:
    """Lift 'Personal data' and 'Values/format: X' out of a Notes cell.

    Only the CSV and JSON output are affected; the dictionary keeps the markers
    in place. Check for the personal-data marker first, since it often trails
    the value list.
    """
    personal = bool(re.search(r"Personal data\.?", notes, re.I))
    notes = re.sub(r"Personal data\.?", "", notes, flags=re.I)

    values = ""
    m = re.search(r"Val\w*/format:\s*(.*)$", notes, re.S)
    if m:
        values = m.group(1).strip().rstrip(".;, ")
        notes = notes[:m.start()]
    # a bare 'Values: man, vrouw' prefix is redundant once the list is captured
    notes = re.sub(r"Values include\s+", "", notes)
    notes = re.sub(r"Values:\s*[^.]*\.?\s*", "", notes)
    return clean(notes), clean(values), personal


def parse_header(text: str, report: Report) -> tuple[str, str, str]:
    version = updated = contact = ""
    m = re.search(r"\*\*Version:\*\*\s*([\d.]+)\s*—\s*\*\*Last updated:\*\*\s*(\d{4}-\d{2}-\d{2})", text)
    if m:
        version, updated = m.group(1), m.group(2)
    else:
        report.error("could not read '**Version:** X — **Last updated:** YYYY-MM-DD' from the header")
    m = re.search(r"\*\*Contact:\*\*\s*(\S+@\S+)", text)
    if m:
        contact = m.group(1)
    else:
        report.error("could not read '**Contact:**' from the header")
    return version, updated, contact


def parse_overview(lines: list[str], report: Report) -> dict[str, tuple[str, str]]:
    """Read the '# | Dataset ID | Dataset | Platform section' table at the top.

    Returns {section number: (dataset id, platform section)}. This replaces a
    hard-coded mapping: the document already lists it.
    """
    mapping: dict[str, tuple[str, str]] = {}
    for i, ln in enumerate(lines):
        if split_row(ln)[:2] == ["#", "Dataset ID"]:
            for row in lines[i + 2:]:
                if not row.strip().startswith("|"):
                    break
                cells = split_row(row)
                if len(cells) != 4 or not cells[0].isdigit():
                    break
                mapping[cells[0]] = (clean(cells[1]), clean(cells[3]))
            break
    if not mapping:
        report.error("no dataset overview table found under 'How to read this document'")
    return mapping


def find_sections(lines: list[str], report: Report) -> dict[str, tuple[int, int]]:
    """Locate each numbered section.

    Headings appear either as '# 1\\. Title' or as a bare '2\\. Title' line
    followed by '===', which is how the export writes a setext heading.
    """
    starts: dict[str, int] = {}
    for i, ln in enumerate(lines):
        m = re.match(r"^#*\s*(\d+)\\?\.\s+\S", ln.strip())
        if m and m.group(1) not in starts:
            starts[m.group(1)] = i
    if not starts:
        report.error("no dataset sections found")
        return {}
    order = sorted(starts.items(), key=lambda kv: kv[1])
    bounds = {}
    for idx, (num, s) in enumerate(order):
        e = order[idx + 1][1] if idx + 1 < len(order) else len(lines)
        bounds[num] = (s, e)
    return bounds


def parse_primary(block: list[str], num: str, report: Report) -> dict[str, str]:
    prim: dict[str, str] = {}
    for ln in block:
        st = ln.strip()
        if re.match(r"^#+\s*\d+\.2", st):
            break
        if not st.startswith("|"):
            continue
        cells = split_row(ln)
        if len(cells) != 2:
            continue
        key = clean(cells[0]).rstrip(":")
        if key in PRIMARY_FIELDS:
            prim[PRIMARY_FIELDS[key]] = clean(cells[1])
    for field in REQUIRED_PRIMARY:
        if not prim.get(field):
            report.error(f"section {num}: primary table has no '{field}' row")
    return prim


def parse_variables(block: list[str], ds_id: str, ds_title: str,
                    report: Report) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    in_vars = False
    header_seen = False
    table = ""
    for ln in block:
        st = ln.strip()
        if re.match(r"^#+\s*\d+\.2", st):
            in_vars = True
            continue
        if not in_vars or not st.startswith("|"):
            continue
        cells = split_row(ln)
        first = cells[0]

        if first.startswith("Variable Name"):
            header_seen = True
            continue
        if first and set(first) <= {"-", " "}:
            continue

        # sub-table header row, e.g. |*— `Persoon` —*|||||
        m = re.match(r"^\*—\s*(.+?)\s*—\*$", first)
        if m:
            table = clean(m.group(1))
            continue
        if not first:
            continue
        if len(cells) < 5:
            report.error(f"[{ds_id}] row '{clean(first)}' has {len(cells)} columns, expected 5")
            continue
        if not table:
            report.error(f"[{ds_id}] variable '{clean(first)}' appears before any sub-table header")
            continue

        name = clean(cells[0])
        dtype = clean(cells[1])
        description = clean(cells[2])
        source = clean(cells[4])
        notes, values, personal = extract_markers(cells[3])

        if dtype not in DATA_TYPES:
            report.error(f"[{ds_id}.{table}.{name}] data type '{dtype}' is outside {sorted(DATA_TYPES)}")
        if not description:
            report.error(f"[{ds_id}.{table}.{name}] has no description")
        if not source:
            report.error(f"[{ds_id}.{table}.{name}] has no source")
        if dtype == "Categorical" and not values:
            report.warn(f"[{ds_id}.{table}.{name}] is categorical but has no value list")

        rows.append({
            "dataset_id": ds_id,
            "dataset_title": ds_title,
            "table": table,
            "variable_id": f"{ds_id}.{table}.{name}",
            "variable_name": name,
            "data_type": dtype,
            "variable_description": description,
            "notes_limitations": notes,
            "values_or_format": values,
            "personal_data": "true" if personal else "false",
            "source": source,
        })

    if in_vars and not header_seen:
        report.error(f"[{ds_id}] secondary table has no header row")
    if in_vars and not rows:
        report.error(f"[{ds_id}] secondary table contains no variables")
    return rows


def map_frequency(raw: str) -> str:
    f = raw.lower()
    if "annual" in f or "jaar" in f or "yearly" in f:
        return "ANNUAL"
    if "quarter" in f or "kwartaal" in f:
        return "QUARTERLY"
    if "month" in f or "maand" in f:
        return "MONTHLY"
    if "week" in f:
        return "WEEKLY"
    if "dail" in f or "dag" in f:
        return "DAILY"
    return "IRREG"


def parse_period(text: str) -> tuple[str, str]:
    m = re.search(r"(\d{4})\s*[–-]\s*(\d{4})", text)
    return (m.group(1), m.group(2)) if m else ("", "")


# ------------------------------------------------------------------- output --
DATASET_COLUMNS = [
    "dataset_id", "dataset_title", "platform_section", "dataset", "description",
    "source", "related_legislation", "period_covered", "period_start", "period_end",
    "geographical_scope", "update_frequency", "accrual_periodicity",
    "notes_limitations", "download_link", "landing_page", "publisher",
    "contact_point", "language", "licence", "theme", "variable_count",
    "personal_data_count", "metadata_version", "metadata_updated",
]
VARIABLE_CSV_COLUMNS = [
    "dataset_id", "dataset_title", "table", "variable_id", "variable_name",
    "data_type", "variable_description", "notes_limitations", "values_or_format",
    "personal_data", "source",
]


def write_csv(path: Path, columns: list[str], rows: list[dict]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=columns, quoting=csv.QUOTE_ALL, lineterminator="\r\n")
        w.writeheader()
        w.writerows(rows)


def build_dcat(datasets: list[dict], variables: list[dict], version: str, updated: str) -> dict:
    by_dataset: dict[str, list[dict]] = {}
    for v in variables:
        by_dataset.setdefault(v["dataset_id"], []).append(v)

    entries = []
    for d in datasets:
        entry = {
            "@id": f"{LANDING_PAGE}/dataset/{d['dataset_id']}",
            "@type": "dcat:Dataset",
            "dct:identifier": d["dataset_id"],
            "dct:title": {"@value": d["dataset_title"], "@language": "en"},
            "dct:description": {"@value": d["description"], "@language": "en"},
            "dct:publisher": {"@type": "foaf:Agent", "foaf:name": PUBLISHER},
            "dcat:contactPoint": {
                "@type": "vcard:Organization",
                "vcard:fn": PUBLISHER,
                "vcard:hasEmail": f"mailto:{d['contact_point']}",
            },
            "dct:language": LANGUAGE,
            "dcat:theme": {"@id": THEME_URI + THEME},
            "dct:accrualPeriodicity": {"@id": FREQUENCY_URI + d["accrual_periodicity"]},
            "dct:spatial": d["geographical_scope"],
            "dct:license": d["licence"],
            "dcat:landingPage": {"@id": LANDING_PAGE},
            "dct:provenance": d["source"],
            "dct:accessRights": "PUBLIC",
            "iwnl:relatedLegislation": d["related_legislation"],
            "iwnl:notesLimitations": d["notes_limitations"],
            "iwnl:platformSection": d["platform_section"],
        }
        if d["period_start"] and d["period_end"]:
            entry["dct:temporal"] = {
                "@type": "dct:PeriodOfTime",
                "dcat:startDate": f"{d['period_start']}-01-01",
                "dcat:endDate": f"{d['period_end']}-12-31",
            }
        if d["download_link"]:
            entry["dcat:distribution"] = [{
                "@type": "dcat:Distribution",
                "dcat:accessURL": {"@id": d["download_link"]},
                "dct:license": d["licence"],
            }]
        # not part of DCAT-AP; kept under the iwnl namespace so the file stays valid
        entry["iwnl:variable"] = [{
            "iwnl:id": v["variable_id"],
            "iwnl:table": v["table"],
            "iwnl:name": v["variable_name"],
            "iwnl:dataType": v["data_type"],
            "dct:description": v["variable_description"],
            "iwnl:valuesOrFormat": v["values_or_format"],
            "iwnl:notesLimitations": v["notes_limitations"],
            "iwnl:personalData": v["personal_data"] == "true",
            "dct:source": v["source"],
        } for v in by_dataset.get(d["dataset_id"], [])]
        entries.append(entry)

    return {
        "@context": {
            "dcat": "http://www.w3.org/ns/dcat#",
            "dct": "http://purl.org/dc/terms/",
            "foaf": "http://xmlns.com/foaf/0.1/",
            "vcard": "http://www.w3.org/2006/vcard/ns#",
            "owl": "http://www.w3.org/2002/07/owl#",
            "iwnl": f"{LANDING_PAGE}/ns#",
        },
        "@id": f"{LANDING_PAGE}/catalog",
        "@type": "dcat:Catalog",
        "dct:title": {"@value": "Integrity Watch Nederland", "@language": "en"},
        "dct:publisher": {"@type": "foaf:Agent", "foaf:name": PUBLISHER},
        "dct:modified": updated,
        "owl:versionInfo": version,
        "dcat:dataset": entries,
    }


# --------------------------------------------------------------------- main --
def main() -> int:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_OUT
    if not src.is_file():
        print(f"dictionary not found: {src}", file=sys.stderr)
        return 2
    out.mkdir(parents=True, exist_ok=True)

    report = Report()
    text = src.read_text(encoding="utf-8")
    lines = text.split("\n")

    version, updated, contact = parse_header(text, report)
    overview = parse_overview(lines, report)
    sections = find_sections(lines, report)

    # every section in the body must appear in the overview table and vice versa
    for num in sections:
        if num not in overview:
            report.error(f"section {num} has no row in the dataset overview table")
    for num in overview:
        if num not in sections:
            report.error(f"overview lists dataset {num} ({overview[num][0]}) "
                         f"but the body has no section {num}")

    datasets: list[dict] = []
    variables: list[dict] = []

    for num, (s, e) in sorted(sections.items(), key=lambda kv: int(kv[0])):
        if num not in overview:
            continue
        ds_id, section = overview[num]
        title = re.sub(r"^#*\s*\d+\\?\.\s+", "", lines[s].strip())
        block = lines[s:e]

        prim = parse_primary(block, num, report)
        period_start, period_end = parse_period(prim.get("period_covered", ""))
        rows = parse_variables(block, ds_id, title, report)
        variables.extend(rows)

        # cross-check the years in the Dataset row against Period covered
        d_start, d_end = parse_period(prim.get("dataset", ""))
        if d_start and period_start and (d_start, d_end) != (period_start, period_end):
            report.warn(f"[{ds_id}] 'Dataset' row says {d_start}–{d_end} but "
                        f"'Period covered' says {period_start}–{period_end}")

        link = prim.get("download_link", "")
        if not link.startswith("http"):
            report.warn(f"[{ds_id}] download link '{link}' is not a resolvable URL")

        datasets.append({
            "dataset_id": ds_id,
            "dataset_title": title,
            "platform_section": section,
            "dataset": prim.get("dataset", ""),
            "description": prim.get("description", ""),
            "source": prim.get("source", ""),
            "related_legislation": prim.get("related_legislation", ""),
            "period_covered": prim.get("period_covered", ""),
            "period_start": period_start,
            "period_end": period_end,
            "geographical_scope": prim.get("geographical_scope", ""),
            "update_frequency": prim.get("update_frequency", ""),
            "accrual_periodicity": map_frequency(prim.get("update_frequency", "")),
            "notes_limitations": prim.get("notes_limitations", ""),
            "download_link": link,
            "landing_page": LANDING_PAGE,
            "publisher": PUBLISHER,
            "contact_point": contact,
            "language": LANGUAGE,
            "licence": "TO_CONFIRM",
            "theme": THEME,
            "variable_count": len(rows),
            "personal_data_count": sum(1 for r in rows if r["personal_data"] == "true"),
            "metadata_version": version,
            "metadata_updated": updated,
        })

    # ---- checks that need the whole document ----
    seen: set[str] = set()
    for d in datasets:
        if d["dataset_id"] in seen:
            report.error(f"duplicate dataset id '{d['dataset_id']}'")
        seen.add(d["dataset_id"])
    seen = set()
    for v in variables:
        if v["variable_id"] in seen:
            report.error(f"duplicate variable id '{v['variable_id']}'")
        seen.add(v["variable_id"])

    links = {d["download_link"] for d in datasets if d["download_link"]}
    if len(datasets) > 1 and len(links) == 1:
        report.warn(f"all {len(datasets)} datasets share one download link "
                    f"({links.pop()}); a per-dataset distribution URL is needed "
                    f"before this can be published as DCAT")
    if any(d["licence"] == "TO_CONFIRM" for d in datasets):
        report.warn("licence is TO_CONFIRM for every dataset; set it before publication")

    print(f"datasets: {len(datasets)}  variables: {len(variables)}")
    for d in datasets:
        print(f"  {d['dataset_id']:26} vars={d['variable_count']:3} "
              f"personal={d['personal_data_count']:2} "
              f"period={d['period_start']}-{d['period_end']} "
              f"freq={d['accrual_periodicity']}")

    if report.errors:
        report.print()
        return 1

    write_csv(out / "iwnl-metadata-datasets.csv", DATASET_COLUMNS, datasets)
    write_csv(out / "iwnl-metadata-variables.csv", VARIABLE_CSV_COLUMNS, variables)
    (out / "iwnl-catalog.jsonld").write_text(
        json.dumps(build_dcat(datasets, variables, version, updated),
                   indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\nwrote 3 files to {out}")
    report.print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
