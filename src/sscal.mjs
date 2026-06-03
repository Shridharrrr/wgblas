import { uploadBuffer, createParamsBuffer } from "./util/buffer.mjs";
import { dispatch } from "./util/dispatch.mjs";
import { loadShader } from "./util/pipeline.mjs";
import { calcWorkgroups } from "./util/workgroup.mjs";

// BLAS sscal — single precision: x = alpha * x
export async function sscal(n, alpha, x, incx) {
  if (isNaN(n) || isNaN(alpha) || isNaN(incx)) throw new Error("n, alpha, and incx must not be NaN.");
  if (incx <= 0) throw new Error("incx must be positive.");
  if (n <= 0) return x;

  const pipeline = await loadShader("sscal");

  const xBuffer = await uploadBuffer(x, n * 4, "sscal-x", true);
  const paramsBuffer = await createParamsBuffer([
    { value: n,     type: "u32" },
    { value: alpha, type: "f32" },
    { value: incx,  type: "u32" },
  ], "sscal-params");

  return dispatch([xBuffer, paramsBuffer], pipeline, calcWorkgroups(n), 0, xBuffer);
}
