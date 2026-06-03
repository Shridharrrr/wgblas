import { spawnSync } from "child_process";

const op = process.argv[2];
if (!op) {
  console.error("Usage: npm run example <operation>");
  console.error("  e.g. npm run example sscal");
  process.exit(1);
}

spawnSync(
  "npx",
  ["vite", "--open", `/examples/${op}/${op}.html`],
  { stdio: "inherit" }
);
