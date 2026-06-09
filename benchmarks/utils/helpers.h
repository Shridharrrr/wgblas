#pragma once
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

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

static float median(float *arr, int n) {
    float *tmp = malloc(n * sizeof(float));
    memcpy(tmp, arr, n * sizeof(float));
    qsort(tmp, n, sizeof(float), cmp_float);
    float m = tmp[n / 2];
    free(tmp);
    return m;
}
