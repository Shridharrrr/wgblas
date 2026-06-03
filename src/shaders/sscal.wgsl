// sscal: x = alpha * x

@group(0) @binding(0) var<storage, read_write> x: array<f32>;

struct Params {
  n:     u32,
  alpha: f32,
  x_inc: u32,
}

@group(0) @binding(1) var<uniform> params: Params;

const WGS: u32 = 64;

@compute @workgroup_size(64)
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(num_workgroups) num_wg: vec3u,
) {
  let total = num_wg.x * WGS;
  var id = gid.x;

  loop {
    if id >= params.n { break; }
    x[id * params.x_inc] = params.alpha * x[id * params.x_inc];
    id += total;
  }
}
