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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {trips.map((trip) => (
          <div key={trip.slug} className="relative">
            <PolaroidCard trip={trip} onClick={() => setSelectedTrip(trip)} />
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
