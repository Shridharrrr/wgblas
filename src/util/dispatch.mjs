import { getDevice } from "../init.mjs";
import { createReadBuffer, prepareBindGroupEntries, destroyBuffers } from "./buffer.mjs";
import { runComputePass } from "./compute.mjs";
import { extractTimestamp } from "./benchmark.mjs";
import { extractResult } from "./result.mjs";

// keeps Dawn objects alive across await points — GC'd wrappers crash native code
const _live = [];

export async function dispatch(
  buffers,
  pipeline,
  workgroups,
  resultByteSize = 0,
  inPlaceBuffer = null,
  readbackType = Float32Array
) {
  const device = getDevice();

  // 1. Prepare bind group entries
  const { entries, resultBuffer } = prepareBindGroupEntries(buffers, resultByteSize, pipeline.label);

  // 2. Bind group
  const bindGroupLayout = pipeline.getBindGroupLayout(0);
  const bindGroup = device.createBindGroup({ layout: bindGroupLayout, entries });

  // 3. Encode compute pass
  const { commandEncoder, ts } = runComputePass(pipeline, bindGroup, workgroups);

  // 4. Readback — multiple in-place buffers (e.g. sswap)
  if (Array.isArray(inPlaceBuffer)) {
    const readBuffers = inPlaceBuffer.map((buf) => createReadBuffer(buf, buf.size, commandEncoder));
    const commandBuffer = commandEncoder.finish();
    device.queue.submit([commandBuffer]);

    _live.push(bindGroup, commandEncoder, commandBuffer, bindGroupLayout, ...readBuffers, ...buffers);
    if (ts) _live.push(ts);

    try {
      const results = await Promise.all(readBuffers.map((rb) => extractResult(rb, readbackType)));
      destroyBuffers(readBuffers, buffers);
      const gpuTimeMs = await extractTimestamp(ts);
      if (gpuTimeMs !== undefined) return { result: results, gpuTimeMs };
      return results;
    } finally {
      _live.length = 0;
    }
  }

  // 4. Readback — single buffer (separate result or single in-place)
  const sourceBuffer = resultByteSize > 0 ? resultBuffer : inPlaceBuffer;
  const readByteSize = resultByteSize > 0 ? resultByteSize : inPlaceBuffer.size;
  const readBuffer = createReadBuffer(sourceBuffer, readByteSize, commandEncoder);
  const commandBuffer = commandEncoder.finish();
  device.queue.submit([commandBuffer]);
  const extra = resultBuffer ? [resultBuffer] : [];

  _live.push(bindGroup, commandEncoder, commandBuffer, bindGroupLayout, readBuffer, ...buffers, ...extra);
  if (ts) _live.push(ts);

  try {
    const result = await extractResult(readBuffer, readbackType);
    destroyBuffers(readBuffer, buffers, ...extra);
    const gpuTimeMs = await extractTimestamp(ts);
    if (gpuTimeMs !== undefined) return { result, gpuTimeMs };
    return result;
  } finally {
    _live.length = 0;
  }
}
