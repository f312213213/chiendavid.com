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

  // Single trip — centered, no rotation, featured
  if (trips.length === 1) {
    return (
      <>
        <div className="flex justify-center max-w-md mx-auto">
          <PolaroidCard
            trip={trips[0]}
            onClick={() => setSelectedTrip(trips[0])}
            disableRotation
            featured
          />
        </div>
        <TripDetailDialog
          trip={selectedTrip}
          open={!!selectedTrip}
          onOpenChange={(open) => { if (!open) setSelectedTrip(null); }}
        />
      </>
    );
  }

  // Multiple trips — first card featured (spans 2 cols on desktop)
  const [featured, ...rest] = trips;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Featured first trip — larger */}
        <div className="sm:col-span-2 lg:col-span-2 relative">
          <PolaroidCard
            trip={featured}
            onClick={() => setSelectedTrip(featured)}
            featured
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
