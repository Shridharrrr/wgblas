import { uploadBuffer, createParamsBuffer, stageReadback, destroyBuffers } from "../util/buffer.mjs";
import { createBindGroup } from "../util/bindgroup.mjs";
import { runComputePass, submit } from "../util/compute.mjs";
import { extractResult } from "../util/result.mjs";
import { extractTimestamp } from "../util/benchmark.mjs";
import { loadShader } from "../util/pipeline.mjs";
import { calcWorkgroups } from "../util/workgroup.mjs";
import { onCleanup } from "../init.mjs";

let _pipeline = null;
onCleanup(() => { _pipeline = null; });

export async function sswap(n, x, incx, y, incy) {
  if (!Number.isInteger(n) || !Number.isInteger(incx) || !Number.isInteger(incy)) throw new Error("n, incx, and incy must be integers.");
  if (incx <= 0 || incy <= 0) throw new Error("incx and incy must be positive.");
  if (n <= 0) return { x, y };
  if (!(x instanceof Float32Array)) throw new Error("x must be a Float32Array.");
  if (!(y instanceof Float32Array)) throw new Error("y must be a Float32Array.");
  if (x.length < (n - 1) * incx + 1) throw new Error("x does not have enough elements for the given n and incx.");
  if (y.length < (n - 1) * incy + 1) throw new Error("y does not have enough elements for the given n and incy.");

  if (!_pipeline) _pipeline = await loadShader("sswap");

  const xBuffer = uploadBuffer(x, "sswap-x", true);
  const yBuffer = uploadBuffer(y, "sswap-y", true);
  const paramsBuffer = createParamsBuffer([
    { value: n,    type: "u32" },
    { value: incx, type: "u32" },
    { value: incy, type: "u32" },
  ], "sswap-params");

  const bindGroup = createBindGroup(_pipeline.getBindGroupLayout(0), [xBuffer, yBuffer, paramsBuffer]);
  const { commandEncoder, ts } = runComputePass(_pipeline, bindGroup, calcWorkgroups(n));
  const xReadBuffer = stageReadback(commandEncoder, xBuffer);
  const yReadBuffer = stageReadback(commandEncoder, yBuffer);
  submit(commandEncoder);

  const resultX = await extractResult(xReadBuffer, Float32Array);
  const resultY = await extractResult(yReadBuffer, Float32Array);
  const gpuTimeMs = await extractTimestamp(ts);

  destroyBuffers(xBuffer, yBuffer, paramsBuffer, xReadBuffer, yReadBuffer);

  if (gpuTimeMs !== undefined) return { x: resultX, y: resultY, gpuTimeMs };
  return { x: resultX, y: resultY };
}
