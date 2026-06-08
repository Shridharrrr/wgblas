import { getDevice } from "../init.mjs";

export function submit(commandEncoder) {
  const device = getDevice();
  device.queue.submit([commandEncoder.finish()]);
}
import { beginTimestamp, resolveTimestamp } from "./benchmark.mjs";

export function runComputePass(pipeline, bindGroup, workgroups) {
  const device = getDevice();

  const { querySet, passDescriptor } = beginTimestamp();

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass(passDescriptor);

  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);

  if (typeof workgroups === "number") {
    passEncoder.dispatchWorkgroups(workgroups);
  } else {
    passEncoder.dispatchWorkgroups(workgroups.x, workgroups.y);
  }

  passEncoder.end();

  const ts = resolveTimestamp(commandEncoder, querySet);

  commandEncoder._passEncoder = passEncoder; // anchor — GC'd passEncoder may crash native encoder

  return { commandEncoder, ts };
}
