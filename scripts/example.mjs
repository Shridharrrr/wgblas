import { spawnSync } from "child_process";
import { readdirSync } from "fs";

const args = process.argv.slice(2);
const web = args.includes("--web");
const op = args.find((a) => !a.startsWith("--"));

if (web && !op) {
  console.error("Usage: npm run example [operation] [--web]");
  console.error("  npm run example            — run all node examples");
  console.error("  npm run example sscal      — run node sscal example");
  console.error("  npm run example -- sscal --web — open browser sscal example");
  process.exit(1);
}

if (web) {
  spawnSync("npx", ["vite", "--open", `/examples/${op}/${op}.html`], { stdio: "inherit" });
} else if (op) {
  spawnSync("node", [`examples/${op}/${op}.js`], { stdio: "inherit" });
} else {
  const ops = readdirSync("examples", { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  for (const name of ops) {
    console.log(`\n— ${name} —`);
    spawnSync("node", [`examples/${name}/${name}.js`], { stdio: "inherit" });
  }
}
