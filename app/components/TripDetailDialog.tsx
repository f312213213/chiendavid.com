'use client';

import { useState, useEffect, useRef, useMemo, startTransition } from 'react';
import Image from 'next/image';
import { Dialog } from '@base-ui-components/react/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { SwiperClass } from 'swiper/react';
import type { Trip } from '@/lib/travel';
import DotMap from './DotMap';
import 'swiper/css';

interface TripDetailDialogProps {
  trips: Trip[];
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTripChange: (trip: Trip) => void;
}

const FADE_MS = 120;

export default function TripDetailDialog({ trips, trip, open, onOpenChange, onTripChange }: TripDetailDialogProps) {
  const [current, setCurrent] = useState(0);
  const [displayTrip, setDisplayTrip] = useState<Trip | null>(trip);
  const [fade, setFade] = useState<'in' | 'out'>('in');
  const swiperRef = useRef<SwiperClass | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Buffered trip transition: fade out → swap content (while hidden) → fade in after paint
  useEffect(() => {
    if (!trip) {
      // Don't clear displayTrip — keepMounted keeps DOM alive for exit animation.
      // displayTrip stays so Swiper doesn't unmount mid-animation.
      return;
    }
    if (!displayTrip || trip.slug === displayTrip.slug) {
      setDisplayTrip(trip);
      setFade('in');
      return;
    }
    // Trip changed — fade out first
    setFade('out');
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      // Heavy render (Swiper remount) happens while opacity is 0
      startTransition(() => {
        setDisplayTrip(trip);
        setCurrent(0);
      });
    }, FADE_MS);
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [trip?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fade in only after displayTrip has painted
  useEffect(() => {
    if (!displayTrip || fade !== 'out') return;
    // Wait one frame after React commits the new content, then fade in
    const raf = requestAnimationFrame(() => {
      setFade('in');
    });
    return () => cancelAnimationFrame(raf);
  }, [displayTrip?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset slide index when dialog opens
  useEffect(() => {
    if (open) {
      setCurrent(0);
    }
  }, [open]);

  // Arrow keys navigate between trips
  const tripRef = useRef(trip);
  const tripsRef = useRef(trips);
  const onTripChangeRef = useRef(onTripChange);
  tripRef.current = trip;
  tripsRef.current = trips;
  onTripChangeRef.current = onTripChange;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const t = tripRef.current;
      const all = tripsRef.current;
      if (!t) return;
      const idx = all.findIndex(x => x.slug === t.slug);
      if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        onTripChangeRef.current(all[idx - 1]);
      } else if (e.key === 'ArrowRight' && idx < all.length - 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        onTripChangeRef.current(all[idx + 1]);
      }
    };
    document.addEventListener('keydown', handler, true);
    return () => document.removeEventListener('keydown', handler, true);
  }, [open]);

  // Preload adjacent trip cover images
  const tripIndex = trip ? trips.findIndex(t => t.slug === trip.slug) : -1;
  const adjacentCovers = useMemo(() => {
    if (tripIndex < 0) return [];
    const srcs: string[] = [];
    if (tripIndex > 0) srcs.push(trips[tripIndex - 1].coverSrc);
    if (tripIndex < trips.length - 1) srcs.push(trips[tripIndex + 1].coverSrc);
    return srcs;
  }, [trips, tripIndex]);

  const hasMultiple = (displayTrip?.images.length ?? 0) > 1;
  const renderTrip = displayTrip ?? trip;

  if (!renderTrip) return null;

  const image = renderTrip.images[current < renderTrip.images.length ? current : 0];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal keepMounted>
        <Dialog.Backdrop className="dialog-backdrop fixed inset-0 bg-black/90 z-50 transition-opacity duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] data-[ending-style]:opacity-0" />
        <Dialog.Popup className="dialog-popup fixed inset-0 md:inset-8 lg:inset-12 z-50 overflow-hidden md:rounded-lg transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.97] data-[ending-style]:translate-y-2">

          {/* Close button */}
          <Dialog.Close className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:bg-black/50 hover:text-white transition-all cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13"/>
            </svg>
          </Dialog.Close>

          {/* Preload adjacent trip covers */}
          {adjacentCovers.map(src => (
            <link key={src} rel="preload" as="image" href={src} />
          ))}

          {/* Grid layout: stack on mobile, 1.8fr/1fr on desktop */}
          <div
            className="h-full flex flex-col md:grid md:grid-cols-[1.8fr_1fr] overflow-hidden"
            style={{
              opacity: fade === 'in' ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-out`,
            }}
          >

            {/* === Image panel === */}
            <div className="relative h-[55vh] shrink-0 md:h-auto overflow-hidden bg-black">
              {/* Blurred background fill for contain gaps — desktop only */}
              {image.blurDataURL && (
                <div
                  className="absolute inset-0 scale-110 hidden md:block bg-cover bg-center blur-[40px] saturate-[1.3] brightness-[0.35]"
                  style={{ backgroundImage: `url(${image.blurDataURL})` }}
                />
              )}

              {/* Image nav arrows */}
              {hasMultiple && (
                <>
                  <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 hidden md:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:bg-black/50 hover:text-white transition-all cursor-pointer select-none"
                    aria-label="Previous image"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4l-6 6 6 6"/></svg>
                  </button>
                  <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 hidden md:flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:bg-black/50 hover:text-white transition-all cursor-pointer select-none"
                    aria-label="Next image"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4l6 6-6 6"/></svg>
                  </button>
                </>
              )}

              {/* Swiper carousel */}
              <Swiper
                key={renderTrip.slug}
                onSwiper={(s) => { swiperRef.current = s; }}
                onSlideChange={(s) => setCurrent(s.realIndex)}
                loop={hasMultiple}
                spaceBetween={0}
                slidesPerView={1}
                touchEventsTarget="container"
                className="absolute inset-0 z-[2] h-full"
              >
                {renderTrip.images.map((img, idx) => (
                  <SwiperSlide key={img.src} className="relative h-full">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 65vw"
                      className="object-cover md:object-contain"
                      priority={idx === 0}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      {...(img.blurDataURL
                        ? { placeholder: 'blur', blurDataURL: img.blurDataURL }
                        : {})}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Dash indicators */}
              {hasMultiple && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                  {renderTrip.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => swiperRef.current?.slideTo(idx)}
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
              <div className="fixed inset-0 pointer-events-none opacity-[0.035] polaroid-grain z-10" />

              <div className="px-8 pt-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:px-10 md:py-10 lg:px-12 relative">
                <p className="text-[11px] font-normal tracking-[0.15em] uppercase text-muted mb-3">
                  {renderTrip.location}
                </p>
                <Dialog.Title className="text-xl md:text-2xl font-semibold tracking-tight text-foreground leading-tight">
                  {renderTrip.title}
                </Dialog.Title>
                <Dialog.Description className="text-[13px] text-muted/50 mt-1.5">
                  {renderTrip.displayDate}
                </Dialog.Description>

                <div className="w-7 h-0.5 bg-current opacity-20 my-6" />

                {renderTrip.description && (
                  <p className="text-[15px] leading-[1.7] text-muted break-words">
                    {renderTrip.description}
                  </p>
                )}

                {image.caption && (
                  <p className="text-[13px] italic text-muted/50 mt-6">
                    {image.caption}
                  </p>
                )}
              </div>

              {renderTrip.lat != null && renderTrip.lng != null && (
                <div className="hidden md:block px-10 lg:px-12 pb-8 mt-auto relative">
                  <DotMap
                    lat={renderTrip.lat}
                    lng={renderTrip.lng}
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
