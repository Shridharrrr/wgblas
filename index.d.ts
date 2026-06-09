export { sscal } from "./src/sscal/sscal.mjs";

/**
 * Initializes the WebGPU device.
 *
 * @param options.powerPreference - GPU power preference (default: "high-performance")
 * @param options.benchmark - enable GPU timestamp queries; BLAS functions return { result, gpuTimeMs } (default: false)
 */
export declare function init(options?: {
  powerPreference?: GPUPowerPreference;
  benchmark?: boolean;
}): Promise<string>;

/**
 * Destroys the WebGPU device. Call when done (required in Node.js to prevent crash on exit).
 */
export declare function cleanup(): void;
