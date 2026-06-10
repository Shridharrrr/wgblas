import json
import numpy as np
from scipy.linalg.blas import sswap as cblas_sswap

rng = np.random.default_rng(42)
NUM_FIXTURES = 20

fixtures = []
for _ in range(NUM_FIXTURES):
    n    = int(rng.integers(100, 1000))
    incx = int(rng.integers(1, 5))
    incy = int(rng.integers(1, 5))
    x    = rng.uniform(-10, 10, (n - 1) * incx + 1).astype(np.float32)
    y    = rng.uniform(-10, 10, (n - 1) * incy + 1).astype(np.float32)

    result_x, result_y = cblas_sswap(x.copy(), y.copy(), n=n, incx=incx, incy=incy)

    fixtures.append({
        "n":         n,
        "incx":      incx,
        "incy":      incy,
        "x":         x.tolist(),
        "y":         y.tolist(),
        "expected_x": result_x.tolist(),
        "expected_y": result_y.tolist(),
    })

with open("fixtures.json", "w") as f:
    json.dump(fixtures, f)
