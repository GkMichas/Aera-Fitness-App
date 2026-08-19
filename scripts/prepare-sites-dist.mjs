import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

const projectRoot = process.cwd();
const appOutput = resolve(projectRoot, ".next/server/app");
const assetsOutput = resolve(projectRoot, ".open-next/assets");
const distDir = resolve(projectRoot, "dist");
const serverDir = resolve(distDir, "server");
const clientDir = resolve(distDir, "client");

const demoNavigation = `<script data-aera-demo-navigation>(function(){var next={"/onboarding/goal":"/onboarding/about","/onboarding/about":"/onboarding/measurements","/onboarding/measurements":"/onboarding/photos","/onboarding/photos":"/onboarding/activity","/onboarding/activity":"/onboarding/training","/onboarding/training":"/onboarding/nutrition","/onboarding/nutrition":"/onboarding/motivation","/onboarding/motivation":"/onboarding/plan"};document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");if(!a||a.target||a.download)return;var u=new URL(a.href,location.href);if(u.origin!==location.origin)return;e.preventDefault();location.assign(u.pathname+u.search+u.hash)},true);document.addEventListener("submit",function(e){var n=next[location.pathname];if(!n)return;e.preventDefault();location.assign(n)},true)})();</script>`;

await rm(distDir, { recursive: true, force: true });
await mkdir(serverDir, { recursive: true });
await mkdir(clientDir, { recursive: true });
await cp(assetsOutput, clientDir, { recursive: true, dereference: true });
await cp(resolve(projectRoot, "deployment/sites-static-worker.js"), resolve(serverDir, "index.js"));

async function copyPrerendered(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = join(directory, entry.name);
    if (entry.isDirectory()) {
      await copyPrerendered(source);
      continue;
    }
    if (extname(entry.name) !== ".html") continue;
    const routeFile = relative(appOutput, source);
    const route = routeFile === "index.html" ? "" : routeFile.slice(0, -5);
    const destination = resolve(clientDir, route, "index.html");
    const html = (await readFile(source, "utf8")).replace("</body>", `${demoNavigation}</body>`);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, html);
  }
}

await copyPrerendered(appOutput);
console.log("Static AERA demo prepared at dist/server/index.js");
