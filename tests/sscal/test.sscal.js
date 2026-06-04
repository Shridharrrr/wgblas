import { test, before, after } from "node:test";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
import { assertUlp } from "../helpers/ulp.js";

const fixtures = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "fixtures/fixtures.json"), "utf8")
);

before(async () => { await init(); });
after(() => { cleanup(); });

test("sscal fixtures", async () => {
  for (const fixture of fixtures) {
    const n = fixture.n;
    const alpha = fixture.alpha;
    const incx = fixture.incx;
    const x = new Float32Array(fixture.x);
    const expected = new Float32Array(fixture.expected);
    
    const result = await sscal(n, alpha, x, incx);
    assertUlp(result, expected, 0, "sscal");
  }
});