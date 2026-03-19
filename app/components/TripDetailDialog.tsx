'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Dialog } from '@base-ui-components/react/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard } from 'swiper/modules';
import type { SwiperClass } from 'swiper/react';
import type { Trip } from '@/lib/travel';
import DotMap from './DotMap';
import 'swiper/css';

interface TripDetailDialogProps {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TripDetailDialog({ trip, open, onOpenChange }: TripDetailDialogProps) {
  const [current, setCurrent] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    if (open) {
      setCurrent(0);
      swiperRef.current?.slideTo(0, 0);
    }
  }, [open, trip?.slug]);

  const hasMultiple = (trip?.images.length ?? 0) > 1;

  if (!trip) return null;

  const image = trip.images[current < trip.images.length ? current : 0];

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
            <div className="relative h-[55vh] shrink-0 md:h-auto overflow-hidden bg-black">
              {/* Blurred background fill for contain gaps — desktop only */}
              {image.blurDataURL && (
                <div
                  className="absolute inset-0 scale-110 hidden md:block bg-cover bg-center blur-[40px] saturate-[1.3] brightness-[0.35]"
                  style={{ backgroundImage: `url(${image.blurDataURL})` }}
                />
              )}

              {/* Nav arrows — desktop only */}
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
                modules={[Keyboard]}
                onSwiper={(s) => { swiperRef.current = s; }}
                onSlideChange={(s) => setCurrent(s.realIndex)}
                keyboard={{ enabled: open }}
                loop={hasMultiple}
                spaceBetween={0}
                slidesPerView={1}
                touchEventsTarget="container"
                className="absolute inset-0 z-[2] h-full"
              >
                {trip.images.map((img, idx) => (
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
                  {trip.images.map((_, idx) => (
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

            {/* === Content panel — scrolls on mobile, centered on desktop === */}
            <div className="relative flex-1 min-h-0 overflow-y-auto bg-background flex flex-col md:justify-center">
              {/* Grain overlay — fixed so it covers content during scroll */}
              <div className="fixed inset-0 pointer-events-none opacity-[0.035] polaroid-grain z-10" />

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
