#include <stdio.h>
#include <cuda_runtime.h>
#include <cublas_v2.h>
#include "../../utils/helpers.h"

#define WARMUP_ITERS 5
#define BENCH_ITERS  100

int main(void) {
    cublasHandle_t handle;
    cublasCreate(&handle);

    int sizes[] = { 32, 64, 128, 512, 1024, 4096, 16384, 65536, 262144, 1048576, 4194304, 16777216 };
    int num_sizes = (int)(sizeof(sizes) / sizeof(sizes[0]));

    printf("%-10s  %-12s  %-12s\n", "n", "compute_ms", "compute_GBs");
    printf("%-10s  %-12s  %-12s\n", "----------", "------------", "------------");

    for (int si = 0; si < num_sizes; si++) {
        int n = sizes[si];

        float *h_x = random_float_array(n, -1.0f, 1.0f);
        float *h_y = random_float_array(n, -1.0f, 1.0f);

        float *d_x, *d_y;
        cudaMalloc((void **)&d_x, n * sizeof(float));
        cudaMalloc((void **)&d_y, n * sizeof(float));
        cudaMemcpy(d_x, h_x, n * sizeof(float), cudaMemcpyHostToDevice);
        cudaMemcpy(d_y, h_y, n * sizeof(float), cudaMemcpyHostToDevice);

        cudaEvent_t start, stop;
        cudaEventCreate(&start);
        cudaEventCreate(&stop);

        // warm up
        for (int i = 0; i < WARMUP_ITERS; i++) {
            cublasScopy(handle, n, d_x, 1, d_y, 1);
        }
        cudaDeviceSynchronize();

        // compute-only: data already on GPU
        float compute_times[BENCH_ITERS];
        for (int i = 0; i < BENCH_ITERS; i++) {
            cudaEventRecord(start, 0);
            cublasScopy(handle, n, d_x, 1, d_y, 1);
            cudaEventRecord(stop, 0);
            cudaEventSynchronize(stop);
            cudaEventElapsedTime(&compute_times[i], start, stop);
        }

        float med_compute = median(compute_times, BENCH_ITERS);

        // throughput: x read + y written = 2 * n * 4 bytes
        float bytes = 2.0f * n * sizeof(float);
        float compute_gbs = (bytes / 1e9f) / (med_compute / 1e3f);

        printf("%-10d  %-12.4f  %-12.4f\n", n, med_compute, compute_gbs);

        cudaEventDestroy(start);
        cudaEventDestroy(stop);
        cudaFree(d_x);
        cudaFree(d_y);
        free(h_x);
        free(h_y);
    }

    cublasDestroy(handle);
    return 0;
}
