/**
 * Scales a single-precision vector by a constant: x = alpha * x
 *
 * @param n - number of elements to scale (must be a positive integer)
 * @param alpha - scalar multiplier
 * @param x - input/output vector (Float32Array)
 * @param incx - stride for x (must be a positive integer)
 * @returns scaled vector
 */
export declare function sscal(
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number
): Promise<Float32Array>;
