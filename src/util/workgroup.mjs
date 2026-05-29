const WORKGROUP_SIZE_1D = 64;
const WORKGROUP_SIZE_2D = 8;

export function calcWorkgroups(dim1, dim2) {
  if (dim2 === undefined) {
    return Math.ceil(dim1 / WORKGROUP_SIZE_1D);
  } else {
    return {
      x: Math.ceil(dim2 / WORKGROUP_SIZE_2D),
      y: Math.ceil(dim1 / WORKGROUP_SIZE_2D),
    };
  }
}
