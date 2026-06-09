export function median(arr) {
  const sorted = arr.slice().sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function colWidth(label) {
  return Math.max(label.length + 2, 12);
}

export function printHeader(labels) {
  console.log(labels.map((l) => l.padEnd(colWidth(l))).join("  "));
  console.log(labels.map((l) => "-".repeat(colWidth(l))).join("  "));
}

export function printRow(labels, values) {
  console.log(labels.map((l, i) => {
    const v = values[i];
    const s = typeof v === "number" && !Number.isInteger(v) ? v.toFixed(4) : String(v);
    return s.padEnd(colWidth(l));
  }).join("  "));
}
