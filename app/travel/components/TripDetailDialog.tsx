'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Dialog } from '@base-ui-components/react/dialog';
import type { Trip } from '@/lib/travel';
import DotMap from './DotMap';

interface TripDetailDialogProps {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TripDetailDialog({ trip, open, onOpenChange }: TripDetailDialogProps) {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (open) {
      setCurrent(0);
      setPrevious(null);
    }
  }, [open, trip?.slug]);

  const goTo = useCallback((next: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPrevious(current);
    setCurrent(next);
    timeoutRef.current = setTimeout(() => setPrevious(null), 300);
  }, [current]);

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
  const prevImage = previous !== null ? trip.images[previous] : null;
  const hasMultiple = trip.images.length > 1;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop fixed inset-0 bg-black/85 z-50" />
        <Dialog.Popup className="dialog-popup fixed inset-0 md:inset-6 lg:inset-10 z-50 overflow-hidden flex flex-col md:flex-row bg-background border-0 md:border-2 border-border">

          {/* === Image panel === */}
          <div className="relative flex-1 min-h-0 min-w-0 bg-background flex items-center justify-center overflow-hidden">

            {/* Nav arrows with backdrop for visibility */}
            {hasMultiple && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm text-muted hover:text-foreground hover:bg-background/80 transition-all cursor-pointer select-none"
                  aria-label="Previous image"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4l-6 6 6 6"/></svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm text-muted hover:text-foreground hover:bg-background/80 transition-all cursor-pointer select-none"
                  aria-label="Next image"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4l6 6-6 6"/></svg>
                </button>
              </>
            )}

            {/* Crossfade: outgoing image */}
            {prevImage && (
              <div className="absolute inset-0 flex items-center justify-center p-12 pb-20 animate-[fade-out_0.3s_ease-out_forwards]">
                <Image
                  src={prevImage.src}
                  alt={prevImage.alt}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 768px) 100vw, 65vw"
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                  {...(prevImage.blurDataURL
                    ? { placeholder: 'blur', blurDataURL: prevImage.blurDataURL }
                    : {})}
                />
              </div>
            )}

            {/* Current image */}
            <div className={`absolute inset-0 flex items-center justify-center p-12 pb-20 ${previous !== null ? 'animate-[fade-in_0.3s_ease-out_forwards]' : ''}`}>
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
                {...(image.blurDataURL
                  ? { placeholder: 'blur', blurDataURL: image.blurDataURL }
                  : {})}
              />
            </div>

            {/* Image indicators with better touch targets */}
            {hasMultiple && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <span className="text-xs font-semibold tracking-wider text-muted tabular-nums">
                  {current + 1} / {trip.images.length}
                </span>
                <div className="flex items-center">
                  {trip.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className="py-3 px-1 cursor-pointer"
                      aria-label={`Go to image ${idx + 1}`}
                    >
                      <div className={`h-0.5 transition-all ${
                        idx === current ? 'w-6 bg-accent' : 'w-3 bg-border hover:bg-muted'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* === Info sidebar with texture === */}
          <div className="shrink-0 w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-border overflow-y-auto flex flex-col relative">
            {/* Grain overlay to match polaroid cards */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.035] polaroid-grain" />

            {/* Close button */}
            <div className="flex justify-end p-4 shrink-0 relative">
              <Dialog.Close className="w-10 h-10 flex items-center justify-center border-2 border-border text-muted hover:border-accent hover:text-accent transition-all cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13"/>
                </svg>
              </Dialog.Close>
            </div>

            {/* Trip info */}
            <div className="px-6 md:px-8 pb-8 flex-1 relative">
              <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">
                {trip.location}
              </p>
              <Dialog.Title className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {trip.title}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted mt-1">
                {trip.displayDate}
              </Dialog.Description>

              <div className="w-12 h-0.5 bg-accent mt-6" />

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

            {/* Dot map pinned to bottom */}
            {trip.lat != null && trip.lng != null && (
              <div className="px-6 md:px-8 pb-6 mt-auto relative">
                <DotMap
                  lat={trip.lat}
                  lng={trip.lng}
                  className="w-full text-foreground"
                />
              </div>
            )}
          </div>

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
