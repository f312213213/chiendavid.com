/**
 * Dot-matrix world map with a highlighted location pin.
 * Static (server-safe) variant used in polaroid cards and trip dialogs.
 */

import { MAP, ROWS, COLS } from '@/lib/dotmap';

interface DotMapProps {
  lat?: number;
  lng?: number;
  pins?: { lat: number; lng: number }[];
  pulse?: boolean;
  className?: string;
}

interface Cluster {
  x: number;
  y: number;
  count: number;
}

/** Group projected pins that are within `threshold` SVG units. */
function clusterPins(
  projected: { x: number; y: number }[],
  threshold: number,
): Cluster[] {
  const used = new Set<number>();
  const clusters: Cluster[] = [];

  for (let i = 0; i < projected.length; i++) {
    if (used.has(i)) continue;
    let sx = projected[i].x;
    let sy = projected[i].y;
    let count = 1;
    used.add(i);

    for (let j = i + 1; j < projected.length; j++) {
      if (used.has(j)) continue;
      const dx = projected[j].x - sx / count;
      const dy = projected[j].y - sy / count;
      if (Math.sqrt(dx * dx + dy * dy) < threshold) {
        sx += projected[j].x;
        sy += projected[j].y;
        count++;
        used.add(j);
      }
    }

    clusters.push({ x: sx / count, y: sy / count, count });
  }

  return clusters;
}

export default function DotMap({ lat, lng, pins, pulse, className = '' }: DotMapProps) {
  const gap = 2;
  const r = 0.6;
  const w = COLS * gap;
  const h = ROWS * gap;

  // Build pin list from either single lat/lng or pins array
  const allPins = pins
    ? pins
    : lat != null && lng != null
      ? [{ lat, lng }]
      : [];

  // Project to SVG coordinates
  const projected = allPins.map((pin) => ({
    x: ((pin.lng + 180) / 360) * COLS * gap + gap / 2,
    y: ((90 - pin.lat) / 180) * ROWS * gap + gap / 2,
  }));

  // Cluster pins that are too close (threshold ~8 SVG units ≈ 4 grid cells)
  const clusters = allPins.length > 1
    ? clusterPins(projected, 8)
    : projected.map((p) => ({ ...p, count: 1 }));

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      {MAP.map((line, row) =>
        [...line].map((ch, col) =>
          ch === '#' ? (
            <circle
              key={`${row}-${col}`}
              cx={col * gap + gap / 2}
              cy={row * gap + gap / 2}
              r={r}
              opacity={0.18}
            />
          ) : null
        )
      )}
      {clusters.map((c, i) => {
        // Scale pin size based on cluster count
        const outerR = 3.5 + Math.min(c.count - 1, 4) * 1.2;
        const innerR = 1.5 + Math.min(c.count - 1, 4) * 0.4;
        return (
          <g key={i}>
            <circle
              cx={c.x} cy={c.y}
              r={outerR}
              className={`fill-accent ${pulse ? 'pin-pulse' : ''}`}
              opacity={0.22}
            />
            <circle
              cx={c.x} cy={c.y}
              r={innerR}
              className="fill-accent"
            />
          </g>
        );
      })}
    </svg>
  );
}
