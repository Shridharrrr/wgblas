export { sscal } from "./src/sscal/sscal.js";

/**
 * Initializes the WebGPU device.
 *
 * @param options.powerPreference - GPU power preference (default: "high-performance")
 */
export declare function init(options?: { powerPreference?: GPUPowerPreference }): Promise<string>;

/**
 * Destroys the WebGPU device. Call when done (required in Node.js to prevent crash on exit).
 */
export declare function cleanup(): void;
