import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const clientDir = path.join(distDir, "client");
const serverEntry = path.join(distDir, "server", "index.js");

const server = await import(pathToFileURL(serverEntry).href);
const response = await server.default.fetch(new Request("https://valkyrfit.netlify.app/"), {}, {});

if (!response.ok) {
  throw new Error(`Failed to render static index.html: ${response.status}`);
}

const html = await response.text();

await writeFile(path.join(clientDir, "index.html"), html);

await mkdir(distDir, { recursive: true });
const entries = await readdir(clientDir, { withFileTypes: true });

await Promise.all(
  entries.map((entry) => {
    const source = path.join(clientDir, entry.name);
    const destination = path.join(distDir, entry.name);

    return cp(source, destination, { recursive: true, force: true });
  }),
);
