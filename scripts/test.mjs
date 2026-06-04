import { spawnSync } from "child_process";

const op = process.argv[2];

if (op === "--help") {
  console.log("Usage: npm test [operation]");
  console.log("  npm test           — run all tests");
  console.log("  npm test sscal     — run only sscal tests");
  process.exit(0);
}

if (op) {
  spawnSync("node", ["--test", `tests/${op}/test.${op}.js`], { stdio: "inherit" });
} else {
  spawnSync("node", ["--test", "--test-reporter=spec", "tests/**/test.*.js"], { stdio: "inherit", shell: true });
}
