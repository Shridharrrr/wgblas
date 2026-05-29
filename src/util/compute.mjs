import { getDevice } from "../init.mjs";

export function runComputePass(pipeline, bindGroup, workgroups) {
  const device = getDevice();

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();

  passEncoder.pushDebugGroup(pipeline.label);
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);

  if (typeof workgroups === "number") {
    passEncoder.dispatchWorkgroups(workgroups);
  } else {
    passEncoder.dispatchWorkgroups(workgroups.x, workgroups.y);
  }

  passEncoder.popDebugGroup();
  passEncoder.end();

  return commandEncoder;
}
