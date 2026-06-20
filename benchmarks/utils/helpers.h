#pragma once
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/stat.h>
#include <cuda_runtime.h>

// sanitise GPU name for use as a directory name
static void get_gpu_model(char *dst, int maxlen) {
    struct cudaDeviceProp prop;
    cudaGetDeviceProperties(&prop, 0);
    int j = 0;
    for (int i = 0; prop.name[i] && j < maxlen - 1; i++) {
        char c = prop.name[i];
        if (c >= 'A' && c <= 'Z') c += 32;
        dst[j++] = (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') ? c : '-';
    }
    dst[j] = '\0';
}

static float *random_float_array(int n, float low, float high) {
    static int seeded = 0;
    if (!seeded) { srand((unsigned)time(NULL)); seeded = 1; }
    float *arr = malloc(n * sizeof(float));
    for (int i = 0; i < n; i++)
        arr[i] = low + (high - low) * ((float)rand() / RAND_MAX);
    return arr;
}

static int cmp_float(const void *a, const void *b) {
    float fa = *(const float *)a;
    float fb = *(const float *)b;
    return (fa > fb) - (fa < fb);
}

static void save_results(const char *routine, const char *gpu_model,
                         int *sizes, float *med_times, float *gbs_vals, int n) {
    char *gpu_dir, *out_dir, *file_path;
    asprintf(&gpu_dir,  "benchmarks/results/%s", gpu_model);
    asprintf(&out_dir,  "%s/cuda", gpu_dir);
    asprintf(&file_path, "benchmarks/results/%s/cuda/%s.json", gpu_model, routine);
    mkdir("benchmarks/results", 0755); // 0755: owner rwx
    mkdir(gpu_dir, 0755);
    mkdir(out_dir, 0755);
    FILE *fp = fopen(file_path, "w");
    fprintf(fp, "[\n");
    for (int i = 0; i < n; i++) {
        fprintf(fp, "  { \"n\": %d, \"compute_ms\": %.4f, \"compute_GBs\": %.4f }%s\n",
            sizes[i], med_times[i], gbs_vals[i], i < n - 1 ? "," : "");
    }
    fprintf(fp, "]\n");
    fclose(fp);
    free(gpu_dir);
    free(out_dir);
    free(file_path);
}

static float median(float *arr, int n) {
    float *tmp = malloc(n * sizeof(float));
    memcpy(tmp, arr, n * sizeof(float));
    qsort(tmp, n, sizeof(float), cmp_float);
    float m = (n % 2 == 0) ? (tmp[n / 2 - 1] + tmp[n / 2]) / 2.0f : tmp[n / 2];
    free(tmp);
    return m;
}
