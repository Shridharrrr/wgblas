let _device = null;
let _adapter = null;
let _gpu = null; // keep wgpu Instance alive — GC'ing it invalidates adapter and device

const _resetCallbacks = [];

export function onCleanup(cb) {
  _resetCallbacks.push(cb);
}

export async function init({ powerPreference = "high-performance" } = {}) {
  if (_device) {
    return "WebGPU already initialized.";
  }

  let gpu;
  if (typeof window === "undefined" && typeof Deno === "undefined") {
    const { create, globals } = await import("webgpu");
    Object.assign(globalThis, globals);
    gpu = create([]);
    _gpu = gpu;
  } else {
    gpu = navigator.gpu;
  }

  if (!gpu) {
    throw new Error("WebGPU not supported in this environment.");
  }

  _adapter = await gpu.requestAdapter({ powerPreference }) ?? await gpu.requestAdapter();
  if (!_adapter) {
    throw new Error("No WebGPU adapter found.");
  }

  _device = await _adapter.requestDevice();
  _device.addEventListener("uncapturederror", (e) => {
    console.error("Uncaptured GPU error:", e.error.message);
  });

  return "WebGPU initialized successfully.";
}

export function cleanup() {
  if (_device) {
    _device.destroy();
    _device = null;
  }
  _adapter = null;
  _gpu = null;
  _resetCallbacks.forEach((cb) => cb());
}

export function getDevice() {
  if (!_device) {
    throw new Error("WebGPU device not initialized — call init() first.");
  }
  return _device;
}
