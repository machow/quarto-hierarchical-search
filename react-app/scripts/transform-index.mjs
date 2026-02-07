#!/usr/bin/env node
import { algoliasearch } from "algoliasearch";

const APP_ID = process.env.ALGOLIA_APP_ID || "AK1GB1OWGW";
const API_KEY = process.env.ALGOLIA_API_KEY || "4ac92cf786d83c1a9bef1d2513c77969";

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));
const positional = args.filter((a) => !a.startsWith("--"));

if (positional.length < 1) {
  console.error("Usage: node transform-index.mjs <index-name> [options]");
  console.error("");
  console.error("Downloads all records from an Algolia index and transforms");
  console.error('crumbs from ["a", "b", "c"] to {lvl0: "a", lvl1: "a > b", ...}');
  console.error("");
  console.error("Options:");
  console.error("  --peek                Show 3 sample records and exit (don't transform)");
  console.error("  --prepend-field=FIELD Prepend a record field (e.g. indexName) as lvl0,");
  console.error("                        shifting existing crumb levels down by one.");
  console.error("");
  console.error("Output goes to stdout. Redirect to a file:");
  console.error("  node transform-index.mjs my-index > output.json");
  console.error("");
  console.error("Examples:");
  console.error("  node transform-index.mjs quarto_prototype > out.json");
  console.error("  node transform-index.mjs shiny-prototype-dev --prepend-field=indexName > out.json");
  process.exit(1);
}

const indexName = positional[0];
const peek = flags.includes("--peek");
const prependFlag = flags.find((f) => f.startsWith("--prepend-field="));
const prependField = prependFlag ? prependFlag.split("=")[1] : null;

const client = algoliasearch(APP_ID, API_KEY);

// Fetch all records via paginated search (works with search-only API keys)
async function fetchAllRecords(indexName) {
  const records = [];
  const hitsPerPage = 1000;
  let page = 0;

  while (true) {
    const res = await client.search({
      requests: [{ indexName, query: "", hitsPerPage, page }],
    });
    const result = res.results[0];
    const hits = result.hits;
    records.push(...hits);
    console.error(`  page ${page}: ${hits.length} hits (${records.length} total)`);

    if (page >= result.nbPages - 1) break;
    page++;
  }

  return records;
}

function transformCrumbs(crumbsArray) {
  if (!Array.isArray(crumbsArray) || crumbsArray.length === 0) {
    return undefined;
  }

  const result = {};
  for (let i = 0; i < crumbsArray.length; i++) {
    result[`lvl${i}`] = crumbsArray.slice(0, i + 1).join(" > ");
  }
  return result;
}

function prependToCrumbs(crumbsObj, prefix) {
  if (!crumbsObj || !prefix) return crumbsObj;

  // Shift all existing levels down by one and prepend prefix as lvl0
  const entries = Object.entries(crumbsObj).sort(
    ([a], [b]) => parseInt(a.slice(3)) - parseInt(b.slice(3))
  );

  const result = { lvl0: prefix };
  for (const [key, value] of entries) {
    const oldLevel = parseInt(key.slice(3));
    result[`lvl${oldLevel + 1}`] = `${prefix} > ${value}`;
  }
  return result;
}

console.error(`Fetching all records from "${indexName}"...`);
if (prependField) {
  console.error(`Will prepend field "${prependField}" as lvl0.`);
}
const records = await fetchAllRecords(indexName);
console.error(`Fetched ${records.length} records.`);

if (peek) {
  console.error("\n--- Sample records (first 3) ---");
  for (const rec of records.slice(0, 3)) {
    const { _highlightResult, ...rest } = rec;
    console.log(JSON.stringify(rest, null, 2));
    console.log("---");
  }

  const withCrumbs = records.filter((r) => r.crumbs);
  const withoutCrumbs = records.filter((r) => !r.crumbs);
  console.error(`\nRecords with crumbs: ${withCrumbs.length}`);
  console.error(`Records without crumbs: ${withoutCrumbs.length}`);

  if (withCrumbs.length > 0) {
    const sample = withCrumbs[0];
    console.error(`\nSample crumbs value: ${JSON.stringify(sample.crumbs)}`);
    console.error(`Type: ${Array.isArray(sample.crumbs) ? "array" : typeof sample.crumbs}`);
  }

  if (prependField) {
    const values = new Set(records.map((r) => r[prependField]).filter(Boolean));
    console.error(`\nUnique "${prependField}" values: ${JSON.stringify([...values])}`);
  }

  process.exit(0);
}

// Transform
let transformed = 0;
let prepended = 0;
let skipped = 0;

const output = records.map((record) => {
  const { _highlightResult, ...rest } = record;

  // Step 1: convert array crumbs to {lvl0, lvl1, ...}
  if (Array.isArray(rest.crumbs)) {
    rest.crumbs = transformCrumbs(rest.crumbs);
    transformed++;
  } else if (rest.crumbs && typeof rest.crumbs === "object") {
    // Already in hierarchical format
  } else {
    skipped++;
  }

  // Step 2: prepend field value as lvl0 if requested
  if (prependField && rest[prependField] && rest.crumbs) {
    rest.crumbs = prependToCrumbs(rest.crumbs, rest[prependField]);
    prepended++;
  } else if (prependField && rest[prependField] && !rest.crumbs) {
    // No crumbs but has the field — make it the sole crumb
    rest.crumbs = { lvl0: rest[prependField] };
    prepended++;
  }

  return rest;
});

console.error(`Transformed: ${transformed}, Prepended: ${prepended}, Skipped (no crumbs): ${skipped}`);
console.log(JSON.stringify(output, null, 2));
