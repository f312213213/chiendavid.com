'use client';

import { useState } from 'react';
import type { Trip } from '@/lib/travel';
import PolaroidCard from './PolaroidCard';
import TripDetailDialog from './TripDetailDialog';

interface TravelGridProps {
  trips: Trip[];
}

export default function TravelGrid({ trips }: TravelGridProps) {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  if (trips.length === 0) {
    return (
      <p className="text-muted text-lg">
        Nothing here yet &mdash; check back soon.
      </p>
    );
  }

  const [featured, ...rest] = trips;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className={`relative ${rest.length > 0 ? 'lg:col-span-2' : 'max-w-sm'}`}>
          <PolaroidCard
            trip={featured}
            onClick={() => setSelectedTrip(featured)}
            featured={rest.length > 0}
          />
        </div>
        {rest.map((trip) => (
          <div key={trip.slug} className="relative">
            <PolaroidCard
              trip={trip}
              onClick={() => setSelectedTrip(trip)}
            />
          </div>
        ))}
      </div>

      <TripDetailDialog
        trip={selectedTrip}
        open={!!selectedTrip}
        onOpenChange={(open) => { if (!open) setSelectedTrip(null); }}
      />
    </>
  );
}
