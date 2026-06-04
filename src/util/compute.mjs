import { getDevice } from "../init.mjs";

export function runComputePass(pipeline, bindGroup, workgroups) {
  const device = getDevice();

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();

  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);

  if (typeof workgroups === "number") {
    passEncoder.dispatchWorkgroups(workgroups);
  } else {
    passEncoder.dispatchWorkgroups(workgroups.x, workgroups.y);
  }

  passEncoder.end();

  commandEncoder._passEncoder = passEncoder; // anchor — GC'd passEncoder may crash native encoder

  return commandEncoder;
}
