import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = readFileSync(resolve(root, "docs/reference/AERA Screens.dc.html"), "utf8");
const lines = source.split("\n");
const screens = {};

for (let index = 0; index < lines.length; index += 1) {
  const labelMatch = lines[index].match(/data-screen-label="([^"]+)"/);
  if (!labelMatch) continue;

  let phoneStart = index + 1;
  while (phoneStart < lines.length && !lines[phoneStart].includes("width:390px;height:844px")) {
    phoneStart += 1;
  }

  let depth = 0;
  let phoneEnd = phoneStart;
  for (; phoneEnd < lines.length; phoneEnd += 1) {
    depth += (lines[phoneEnd].match(/<div\b/g) || []).length;
    depth -= (lines[phoneEnd].match(/<\/div>/g) || []).length;
    if (depth === 0) break;
  }

  let html = lines
    .slice(phoneStart, phoneEnd + 1)
    .join("\n")
    .replaceAll("{{ accent }}", "#E6533A")
    .replaceAll(/\sstyle-hover="[^"]*"/g, "")
    .replaceAll(/<sc-if[^>]*>/g, "")
    .replaceAll("</sc-if>", "");

  let inputIndex = 0;
  html = html.replace(/<input\b([^>]*)>/g, (input, attributes) => {
    if (/aria-label=/.test(attributes)) return input;
    inputIndex += 1;
    return `<input aria-label="${labelMatch[1]} input ${inputIndex}"${attributes}>`;
  });

  screens[labelMatch[1]] = html;
}

if (Object.keys(screens).length !== 31) {
  throw new Error(`Expected 31 screens, found ${Object.keys(screens).length}`);
}

const output = `// Generated from docs/reference/AERA Screens.dc.html. Do not edit manually.\nexport const referenceScreens = ${JSON.stringify(screens, null, 2)} as const;\n\nexport type ReferenceScreenName = keyof typeof referenceScreens;\n`;

writeFileSync(resolve(root, "lib/reference-screens.generated.ts"), output);
console.log(`Generated ${Object.keys(screens).length} reference screens.`);
