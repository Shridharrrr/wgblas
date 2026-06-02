export function mergeF64(hi, lo) {
  if (hi.length !== lo.length) {
    throw new Error(`hi and lo length mismatch: ${hi.length} vs ${lo.length}`);
  }
  const result = new Float64Array(hi.length);
  for (let i = 0; i < hi.length; i++) {
    result[i] = hi[i] + lo[i];
  }
  return result;
}

export function splitF64(data) {
  if (!(data instanceof Float64Array)) {
    throw new Error("Expected a Float64Array.");
  }

  const hi = new Float32Array(data.length);
  const lo = new Float32Array(data.length);

  for (let i = 0; i < data.length; i++) {
    hi[i] = Math.fround(data[i]);
    lo[i] = data[i] - hi[i];
  }

  return { hi, lo };
}
