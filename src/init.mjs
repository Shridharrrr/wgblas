import { create, globals } from "webgpu";

Object.assign(globalThis, globals);

let _device = null;
let _adapter = null;

export async function init({ powerPreference = "high-performance" } = {}) {
  if (_device) {
    return "WebGPU already initialized.";
  }

  const navigator = { gpu: create([]) };
  if (!navigator.gpu) {
    throw new Error("WebGPU not supported in this environment.");
  }

  _adapter = await navigator.gpu.requestAdapter({ powerPreference });
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
}

export function getDevice() {
  if (!_device) {
    throw new Error("WebGPU device not initialized — call init() first.");
  }
  return _device;
}
