import json
import numpy as np
from scipy.linalg.blas import sdot as cblas_sdot

rng = np.random.default_rng(42)
NUM_FIXTURES = 20

fixtures = []
for _ in range(NUM_FIXTURES):
    n    = int(rng.integers(100, 1000))
    incx = int(rng.integers(1, 5))
    incy = int(rng.integers(1, 5))
    x    = rng.uniform(-10, 10, (n - 1) * incx + 1).astype(np.float32)
    y    = rng.uniform(-10, 10, (n - 1) * incy + 1).astype(np.float32)

    expected_dot = float(cblas_sdot(x, y, n=n, incx=incx, incy=incy))

    fixtures.append({
        "n":            n,
        "incx":         incx,
        "incy":         incy,
        "x":            x.tolist(),
        "y":            y.tolist(),
        "expected_dot": expected_dot,
    })

with open("fixtures.json", "w") as f:
    json.dump(fixtures, f)