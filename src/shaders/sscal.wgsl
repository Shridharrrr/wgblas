// sscal: x = alpha * x
// Binding 0: x (read_write, float32 vector)

@group(0) @binding(0) var<storage, read_write> x: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  incx:  u32,
}

@group(0) @binding(1) var<uniform> params: Params;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  // TODO: implement
}
