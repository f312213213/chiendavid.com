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

  // Adapt layout based on trip count
  const gridClass = trips.length === 1
    ? 'flex justify-center max-w-sm mx-auto'
    : trips.length <= 3
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 max-w-2xl mx-auto'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10';

  return (
    <>
      <div className={gridClass}>
        {trips.map((trip) => (
          <div key={trip.slug} className="relative">
            <PolaroidCard
              trip={trip}
              onClick={() => setSelectedTrip(trip)}
              disableRotation={trips.length === 1}
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
