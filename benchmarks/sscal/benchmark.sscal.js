import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
import { randomFloat32Array } from "wgblas/util/random";
import { median, printHeader, printRow } from "../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS  = 100;
const SIZES = [32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216];

const COLS = ["n", "compute_ms", "compute_GBs"];

await init({ benchmark: true });
printHeader(COLS);

for (const n of SIZES) {
  const alpha = 2.0;
  const input = randomFloat32Array(n);

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await sscal(n, alpha, input, 1);
  }

  // benchmark — gpuTimeMs is GPU-only compute time from timestamp-query
  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await sscal(n, alpha, input, 1);
    times.push(gpuTimeMs);
  }

  const med = median(times);
  const bytes = 2 * n * 4;
  const gbs = (bytes / 1e9) / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
}

cleanup();
