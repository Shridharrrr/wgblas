import { getDevice } from "../init.mjs";
import { createReadBuffer, prepareBindGroupEntries, destroyBuffers } from "./buffer.mjs";
import { runComputePass } from "./compute.mjs";
import { extractResult } from "./result.mjs";

export async function dispatch(
  buffers,
  pipeline,
  workgroups,
  resultByteSize = 0,
  inPlaceBuffer = null,
  readbackType = Float32Array
) {
  const device = getDevice();

  // 1. Prepare bind group entries — creates result buffer if resultByteSize > 0
  const { entries, resultBuffer } = prepareBindGroupEntries(buffers, resultByteSize, pipeline.label);

  // 2. Bind group — auto-assign binding 0, 1, 2... by position
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries,
  });

  // 3. Encode compute pass — returns command encoder ready for submission
  const commandEncoder = runComputePass(pipeline, bindGroup, workgroups);

  // 4. Readback — multiple in-place buffers (e.g. sswap)
  if (Array.isArray(inPlaceBuffer)) {
    const readBuffers = inPlaceBuffer.map((buf) => createReadBuffer(buf, buf.size, commandEncoder));
    device.queue.submit([commandEncoder.finish()]);
    const results = await Promise.all(readBuffers.map((rb) => extractResult(rb, readbackType)));
    destroyBuffers(readBuffers, buffers);
    return results;
  }

  // 4. Readback — single buffer (separate result or single in-place)
  const sourceBuffer = resultByteSize > 0 ? resultBuffer : inPlaceBuffer;
  const readByteSize = resultByteSize > 0 ? resultByteSize : inPlaceBuffer.size;
  const readBuffer = createReadBuffer(sourceBuffer, readByteSize, commandEncoder);
  device.queue.submit([commandEncoder.finish()]);
  const result = await extractResult(readBuffer, readbackType);
  destroyBuffers(readBuffer, resultBuffer ?? [], buffers);
  return result;
}
