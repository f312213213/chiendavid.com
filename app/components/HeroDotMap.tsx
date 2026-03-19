'use client';

import { useState, useCallback, useRef } from 'react';

/**
 * Interactive dot-matrix world map for the hero section.
 * Pins show HTML tooltips on hover and scroll to trip cards on click.
 */

// prettier-ignore
const MAP: string[] = [
  '..........................................................................................',
  '..........................................................................................',
  '.....................######.#############.........##................##....................',
  '..............#.#..##.........##########....................##......#####......##.........',
  '..............#####.#.####.....########...................#...#.#############...##........',
  '.################################################......#.#.....#..........................',
  '.....####################..##...###....##......###.#######################################',
  '...#####.############.....##..................####..################################.#....',
  '............###########...####.................##.#############################.....##....',
  '.............##################.............#.###################################...#.....',
  '..............###############.##............#####################################.........',
  '..............###############................###.###...##.#####################.#.........',
  '..............############.................##.....#.#####.###################.............',
  '...............###########...................###......#####################....#..........',
  '................#########..................######.#...#####################...............',
  '................#####...#.................###############.#################...............',
  '.................####....................#############.####...############................',
  '...................##.#..................#############.####....####.#####..#..............',
  '.....................###.................##############.##.....##....###..................',
  '.......................#...#.............###############........#......#..................',
  '.........................#####............################..................#.............',
  '..........................######...............##########............##..#................',
  '.........................#######...............#########..............#.##................',
  '.........................##########.............#######....................#...##.........',
  '.........................###########............#######..................#.....###........',
  '..........................##########............#######.......................#.#.........',
  '..........................#########.............#######.#...................###.#.........',
  '...........................########.............######..#..................#######........',
  '...........................######................#####..#................##########.......',
  '...........................######................####.....................#########.......',
  '...........................#####..................##......................###.#####.......',
  '...........................####.................................................###.....#.',
  '...........................##.............................................................',
  '...........................##..........................................................#..',
  '..........................###.............................................................',
  '..........................##..............................................................',
  '..........................................................................................',
  '..........................................................................................',
  '..........................................................................................',
  // Antarctica omitted
  '..........................................................................................',
  '..........................................................................................',
  '..........................................................................................',
  '..........................................................................................',
  '..........................................................................................',
  '..........................................................................................',
];

const ROWS = MAP.length;
const COLS = MAP[0].length;
const GAP = 2;
const W = COLS * GAP;
const H = ROWS * GAP;

export interface HeroPin {
  lat: number;
  lng: number;
  label: string;
  slug: string;
}

interface Cluster {
  x: number;
  y: number;
  count: number;
  labels: string[];
  slugs: string[];
}

interface HeroDotMapProps {
  pins: HeroPin[];
  className?: string;
}

/** Group projected pins within `threshold` SVG units. */
function clusterPins(
  pins: HeroPin[],
  projected: { x: number; y: number }[],
  threshold: number,
): Cluster[] {
  const used = new Set<number>();
  const clusters: Cluster[] = [];

  for (let i = 0; i < projected.length; i++) {
    if (used.has(i)) continue;
    let sx = projected[i].x;
    let sy = projected[i].y;
    const labels: string[] = [pins[i].label];
    const slugs: string[] = [pins[i].slug];
    used.add(i);

    for (let j = i + 1; j < projected.length; j++) {
      if (used.has(j)) continue;
      const cx = sx / labels.length;
      const cy = sy / labels.length;
      const dx = projected[j].x - cx;
      const dy = projected[j].y - cy;
      if (Math.sqrt(dx * dx + dy * dy) < threshold) {
        sx += projected[j].x;
        sy += projected[j].y;
        labels.push(pins[j].label);
        slugs.push(pins[j].slug);
        used.add(j);
      }
    }

    clusters.push({
      x: sx / labels.length,
      y: sy / labels.length,
      count: labels.length,
      labels,
      slugs,
    });
  }

  return clusters;
}

export default function HeroDotMap({ pins, className = '' }: HeroDotMapProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const projected = pins.map((pin) => ({
    x: ((pin.lng + 180) / 360) * COLS * GAP + GAP / 2,
    y: ((90 - pin.lat) / 180) * ROWS * GAP + GAP / 2,
  }));

  const clusters = pins.length > 1
    ? clusterPins(pins, projected, 8)
    : pins.map((p, i) => ({
        x: projected[i].x,
        y: projected[i].y,
        count: 1,
        labels: [p.label],
        slugs: [p.slug],
      }));

  const handleClick = useCallback((cluster: Cluster) => {
    const slug = cluster.slugs[0];
    const el = document.getElementById(`trip-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('pin-highlight');
      setTimeout(() => el.classList.remove('pin-highlight'), 1200);
    }
  }, []);

  // Convert SVG coords (0..W, 0..H) to percentage for HTML tooltip positioning
  const toPercent = (svgX: number, svgY: number) => ({
    left: `${(svgX / W) * 100}%`,
    top: `${(svgY / H) * 100}%`,
  });

  const hoveredCluster = hoveredIdx !== null ? clusters[hoveredIdx] : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Background layer: land dots — faded, non-interactive */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full opacity-30 pointer-events-none"
        aria-hidden="true"
        fill="currentColor"
      >
        {MAP.map((line, row) =>
          [...line].map((ch, col) =>
            ch === '#' ? (
              <circle
                key={`${row}-${col}`}
                cx={col * GAP + GAP / 2}
                cy={row * GAP + GAP / 2}
                r={0.6}
                opacity={0.18}
              />
            ) : null
          )
        )}
      </svg>

      {/* Foreground layer: interactive pins */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        fill="currentColor"
        style={{ pointerEvents: 'none' }}
      >
        {clusters.map((c, i) => {
          const isHovered = hoveredIdx === i;
          const outerR = 3.5 + Math.min(c.count - 1, 4) * 1.2;
          const innerR = 1.5 + Math.min(c.count - 1, 4) * 0.4;

          return (
            <g
              key={i}
              style={{ pointerEvents: 'auto', outline: 'none' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => handleClick(c)}
              className="cursor-pointer"
            >
              {/* Invisible hit area */}
              <circle
                cx={c.x} cy={c.y}
                r={Math.max(outerR + 4, 7)}
                fill="transparent"
              />

              {/* Outer glow */}
              <circle
                cx={c.x} cy={c.y}
                r={isHovered ? outerR + 2.5 : outerR}
                className="fill-accent pin-pulse"
                opacity={isHovered ? 0.4 : 0.22}
                style={{ transition: 'opacity 0.25s ease-out' }}
              />

              {/* Inner dot */}
              <circle
                cx={c.x} cy={c.y}
                r={isHovered ? innerR + 0.6 : innerR}
                className="fill-accent"
                style={{ transition: 'opacity 0.25s ease-out' }}
                opacity={isHovered ? 1 : 0.8}
              />
            </g>
          );
        })}
      </svg>

      {/* HTML tooltip — styled as a travel tag */}
      {hoveredCluster && (() => {
        const onLeft = hoveredCluster.x > W * 0.55;
        const pos = toPercent(hoveredCluster.x, hoveredCluster.y);
        const count = hoveredCluster.count;

        return (
          <div
            className="absolute pointer-events-none"
            style={{ ...pos, transform: 'translate(-50%, -50%)' }}
          >
            {/* Connector line from pin to tag */}
            <div
              className="absolute top-1/2 h-px bg-accent/50"
              style={{
                width: 28,
                ...(onLeft
                  ? { right: '50%', marginRight: 8 }
                  : { left: '50%', marginLeft: 8 }),
                transformOrigin: onLeft ? 'right center' : 'left center',
                animation: 'tooltip-line 0.2s ease-out both',
              }}
            />

            {/* Tag body */}
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                ...(onLeft
                  ? { right: '50%', marginRight: 38 }
                  : { left: '50%', marginLeft: 38 }),
                animation: 'tooltip-tag 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '0.05s',
              }}
            >
              <div
                className="relative whitespace-nowrap flex items-center gap-2"
                style={{ transform: `rotate(${onLeft ? -1.5 : 1.5}deg)` }}
              >
                {/* Accent edge — like a washi tape strip */}
                <div
                  className="absolute top-0 bottom-0 w-[3px] bg-accent"
                  style={onLeft ? { right: 0 } : { left: 0 }}
                />

                <div
                  className="px-3 py-1.5 bg-foreground/90 backdrop-blur-sm"
                  style={onLeft
                    ? { paddingRight: 12 }
                    : { paddingLeft: 12 }
                  }
                >
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-background leading-none">
                    {hoveredCluster.labels.join(' \u00B7 ')}
                  </p>
                  {count > 1 && (
                    <p className="text-[8px] tracking-[0.15em] uppercase text-background/50 mt-0.5 leading-none">
                      {count} trips
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
