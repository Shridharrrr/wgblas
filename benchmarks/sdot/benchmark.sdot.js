import { init, cleanup } from "wgblas";
import { sdot } from "wgblas/sdot";
import { randomFloat32Array } from "wgblas/util/random";
import { median, printHeader, printRow } from "../utils/helpers.mjs";

const WARMUP_ITERS = 5;
const BENCH_ITERS  = 100;
const SIZES = [32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216];

const COLS = ["n", "compute_ms", "compute_GBs"];

await init({ benchmark: true });
printHeader(COLS);

for (const n of SIZES) {
  const x = randomFloat32Array(n);
  const y = randomFloat32Array(n);

  // warm up
  for (let i = 0; i < WARMUP_ITERS; i++) {
    await sdot(n, x, 1, y, 1);
  }

  // benchmark — gpuTimeMs is GPU-only compute time from timestamp-query
  const times = [];
  for (let i = 0; i < BENCH_ITERS; i++) {
    const { gpuTimeMs } = await sdot(n, x, 1, y, 1);
    times.push(gpuTimeMs);
  }

  const med = median(times);
  const bytes = 2 * n * 4; // x read + y read
  const gbs = (bytes / 1e9) / (med / 1e3);
  printRow(COLS, [n, med, gbs]);
}

cleanup();