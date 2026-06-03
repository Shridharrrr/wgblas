import { getDevice } from "../init.mjs";

export function destroyBuffers(...buffers) {
  buffers.flat().forEach((b) => b.destroy());
}

export async function uploadBuffer(data, byteSize, label = "blas-input", readback = false) {
  if (!(data instanceof Float32Array)) {
    throw new Error("Expected a Float32Array.");
  }
  if (data.byteLength !== byteSize) {
    throw new Error(`Array size mismatch: expected ${byteSize} bytes, got ${data.byteLength}.`);
  }

  const device = getDevice();

  const maxSize = device.limits.maxStorageBufferBindingSize;
  if (byteSize > maxSize) {
    throw new Error(`Buffer size ${byteSize} bytes exceeds device limit of ${maxSize} bytes.`);
  }

  const usage = readback
    ? GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    : GPUBufferUsage.STORAGE;

  device.pushErrorScope("out-of-memory");

  const buffer = device.createBuffer({
    label,
    size: byteSize,
    usage,
    mappedAtCreation: true,
  });

  const mappedArray = new Float32Array(buffer.getMappedRange());
  mappedArray.set(data);
  buffer.unmap();

  const error = await device.popErrorScope();
  if (error) {
    throw new Error(`GPU out of memory allocating ${byteSize} bytes.`);
  }

  return buffer;
}

export function prepareBindGroupEntries(buffers, resultByteSize, pipelineLabel) {
  let resultBuffer = null;
  let allBuffers = [...buffers];

  if (resultByteSize > 0) {
    const device = getDevice();
    resultBuffer = device.createBuffer({
      label: `${pipelineLabel}-result`,
      size: resultByteSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });
    allBuffers = [...buffers, resultBuffer];
  }

  const entries = allBuffers.map((buffer, i) => ({
    binding: i,
    resource: { buffer },
  }));

  return { entries, resultBuffer };
}

export function createReadBuffer(resultBuffer, byteSize, commandEncoder) {
  const device = getDevice();

  const readBuffer = device.createBuffer({
    label: "blas-readback",
    size: byteSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  commandEncoder.copyBufferToBuffer(resultBuffer, 0, readBuffer, 0, byteSize);

  return readBuffer;
}

export async function createParamsBuffer(params, label = "blas-params") {
  const device = getDevice();

  const rawSize = params.length * 4;
  const size = Math.ceil(rawSize / 16) * 16;

  const arrayBuffer = new ArrayBuffer(size);
  const view = new DataView(arrayBuffer);

  params.forEach(({ value, type }, i) => {
    const offset = i * 4;
    if (type === "u32") {
      view.setUint32(offset, value, true);
    } else if (type === "i32") {
      view.setInt32(offset, value, true);
    } else if (type === "f32") {
      view.setFloat32(offset, value, true);
    } else {
      throw new Error(`Unknown param type "${type}". Use "f32", "u32", or "i32".`);
    }
  });

  device.pushErrorScope("out-of-memory");

  const buffer = device.createBuffer({
    label,
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(buffer, 0, arrayBuffer);

  const error = await device.popErrorScope();
  if (error) {
    throw new Error(`GPU out of memory allocating params buffer.`);
  }

  return buffer;
}