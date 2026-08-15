/**
 * Dot-matrix world map with a highlighted location pin.
 * Static (server-safe) variant used in polaroid cards and trip dialogs.
 */

import { MAP, ROWS, COLS } from '@/lib/dotmap';
import { clusterSamePlacePins, projectLatLng } from '@/lib/mapPins';

interface DotMapProps {
  lat?: number;
  lng?: number;
  pins?: { lat: number; lng: number }[];
  className?: string;
}

export default function DotMap({ lat, lng, pins, className = '' }: DotMapProps) {
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
  const projected = allPins.map((pin) =>
    projectLatLng(pin.lat, pin.lng, COLS, ROWS, gap)
  );

  const samePlaceClusters = clusterSamePlacePins(projected).map((cluster) => ({
    x: cluster.x,
    y: cluster.y,
    count: cluster.indices.length,
  }));
  const clusters = samePlaceClusters;

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
              className="fill-accent"
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
