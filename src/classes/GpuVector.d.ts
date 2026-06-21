/**
 * Represents a Float32Array stored in GPU memory.
 */
export declare class GpuVector {
    /** Number of elements in the vector. */
    readonly length : number;

    /** Typed array constructor used when reading data back from the GPU. */
    readonly dtype : Float32ArrayConstructor;

    /**
     * Uploads a Float32Array to GPU memory.
     *
     * @param data - input vector data
     * @returns GpuVector backed by a GPU buffer
     */
    static from(data: Float32Array): GpuVector;

    /**
     * Reads the vector data back from GPU memory.
     *
     * @returns vector data as a Float32Array
     */
    read(): Promise<Float32Array>;

    /**
     * Destroys the underlying GPU buffer.
     */
    destroy(): void;
}
