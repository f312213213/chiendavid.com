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

  // Assign varied rotations: hash-driven sign and magnitude for organic scatter
  sorted.forEach((trip, i) => {
    const h = Math.abs(hashSlug(trip.slug + i));
    const h2 = Math.abs(hashSlug(trip.slug + 'rot'));
    const isFeatured = i === 0;
    const magnitude = isFeatured ? (h % 3) + 1 : (h % 9) + 1; // 1–3° for featured, 1–9° for rest
    const sign = h2 % 3 === 0 ? 1 : h2 % 3 === 1 ? -1 : (h % 2 === 0 ? 1 : -1);
    trip.rotation = sign * magnitude;
  });

  return sorted;
}
