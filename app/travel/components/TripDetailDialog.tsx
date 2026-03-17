'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Dialog } from '@base-ui-components/react/dialog';
import type { Trip } from '@/lib/travel';

interface TripDetailDialogProps {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TripDetailDialog({ trip, open, onOpenChange }: TripDetailDialogProps) {
  const [current, setCurrent] = useState(0);

  // Reset to first image when a new trip opens
  useEffect(() => {
    if (open) setCurrent(0);
  }, [open, trip?.slug]);

  const prev = useCallback(() => {
    if (!trip) return;
    setCurrent((c) => (c - 1 + trip.images.length) % trip.images.length);
  }, [trip]);

  const next = useCallback(() => {
    if (!trip) return;
    setCurrent((c) => (c + 1) % trip.images.length);
  }, [trip]);

  // Arrow key navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, prev, next]);

  if (!trip) return null;

  const image = trip.images[current];
  const hasMultiple = trip.images.length > 1;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Popup className="dialog-popup fixed inset-4 md:inset-y-12 md:inset-x-[20%] lg:inset-x-[25%] z-50 bg-background border-2 border-border overflow-y-auto flex flex-col">
          <div className="flex items-start justify-between p-6 md:p-8 border-b border-border">
            <div>
              <Dialog.Title className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {trip.title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted mt-1">
                {trip.location} &middot; {trip.date}
              </Dialog.Description>
            </div>
            <Dialog.Close className="text-muted hover:text-accent transition-colors text-2xl leading-none p-2 -m-2 cursor-pointer">
              &times;
            </Dialog.Close>
          </div>

          <div className="p-6 md:p-8 flex-1 flex flex-col">
            {trip.description && (
              <p className="text-base md:text-lg leading-relaxed text-muted max-w-2xl mb-8">
                {trip.description}
              </p>
            )}

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-full flex items-center justify-center">
                {hasMultiple && (
                  <button
                    onClick={prev}
                    className="absolute left-0 z-10 text-muted hover:text-foreground transition-colors text-3xl p-2 cursor-pointer select-none"
                    aria-label="Previous image"
                  >
                    &lsaquo;
                  </button>
                )}

                <figure className="flex flex-col items-center px-10">
                  <Image
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    width={1600}
                    height={1200}
                    sizes="(max-width: 768px) 80vw, 500px"
                    className="w-full h-auto max-h-[60vh] object-contain"
                    priority
                  />
                  {image.caption && (
                    <figcaption className="text-sm text-muted mt-3 text-center">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>

                {hasMultiple && (
                  <button
                    onClick={next}
                    className="absolute right-0 z-10 text-muted hover:text-foreground transition-colors text-3xl p-2 cursor-pointer select-none"
                    aria-label="Next image"
                  >
                    &rsaquo;
                  </button>
                )}
              </div>

              {hasMultiple && (
                <div className="flex items-center gap-2 mt-4">
                  {trip.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`w-2 h-2 transition-colors cursor-pointer ${
                        idx === current ? 'bg-accent' : 'bg-border hover:bg-muted'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
