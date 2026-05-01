import type { Trip } from '@/lib/travel';
import PolaroidCard from './PolaroidCard';

interface TravelGridProps {
  trips: Trip[];
}

export default function TravelGrid({ trips }: TravelGridProps) {
  if (trips.length === 0) {
    return (
      <p className="text-muted text-lg">
        No trips yet &mdash; the next adventure is coming.
      </p>
    );
  }

  const [featured, ...rest] = trips;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 pt-4">
      <div id={`trip-${featured.slug}`} className={`relative ${rest.length > 0 ? 'md:col-span-2' : 'max-w-sm'}`}>
        <PolaroidCard
          trip={featured}
          href={`/trip/${featured.slug}`}
          featured={rest.length > 0}
        />
      </div>
      {rest.map((trip) => (
        <div key={trip.slug} id={`trip-${trip.slug}`} className="relative">
          <PolaroidCard
            trip={trip}
            href={`/trip/${trip.slug}`}
          />
        </div>
      ))}
    </div>
  );
}
