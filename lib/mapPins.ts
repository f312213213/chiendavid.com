export interface ProjectedPoint {
  x: number;
  y: number;
}

export interface ProjectedCluster extends ProjectedPoint {
  indices: number[];
}

/** Project latitude/longitude onto the map's equirectangular SVG bounds. */
export function projectLatLng(
  lat: number,
  lng: number,
  columns: number,
  rows: number,
  gap: number,
): ProjectedPoint {
  const boundedLat = Math.min(90, Math.max(-90, lat));
  const boundedLng = Math.min(180, Math.max(-180, lng));

  return {
    x: ((boundedLng + 180) / 360) * columns * gap,
    y: ((90 - boundedLat) / 180) * rows * gap,
  };
}

/**
 * Only combine pins that represent the same place. The map uses two SVG units
 * per grid cell, so this tolerance allows tiny coordinate differences without
 * collapsing neighbouring cities into a regional marker.
 */
export function clusterSamePlacePins(
  projected: ProjectedPoint[],
  threshold = 0.2,
): ProjectedCluster[] {
  const used = new Set<number>();
  const clusters: ProjectedCluster[] = [];

  for (let i = 0; i < projected.length; i++) {
    if (used.has(i)) continue;

    let sx = projected[i].x;
    let sy = projected[i].y;
    const indices = [i];
    used.add(i);

    for (let j = i + 1; j < projected.length; j++) {
      if (used.has(j)) continue;

      const cx = sx / indices.length;
      const cy = sy / indices.length;
      const dx = projected[j].x - cx;
      const dy = projected[j].y - cy;

      if (Math.hypot(dx, dy) <= threshold) {
        sx += projected[j].x;
        sy += projected[j].y;
        indices.push(j);
        used.add(j);
      }
    }

    clusters.push({
      x: sx / indices.length,
      y: sy / indices.length,
      indices,
    });
  }

  return clusters;
}
