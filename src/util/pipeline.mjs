import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getDevice } from "../init.mjs";

const dir = dirname(fileURLToPath(import.meta.url));

export function loadShader(shaderName) {
  const device = getDevice();

  const code = readFileSync(join(dir, `../shaders/${shaderName}.wgsl`), "utf8");

  const shaderModule = device.createShaderModule({
    label: shaderName,
    code,
  });

  const pipeline = device.createComputePipeline({
    label: shaderName,
    layout: "auto",
    compute: { module: shaderModule },
  });

  return pipeline;
}
