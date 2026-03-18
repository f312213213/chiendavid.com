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

    // Only swipe if horizontal movement is dominant
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

  // Preload next image
  const nextIdx = (safeIndex + 1) % trip.images.length;
  const nextImage = hasMultiple ? trip.images[nextIdx] : null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="dialog-backdrop fixed inset-0 bg-black/90 z-50" />
        <Dialog.Popup className="dialog-popup fixed inset-0 z-50 overflow-hidden flex flex-col md:flex-row bg-background">

          {/* === Image panel === */}
          <div
            className="relative flex-1 min-h-0 min-w-0 bg-black flex items-center justify-center overflow-hidden"
            onTouchStart={hasMultiple ? onTouchStart : undefined}
            onTouchEnd={hasMultiple ? onTouchEnd : undefined}
          >

            {/* Blurred background fill — photo's own colors instead of dead black */}
            {image.blurDataURL && (
              <div
                className="absolute inset-0 scale-110"
                style={{
                  backgroundImage: `url(${image.blurDataURL})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(40px) saturate(1.3) brightness(0.35)',
                }}
              />
            )}

            {/* Vignette for depth + indicator readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none z-[1]" />

            {/* Nav arrows */}
            {hasMultiple && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 hidden md:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:bg-black/50 hover:text-white transition-all cursor-pointer select-none"
                  aria-label="Previous image"
                >
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4l-6 6 6 6"/></svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 hidden md:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:bg-black/50 hover:text-white transition-all cursor-pointer select-none"
                  aria-label="Next image"
                >
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4l6 6-6 6"/></svg>
                </button>
              </>
            )}

            {/* Crossfade: outgoing image */}
            {prevImage && (
              <div className="absolute inset-0 flex items-center justify-center p-4 pb-14 md:p-8 md:pb-16 z-[2] animate-[fade-out_0.3s_ease-out_forwards]">
                <Image
                  src={prevImage.src}
                  alt={prevImage.alt}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                  {...(prevImage.blurDataURL
                    ? { placeholder: 'blur', blurDataURL: prevImage.blurDataURL }
                    : {})}
                />
              </div>
            )}

            {/* Current image */}
            <div className={`absolute inset-0 flex items-center justify-center p-4 pb-14 md:p-8 md:pb-16 z-[2] ${previous !== null ? 'animate-[fade-in_0.3s_ease-out_forwards]' : ''}`}>
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1200}
                sizes="(max-width: 768px) 100vw, 70vw"
                className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                priority={current === 0}
                loading={current === 0 ? 'eager' : 'lazy'}
                {...(image.blurDataURL
                  ? { placeholder: 'blur', blurDataURL: image.blurDataURL }
                  : {})}
              />
            </div>

            {/* Preload next image (hidden) */}
            {nextImage && nextIdx !== current && (
              <link rel="preload" as="image" href={nextImage.src} />
            )}

            {/* Image indicators */}
            {hasMultiple && (
              <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
                <span className="text-[11px] font-bold tracking-[0.2em] text-white/50 tabular-nums">
                  {current + 1} / {trip.images.length}
                </span>
                <div className="flex items-center gap-1">
                  {trip.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className="py-3 px-0.5 cursor-pointer"
                      aria-label={`Go to image ${idx + 1}`}
                    >
                      <div className={`h-[3px] transition-all duration-300 ${
                        idx === current ? 'w-8 bg-accent' : 'w-4 bg-white/20 hover:bg-white/40'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* === Info sidebar with texture === */}
          <div className="shrink-0 w-full md:w-[340px] lg:w-[420px] border-t md:border-t-0 md:border-l border-border overflow-y-auto flex flex-col relative">
            {/* Grain overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.035] polaroid-grain" />

            {/* Close button */}
            <div className="flex justify-end p-5 shrink-0 relative">
              <Dialog.Close className="w-9 h-9 flex items-center justify-center text-muted/50 hover:text-foreground transition-colors cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 3l10 10M13 3L3 13"/>
                </svg>
              </Dialog.Close>
            </div>

            {/* Trip info */}
            <div className="px-7 md:px-10 pb-10 flex-1 relative">
              <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent mb-3">
                {trip.location}
              </p>
              <Dialog.Title className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                {trip.title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted/60 mt-2 font-light tracking-wide">
                {trip.displayDate}
              </Dialog.Description>

              <div className="w-16 h-1 bg-accent mt-8" />

              {trip.description && (
                <p className="text-[15px] leading-[1.7] text-muted mt-8 break-words">
                  {trip.description}
                </p>
              )}

              {image.caption && (
                <p className="text-sm italic text-muted/60 mt-10 pt-5 border-t border-border/60">
                  {image.caption}
                </p>
              )}
            </div>

            {/* Dot map pinned to bottom — hidden on mobile to save space */}
            {trip.lat != null && trip.lng != null && (
              <div className="hidden md:block px-7 md:px-10 pb-8 mt-auto relative">
                <DotMap
                  lat={trip.lat}
                  lng={trip.lng}
                  className="w-full max-w-[200px] text-foreground/80"
                />
              </div>
            )}
          </div>

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
