import { init, cleanup, sscal, sswap, saxpy, scopy, sdot, GpuVector } from "wgblas";

async function smoke() {
  await init();
  const v = GpuVector.from(new Float32Array([1, 2, 3]));
  await sscal(3, 2, v, 1);
  await sswap(3, v, 1, v, 1);
  await saxpy(3, 1, v, 1, v, 1);
  await scopy(3, v, 1, v, 1);
  await sdot(3, v, 1, v, 1);
  cleanup();
}