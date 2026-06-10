/**
 * Swaps the elements of two single-precision vectors: x <-> y
 *
 * @param n - number of elements to swap (must be a positive integer)
 * @param x - first input/output vector (Float32Array)
 * @param incx - stride for x (must be a positive integer)
 * @param y - second input/output vector (Float32Array)
 * @param incy - stride for y (must be a positive integer)
 * @returns swapped vectors
 */
export declare function sswap(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number
): Promise<{ x: Float32Array; y: Float32Array }>;

/**
 * Swaps the elements of two single-precision vectors: x <-> y (benchmark mode)
 *
 * @param n - number of elements to swap (must be a positive integer)
 * @param x - first input/output vector (Float32Array)
 * @param incx - stride for x (must be a positive integer)
 * @param y - second input/output vector (Float32Array)
 * @param incy - stride for y (must be a positive integer)
 * @returns swapped vectors and GPU compute time in milliseconds
 */
export declare function sswap(
  n: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number
): Promise<{ x: Float32Array; y: Float32Array; gpuTimeMs: number }>;
