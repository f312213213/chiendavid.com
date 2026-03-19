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
  title: string;
  coverSrc: string;
  coverBlur?: string;
  displayDate: string;
}

interface ClusterTrip {
  label: string;
  slug: string;
  title: string;
  coverSrc: string;
  coverBlur?: string;
  displayDate: string;
}

interface Cluster {
  x: number;
  y: number;
  count: number;
  trips: ClusterTrip[];
}

interface HeroDotMapProps {
  pins: HeroPin[];
  className?: string;
}

function pinToTrip(pin: HeroPin): ClusterTrip {
  return { label: pin.label, slug: pin.slug, title: pin.title, coverSrc: pin.coverSrc, coverBlur: pin.coverBlur, displayDate: pin.displayDate };
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
    const trips: ClusterTrip[] = [pinToTrip(pins[i])];
    used.add(i);

    for (let j = i + 1; j < projected.length; j++) {
      if (used.has(j)) continue;
      const cx = sx / trips.length;
      const cy = sy / trips.length;
      const dx = projected[j].x - cx;
      const dy = projected[j].y - cy;
      if (Math.sqrt(dx * dx + dy * dy) < threshold) {
        sx += projected[j].x;
        sy += projected[j].y;
        trips.push(pinToTrip(pins[j]));
        used.add(j);
      }
    }

    clusters.push({
      x: sx / trips.length,
      y: sy / trips.length,
      count: trips.length,
      trips,
    });
  }

  return clusters;
}

export default function HeroDotMap({ pins, className = '' }: HeroDotMapProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const hoverCountRef = useRef<Map<number, number>>(new Map());
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
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
        trips: [pinToTrip(p)],
      }));

  /** Enter a pin or tooltip — cancels any pending hide. */
  const handleEnter = useCallback((idx: number) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    // Only bump hover count when entering a *new* pin (not re-entering same via tooltip)
    if (idx !== hoveredIdx) {
      const prev = hoverCountRef.current.get(idx) ?? 0;
      hoverCountRef.current.set(idx, prev + 1);
    }
    setHoveredIdx(idx);
  }, [hoveredIdx]);

  /** Leave a pin or tooltip — short delay so mouse can cross the gap. */
  const handleLeave = useCallback(() => {
    leaveTimerRef.current = setTimeout(() => {
      setHoveredIdx(null);
    }, 120);
  }, []);

  /** Which trip to show for a given cluster (cycles each hover). */
  const getVisibleTrip = useCallback((idx: number, cluster: Cluster) => {
    const count = hoverCountRef.current.get(idx) ?? 0;
    return cluster.trips[count % cluster.trips.length];
  }, []);

  const handleClick = useCallback((idx: number, cluster: Cluster) => {
    const trip = getVisibleTrip(idx, cluster);
    const el = document.getElementById(`trip-${trip.slug}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('pin-highlight');
      setTimeout(() => el.classList.remove('pin-highlight'), 1200);
    }
  }, [getVisibleTrip]);

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
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              onClick={() => handleClick(i, c)}
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

      {/* HTML tooltip — mini polaroid preview */}
      {hoveredCluster && hoveredIdx !== null && (() => {
        const idx = hoveredIdx;
        const onLeft = hoveredCluster.x > W * 0.55;
        const pos = toPercent(hoveredCluster.x, hoveredCluster.y);
        const trip = getVisibleTrip(idx, hoveredCluster);
        const count = hoveredCluster.count;

        return (
          <div
            className="absolute"
            style={{
              ...pos,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          >
            {/* Connector line */}
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

            {/* Mini polaroid card — receives pointer events to persist hover */}
            <div
              className="absolute top-1/2 cursor-pointer"
              style={{
                pointerEvents: 'auto',
                ...(onLeft
                  ? { right: '50%', marginRight: 38 }
                  : { left: '50%', marginLeft: 38 }),
                transform: 'translateY(-50%)',
                animation: 'tooltip-tag 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '0.05s',
              }}
              onMouseEnter={() => handleEnter(idx)}
              onMouseLeave={handleLeave}
              onClick={() => handleClick(idx, hoveredCluster)}
            >
              <div
                className="relative"
                style={{ transform: `rotate(${onLeft ? -2 : 2}deg)` }}
              >
                {/* Accent edge */}
                <div
                  className="absolute top-0 bottom-0 w-[3px] bg-accent z-10"
                  style={onLeft ? { right: 0 } : { left: 0 }}
                />

                {/* Card body */}
                <div className="w-[180px] p-1.5 pb-0 bg-foreground/90 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-[3/2] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={trip.coverSrc}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.85)' }}
                    />
                    {/* Vignette */}
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]" />

                    {/* Trip count badge for clusters */}
                    {count > 1 && (
                      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-accent text-white text-[9px] font-bold tracking-wider">
                        +{count - 1}
                      </div>
                    )}
                  </div>

                  {/* Caption area */}
                  <div className="px-1 py-2">
                    <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-accent leading-none">
                      {trip.label}
                    </p>
                    <p className="text-[11px] font-semibold text-background mt-1 leading-tight truncate">
                      {trip.title}
                    </p>
                    <p className="text-[9px] text-background/40 mt-0.5 leading-none">
                      {trip.displayDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
