import { getDevice } from "../init.mjs";

const WORKGROUP_SIZE_1D = 64;
const WORKGROUP_SIZE_2D = 8;

export function calcWorkgroups(dim1, dim2) {
  const max = getDevice().limits.maxComputeWorkgroupsPerDimension;
  if (dim2 === undefined) {
    return Math.min(Math.ceil(dim1 / WORKGROUP_SIZE_1D), max);
  } else {
    return {
      x: Math.min(Math.ceil(dim2 / WORKGROUP_SIZE_2D), max),
      y: Math.min(Math.ceil(dim1 / WORKGROUP_SIZE_2D), max),
    };
  }
}
