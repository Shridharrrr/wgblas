import { uploadBuffer, createParamsBuffer } from "../util/buffer.mjs";
import { dispatch } from "../util/dispatch.mjs";
import { loadShader } from "../util/pipeline.mjs";
import { calcWorkgroups } from "../util/workgroup.mjs";
import { onCleanup } from "../init.mjs";

let _pipeline = null;
onCleanup(() => { _pipeline = null; });

// BLAS sscal — single precision: x = alpha * x
export async function sscal(n, alpha, x, incx) {
  if (!Number.isInteger(n) || !Number.isInteger(incx)) throw new Error("n and incx must be integers.");
  if (isNaN(alpha)) throw new Error("alpha must not be NaN.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (n <= 0) return x;
  if (!(x instanceof Float32Array)) throw new Error("x must be a Float32Array.");
  if (x.length < (n - 1) * incx + 1) throw new Error("x does not have enough elements for the given n and incx.");

  if (!_pipeline) _pipeline = await loadShader("sscal");
  const pipeline = _pipeline;

  const xBuffer = uploadBuffer(x, "sscal-x", true);
  const paramsBuffer = createParamsBuffer([
    { value: n,     type: "u32" },
    { value: alpha, type: "f32" },
    { value: incx,  type: "u32" },
  ], "sscal-params");

  return dispatch([xBuffer, paramsBuffer], pipeline, calcWorkgroups(n), 0, xBuffer);
}
