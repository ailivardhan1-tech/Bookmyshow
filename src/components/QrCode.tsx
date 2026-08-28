/** Deterministic decorative QR-style matrix generated from a booking reference. */
export function QrCode({ value, size = 168 }: { value: string; size?: number }) {
  const n = 21;
  let seed = 0;
  for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) % 100000;

  const isFinder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) =>
      r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    return inBox(0, 0) || inBox(0, n - 7) || inBox(n - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const lr = r < 7 ? r : r - (n - 7);
    const lc = c < 7 ? c : c - (n - 7);
    const edge = lr === 0 || lr === 6 || lc === 0 || lc === 6;
    const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
    return edge || core;
  };

  const cells: boolean[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (isFinder(r, c)) {
        cells.push(finderOn(r, c));
      } else {
        seed = (seed * 1103515245 + 12345 + r * 7 + c * 13) % 2147483648;
        cells.push((seed >> 8) % 3 !== 0);
      }
    }
  }

  return (
    <div
      role="img"
      aria-label={`QR code for booking ${value}`}
      className="grid rounded-xl bg-white p-2"
      style={{ width: size, height: size, gridTemplateColumns: `repeat(${n}, 1fr)` }}
    >
      {cells.map((on, i) => (
        <div key={i} style={{ background: on ? "#0F172A" : "transparent" }} />
      ))}
    </div>
  );
}

export function Barcode({ value }: { value: string }) {
  const bars = Array.from({ length: 60 }, (_, i) => {
    const code = value.charCodeAt(i % value.length) + i * 7;
    return (code % 4) + 1;
  });
  return (
    <div
      role="img"
      aria-label={`Barcode ${value}`}
      className="flex h-12 items-end gap-[2px] rounded-lg bg-white px-3 py-2"
    >
      {bars.map((w, i) => (
        <div key={i} style={{ width: w, background: "#0F172A" }} className="h-full" />
      ))}
    </div>
  );
}
