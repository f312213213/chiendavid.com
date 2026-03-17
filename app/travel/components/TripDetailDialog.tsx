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
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (open) setCurrent(0);
  }, [open, trip?.slug]);

  const goTo = useCallback((next: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(next);
      setFading(false);
    }, 200);
  }, []);

  const prev = useCallback(() => {
    if (!trip) return;
    goTo((current - 1 + trip.images.length) % trip.images.length);
  }, [trip, current, goTo]);

  const next = useCallback(() => {
    if (!trip) return;
    goTo((current + 1) % trip.images.length);
  }, [trip, current, goTo]);

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
        <Dialog.Backdrop className="dialog-backdrop fixed inset-0 bg-black/85 z-50" />
        <Dialog.Popup className="dialog-popup fixed inset-0 md:inset-6 lg:inset-10 z-50 overflow-hidden flex flex-col md:flex-row bg-background border-0 md:border-2 border-border">

          {/* === Image panel — takes majority of space === */}
          <div className="relative flex-1 min-h-0 min-w-0 bg-background flex items-center justify-center overflow-hidden">

            {/* Nav arrows — overlaid on image */}
            {hasMultiple && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-muted hover:text-foreground transition-colors cursor-pointer select-none"
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4l-6 6 6 6"/></svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-muted hover:text-foreground transition-colors cursor-pointer select-none"
                  aria-label="Next image"
                >
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4l6 6-6 6"/></svg>
                </button>
              </>
            )}

            {/* Image */}
            <div className={`transition-opacity duration-200 ease-out absolute inset-0 flex items-center justify-center p-12 pb-20 ${fading ? 'opacity-0' : 'opacity-100'}`}>
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1200}
                sizes="(max-width: 768px) 100vw, 65vw"
                className="max-w-full max-h-full w-auto h-auto object-contain"
                priority={current === 0}
                loading={current === 0 ? 'eager' : 'lazy'}
              />
            </div>

            {/* Image indicators — bottom of image panel */}
            {hasMultiple && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <span className="text-xs font-semibold tracking-wider text-muted tabular-nums">
                  {current + 1} / {trip.images.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {trip.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`h-0.5 transition-all cursor-pointer ${
                        idx === current ? 'w-6 bg-accent' : 'w-3 bg-border hover:bg-muted'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* === Info sidebar === */}
          <div className="shrink-0 w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-border overflow-y-auto flex flex-col">

            {/* Close button */}
            <div className="flex justify-end p-4 shrink-0">
              <Dialog.Close className="w-10 h-10 flex items-center justify-center border-2 border-border text-muted hover:border-accent hover:text-accent transition-all cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13"/>
                </svg>
              </Dialog.Close>
            </div>

            {/* Trip info */}
            <div className="px-6 md:px-8 pb-8 flex-1">
              <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
                {trip.location}
              </p>
              <Dialog.Title className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {trip.title}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted mt-1">
                {trip.date}
              </Dialog.Description>

              {trip.description && (
                <p className="text-sm leading-relaxed text-muted mt-6 font-light break-words">
                  {trip.description}
                </p>
              )}

              {image.caption && (
                <p className="text-xs tracking-wide uppercase text-muted/60 mt-8 pt-4 border-t border-border">
                  {image.caption}
                </p>
              )}
            </div>
          </div>

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
