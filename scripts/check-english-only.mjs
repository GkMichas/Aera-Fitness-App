import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const roots = ["app", "components", "lib", "types"];
const extensions = new Set([".ts", ".tsx", ".json"]);
const greek = /[\u0370-\u03ff\u1f00-\u1fff]/u;
const failures = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (extensions.has(extname(entry.name)) && greek.test(await readFile(path, "utf8"))) failures.push(relative(process.cwd(), path));
  }
}

for (const root of roots) await walk(join(process.cwd(), root));
if (failures.length) {
  console.error(`Greek characters found in production sources:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log("English-only production source check passed.");
