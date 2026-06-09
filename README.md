# wgblas
`wgblas` is an initiative to implement all the standard level 1, 2, 3 BLAS functions on the top of webgpu. 

## Implementation checklist
- [x] sscal

## Requirements

- Node.js 18+

## Example usage

This package is not yet published to npm. Clone the repo and install it locally in your project:

```sh
git clone https://github.com/manit2004/wgblas.git
cd your-project
npm install /path/to/wgblas
```

### Example Code Snippet

```js
import { init, cleanup } from "wgblas";
import { sscal } from "wgblas/sscal";
import { randomFloat32Array } from "wgblas/util/random";

await init();

const n = 10;
const alpha = 2.0;
const x = randomFloat32Array(n, -10, 10);

console.log("before:", x);
const result = await sscal(n, alpha, x, 1);
console.log("after: ", result);
cleanup();
```

### Benchmark Mode

Pass `{ benchmark: true }` to `init()` to enable GPU timestamp queries — BLAS functions will then return `{ result, gpuTimeMs }` instead of just the result.

**Note:** Here `gpuTimeMs` is only the gpu compute time which doesn't include device to host and host to device transfer time duration.

```js
await init({ benchmark: true });
// ...
const { result, gpuTimeMs } = await sscal(n, alpha, x, 1);
console.log(`compute time: ${gpuTimeMs.toFixed(4)} ms`);
```