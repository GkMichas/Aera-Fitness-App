import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const workerUrl = pathToFileURL(resolve(projectRoot, "dist/server/index.js"));
workerUrl.searchParams.set("test", String(Date.now()));
const { default: worker } = await import(workerUrl.href);

const env = {
  ASSETS: {
    async fetch(request) {
      const pathname = decodeURIComponent(new URL(request.url).pathname).replace(/^\/+/, "");
      try {
        return new Response(await readFile(resolve(projectRoot, "dist/client", pathname)), { status: 200 });
      } catch {
        return new Response("Not found", { status: 404 });
      }
    },
  },
};

const home = await worker.fetch(new Request("https://aera.test/home"), env);
assert.equal(home.status, 200);
assert.match(await home.text(), /data-aera-demo-navigation/);

const coach = await worker.fetch(new Request("https://aera.test/api/coach", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: "What should I train today?" }) }), env);
assert.equal(coach.status, 200);
assert.equal((await coach.json()).intent, "training");

const health = await worker.fetch(new Request("https://aera.test/api/health/assess", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ emergencyFlags: ["chest_pressure"] }) }), env);
assert.equal(health.status, 200);
assert.equal((await health.json()).assessment.urgency, "emergency");

console.log("Sites artifact routes, Coach demo and Health safety demo passed.");
