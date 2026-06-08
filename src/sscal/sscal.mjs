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

export async function sscal(n, alpha, x, incx) {
  if (!Number.isInteger(n) || !Number.isInteger(incx)) throw new Error("n and incx must be integers.");
  if (isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (n <= 0) return x;
  if (!(x instanceof Float32Array)) throw new Error("x must be a Float32Array.");
  if (x.length < (n - 1) * incx + 1) throw new Error("x does not have enough elements for the given n and incx.");

  if (!_pipeline) _pipeline = await loadShader("sscal");

  const xBuffer = uploadBuffer(x, "sscal-x", true);
  const paramsBuffer = createParamsBuffer([
    { value: n,     type: "u32" },
    { value: alpha, type: "f32" },
    { value: incx,  type: "u32" },
  ], "sscal-params");

  const bindGroup = createBindGroup(_pipeline.getBindGroupLayout(0), [xBuffer, paramsBuffer]);
  const { commandEncoder, ts } = runComputePass(_pipeline, bindGroup, calcWorkgroups(n));
  const readBuffer = stageReadback(commandEncoder, xBuffer);
  submit(commandEncoder);

  const result = await extractResult(readBuffer, Float32Array);
  const gpuTimeMs = await extractTimestamp(ts);

  destroyBuffers(xBuffer, paramsBuffer, readBuffer);

  if (gpuTimeMs !== undefined) return { result, gpuTimeMs };
  return result;
}
