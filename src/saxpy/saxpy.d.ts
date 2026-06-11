/**
 * Performs the operation y = alpha * x + y
 *
 * @param n - number of elements (must be a positive integer)
 * @param alpha - scalar multiplier (must be a single-precision float)
 * @param x - input vector (Float32Array)
 * @param incx - stride for x (must be a positive integer)
 * @param y - input/output vector (Float32Array)
 * @param incy - stride for y (must be a positive integer)
 * @returns updated y vector
 */
export declare function saxpy(
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number
): Promise<{ y: Float32Array }>;

/**
 * Performs the operation y = alpha * x + y (benchmark mode)
 *
 * @param n - number of elements (must be a positive integer)
 * @param alpha - scalar multiplier (must be a single-precision float)
 * @param x - input vector (Float32Array)
 * @param incx - stride for x (must be a positive integer)
 * @param y - input/output vector (Float32Array)
 * @param incy - stride for y (must be a positive integer)
 * @returns updated y vector and GPU compute time in milliseconds
 */
export declare function saxpy(
  n: number,
  alpha: number,
  x: Float32Array,
  incx: number,
  y: Float32Array,
  incy: number
): Promise<{ y: Float32Array; gpuTimeMs: number }>;
