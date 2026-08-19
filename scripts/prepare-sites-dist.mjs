import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const openNextDir = resolve(projectRoot, ".open-next");
const distDir = resolve(projectRoot, "dist");
const serverDir = resolve(distDir, "server");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(openNextDir, serverDir, { recursive: true, dereference: true });
await cp(resolve(serverDir, "worker.js"), resolve(serverDir, "index.js"));

console.log("Sites artifact prepared at dist/server/index.js");
