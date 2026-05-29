export async function extractResult(readBuffer, readbackType = Float32Array) {
  await readBuffer.mapAsync(GPUMapMode.READ);
  const result = new readbackType(readBuffer.getMappedRange().slice());
  readBuffer.unmap();
  return result;
}
