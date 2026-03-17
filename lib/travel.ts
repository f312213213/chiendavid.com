import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export interface TripImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Trip {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  coverSrc: string;
  coverAlt: string;
  images: TripImage[];
  rotation: number;
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

      const images: TripImage[] = (meta.images ?? []).map(
        (img: { file: string; alt: string; caption?: string }) => ({
          src: `/travel/${slug}/${img.file}`,
          alt: img.alt,
          caption: img.caption,
        })
      );

      const rotation = (hashSlug(slug) % 9) - 4; // -4 to +4 degrees

      trips.push({
        slug,
        title: meta.title,
        date: meta.date,
        location: meta.location,
        description: meta.description,
        coverSrc: images[0]?.src ?? '',
        coverAlt: images[0]?.alt ?? meta.title,
        images,
        rotation,
      });
    } catch {
      // Skip folders without valid meta.json
    }
  }

  return trips.sort((a, b) => b.date.localeCompare(a.date));
}
