'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import type { Trip } from '@/lib/travel';
import PolaroidCard from './PolaroidCard';
import TripDetailDialog from './TripDetailDialog';

interface TravelGridProps {
  trips: Trip[];
  enableClientDialog?: boolean;
}

function slugFromPath() {
  if (typeof window === 'undefined') return null;
  const match = window.location.pathname.match(/^\/trip\/([^/]+)\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export default function TravelGrid({ trips, enableClientDialog = true }: TravelGridProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const modalHistoryDepth = useRef(0);

  useEffect(() => {
    if (!enableClientDialog) return;

    const syncFromLocation = () => {
      const nextSlug = slugFromPath();
      setSelectedSlug(nextSlug);
      if (!nextSlug) modalHistoryDepth.current = 0;
      else modalHistoryDepth.current = Math.max(0, modalHistoryDepth.current - 1);
    };

    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, [enableClientDialog]);

  const navigateTrip = useCallback((slug: string) => {
    if (!enableClientDialog) return;
    window.history.pushState({ tripSlug: slug }, '', `/trip/${slug}`);
    modalHistoryDepth.current += 1;
    setSelectedSlug(slug);
  }, [enableClientDialog]);

  const closeClientDialog = useCallback(() => {
    const depth = modalHistoryDepth.current;
    if (depth > 0) {
      window.history.go(-depth);
      return;
    }
    window.history.replaceState(null, '', '/');
    setSelectedSlug(null);
  }, []);

  const handleCardClick = useCallback((trip: Trip) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !enableClientDialog ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    navigateTrip(trip.slug);
  }, [enableClientDialog, navigateTrip]);

  if (trips.length === 0) {
    return (
      <p className="text-muted text-lg">
        No trips yet &mdash; the next adventure is coming.
      </p>
    );
  }

  const [featured, ...rest] = trips;
  const selectedTrip = enableClientDialog
    ? trips.find(trip => trip.slug === selectedSlug)
    : undefined;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 pt-4">
        <div id={`trip-${featured.slug}`} className={`relative ${rest.length > 0 ? 'md:col-span-2' : 'max-w-sm'}`}>
          <PolaroidCard
            trip={featured}
            href={`/trip/${featured.slug}`}
            featured={rest.length > 0}
            onNavigate={handleCardClick(featured)}
          />
        </div>
        {rest.map((trip) => (
          <div key={trip.slug} id={`trip-${trip.slug}`} className="relative">
            <PolaroidCard
              trip={trip}
              href={`/trip/${trip.slug}`}
              onNavigate={handleCardClick(trip)}
            />
          </div>
        ))}
      </div>

      {selectedTrip && (
        <TripDetailDialog
          trips={trips}
          trip={selectedTrip}
          closeBehavior="back"
          onNavigateTrip={navigateTrip}
          onClose={closeClientDialog}
        />
      )}
    </>
  );
}
