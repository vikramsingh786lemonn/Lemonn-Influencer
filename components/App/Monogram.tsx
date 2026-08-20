export function Monogram({ sym, size = 30 }: { sym: string; size?: number }) {
  let h = 0;
  for (let i = 0; i < sym.length; i++) h = (h * 31 + sym.charCodeAt(i)) % 360;

  return (
    <span
      className="ws-mono"
      aria-hidden
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${h} 62% 52%), hsl(${(h + 40) % 360} 64% 44%))`,
        fontSize: Math.round(size * 0.33),
      }}
    >
      {sym.slice(0, 3).toUpperCase()}
    </span>
  );
}
