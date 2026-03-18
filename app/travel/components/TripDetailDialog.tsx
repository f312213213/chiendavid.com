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

const SWIPE_THRESHOLD = 50;

export default function TripDetailDialog({ trip, open, onOpenChange }: TripDetailDialogProps) {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

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

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, prev, next]);

  // Swipe handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  }, [prev, next]);

  if (!trip) return null;

  const safeIndex = current < trip.images.length ? current : 0;
  const image = trip.images[safeIndex];
  const prevImage = previous !== null && previous < trip.images.length ? trip.images[previous] : null;
  const hasMultiple = trip.images.length > 1;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop fixed inset-0 bg-black/90 z-50" />
        <Dialog.Popup className="dialog-popup fixed inset-0 md:inset-8 lg:inset-12 z-50 overflow-hidden md:rounded-lg">

          {/* Close button — top-right of dialog, over the image */}
          <Dialog.Close className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:bg-black/50 hover:text-white transition-all cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </Dialog.Close>

          {/* Grid layout: stack on mobile, 1.8fr/1fr on desktop */}
          <div className="h-full flex flex-col md:grid md:grid-cols-[1.8fr_1fr] overflow-hidden">

            {/* === Image panel === */}
            <div
              className="relative h-[55vh] shrink-0 md:h-auto overflow-hidden bg-black"
              onTouchStart={hasMultiple ? onTouchStart : undefined}
              onTouchEnd={hasMultiple ? onTouchEnd : undefined}
            >
              {/* Blurred background fill for contain gaps — desktop only */}
              {image.blurDataURL && (
                <div
                  className="absolute inset-0 scale-110 hidden md:block bg-cover bg-center blur-[40px] saturate-[1.3] brightness-[0.35]"
                  style={{ backgroundImage: `url(${image.blurDataURL})` }}
                />
              )}

              {/* Nav arrows */}
              {hasMultiple && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 hidden md:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:bg-black/50 hover:text-white transition-all cursor-pointer select-none"
                    aria-label="Previous image"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4l-6 6 6 6"/></svg>
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 hidden md:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:bg-black/50 hover:text-white transition-all cursor-pointer select-none"
                    aria-label="Next image"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4l6 6-6 6"/></svg>
                  </button>
                </>
              )}

              {/* Crossfade: outgoing image */}
              {prevImage && (
                <div className="absolute inset-0 z-[2] animate-[fade-out_0.3s_ease-out_forwards]">
                  <Image
                    src={prevImage.src}
                    alt={prevImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 65vw"
                    className="object-cover md:object-contain"
                    {...(prevImage.blurDataURL
                      ? { placeholder: 'blur', blurDataURL: prevImage.blurDataURL }
                      : {})}
                  />
                </div>
              )}

              {/* Current image */}
              <div className={`absolute inset-0 z-[2] ${previous !== null ? 'animate-[fade-in_0.3s_ease-out_forwards]' : ''}`}>
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 65vw"
                  className="object-cover md:object-contain"
                  priority={current === 0}
                  loading={current === 0 ? 'eager' : 'lazy'}
                  {...(image.blurDataURL
                    ? { placeholder: 'blur', blurDataURL: image.blurDataURL }
                    : {})}
                />
              </div>

              {/* Dash indicators — no text counter */}
              {hasMultiple && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                  {trip.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className="py-2.5 cursor-pointer"
                      aria-label={`Go to image ${idx + 1}`}
                    >
                      <div className={`h-[3px] rounded-full transition-all duration-300 ${
                        idx === current ? 'w-6 bg-white' : 'w-6 bg-white/40 hover:bg-white/60'
                      }`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* === Content panel === */}
            <div className="relative flex-1 min-h-0 overflow-y-auto bg-background flex flex-col md:justify-center">
              {/* Grain overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.035] polaroid-grain" />

              <div className="px-8 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:px-10 md:py-10 lg:px-12 relative">
                <p className="text-[11px] font-normal tracking-[0.15em] uppercase text-muted mb-3">
                  {trip.location}
                </p>
                <Dialog.Title className="text-xl md:text-2xl font-semibold tracking-tight text-foreground leading-tight">
                  {trip.title}
                </Dialog.Title>
                <Dialog.Description className="text-[13px] text-muted/50 mt-1.5">
                  {trip.displayDate}
                </Dialog.Description>

                {/* Separator */}
                <div className="w-7 h-0.5 bg-current opacity-20 my-6" />

                {trip.description && (
                  <p className="text-[15px] leading-[1.7] text-muted break-words">
                    {trip.description}
                  </p>
                )}

                {image.caption && (
                  <p className="text-[13px] italic text-muted/50 mt-6">
                    {image.caption}
                  </p>
                )}
              </div>

              {/* Dot map pinned to bottom */}
              {trip.lat != null && trip.lng != null && (
                <div className="hidden md:block px-10 lg:px-12 pb-8 mt-auto relative">
                  <DotMap
                    lat={trip.lat}
                    lng={trip.lng}
                    className="w-full max-w-[180px] text-foreground/80"
                  />
                </div>
              )}
            </div>
          </div>

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
