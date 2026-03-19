import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export interface TripImage {
  src: string;
  alt: string;
  caption?: string;
  blurDataURL?: string;
}

export interface Trip {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  location: string;
  description: string;
  coverSrc: string;
  coverAlt: string;
  coverBlurDataURL?: string;
  lat?: number;
  lng?: number;
  order?: number;
  images: TripImage[];
  rotation: number;
}

async function generateBlurDataURL(filePath: string): Promise<string | undefined> {
  try {
    const buffer = await sharp(filePath)
      .rotate()
      .resize(16, 12, { fit: 'cover' })
      .blur()
      .toBuffer();
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch {
    return undefined;
  }
}

function formatDate(date: string): string {
  const [year, month] = date.split('-');
  if (!month) return year;
  const d = new Date(Number(year), Number(month) - 1);
  return d.toLocaleDateString('en', { month: 'long', year: 'numeric' });
}

// Mulberry32 PRNG — returns a function that yields 0–1 floats from a seed
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  return hash;
}

/**
 * Reads all trips from public/travel/.
 * Each trip is a folder containing meta.json + image files.
 * To add a new trip, just create a folder in public/travel/ with a meta.json and images.
 */
export async function getAllTrips(): Promise<Trip[]> {
  const travelDir = path.join(process.cwd(), 'public/travel');
  const entries = await readdir(travelDir, { withFileTypes: true });

  const trips: Trip[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const slug = entry.name;
    const metaPath = path.join(travelDir, slug, 'meta.json');

    try {
      const raw = await readFile(metaPath, 'utf-8');
      const meta = JSON.parse(raw);

      const images: TripImage[] = await Promise.all(
        (meta.images ?? []).map(
          async (img: { file: string; alt: string; caption?: string }) => ({
            src: `/travel/${slug}/${img.file}`,
            alt: img.alt,
            caption: img.caption,
            blurDataURL: await generateBlurDataURL(
              path.join(travelDir, slug, img.file)
            ),
          })
        )
      );

      trips.push({
        slug,
        title: meta.title,
        date: meta.date,
        displayDate: formatDate(meta.date),
        location: meta.location,
        description: meta.description,
        coverSrc: images[0]?.src ?? '',
        coverAlt: images[0]?.alt ?? meta.title,
        coverBlurDataURL: images[0]?.blurDataURL,
        lat: meta.lat,
        lng: meta.lng,
        order: meta.order,
        images,
        rotation: 0, // assigned after sorting
      });
    } catch {
      // Skip folders without valid meta.json
    }
  }

  const sorted = trips.sort((a, b) => {
    // Sort by explicit order first (lower = first), then by date descending
    const orderA = a.order ?? Infinity;
    const orderB = b.order ?? Infinity;
    if (orderA !== orderB) return orderB - orderA;
    return b.date.localeCompare(a.date);
  });

  // Assign varied rotations: alternating sign guarantees visual scatter,
  // PRNG magnitude keeps each card's tilt unique
  sorted.forEach((trip, i) => {
    const rand = mulberry32(hashSlug(trip.slug));
    const isFeatured = i === 0;
    const maxDeg = isFeatured ? 3 : 7;
    const minDeg = isFeatured ? 0.5 : 1.5;
    const mag = minDeg + rand() * (maxDeg - minDeg);
    const sign = i % 2 === 0 ? 1 : -1;
    trip.rotation = Math.round(sign * mag * 10) / 10;
  });

  return sorted;
}
