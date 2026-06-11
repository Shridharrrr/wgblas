import json
import numpy as np
from scipy.linalg.blas import saxpy as cblas_saxpy

rng = np.random.default_rng(42)
NUM_FIXTURES = 20

fixtures = []
for _ in range(NUM_FIXTURES):
    n     = int(rng.integers(100, 1000))
    alpha = float(np.float32(rng.uniform(-10, 10)))
    incx  = int(rng.integers(1, 5))
    incy  = int(rng.integers(1, 5))
    x     = rng.uniform(-10, 10, (n - 1) * incx + 1).astype(np.float32)
    y     = rng.uniform(-10, 10, (n - 1) * incy + 1).astype(np.float32)

    expected_y = cblas_saxpy(x.copy(), y.copy(), a=alpha, n=n, incx=incx, incy=incy)

    fixtures.append({
        "n":          n,
        "alpha":      alpha,
        "incx":       incx,
        "incy":       incy,
        "x":          x.tolist(),
        "y":          y.tolist(),
        "expected_y": expected_y.tolist(),
    })

with open("fixtures.json", "w") as f:
    json.dump(fixtures, f)
