import json
import numpy as np
from scipy.linalg.blas import sscal as cblas_sscal

rng = np.random.default_rng(42)
NUM_FIXTURES = 20

fixtures = []
for _ in range(NUM_FIXTURES):
    n     = int(rng.integers(100, 1000))
    alpha = float(np.float32(rng.uniform(-10, 10)))
    incx  = int(rng.integers(1, 5))
    x     = rng.uniform(-10, 10, (n - 1) * incx + 1).astype(np.float32)

    expected = cblas_sscal(alpha, x.copy(), n=n, incx=incx)

    fixtures.append({
        "n":        n,
        "alpha":    alpha,
        "incx":     incx,
        "x":        x.tolist(),
        "expected": expected.tolist(),
    })

with open("fixtures.json", "w") as f:
    json.dump(fixtures, f)
