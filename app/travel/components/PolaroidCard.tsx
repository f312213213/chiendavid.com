'use client';

import Image from 'next/image';
import type { Trip } from '@/lib/travel';
import DotMap from './DotMap';

interface PolaroidCardProps {
  trip: Trip;
  onClick: () => void;
  disableRotation?: boolean;
  featured?: boolean;
}

/* Deterministic "random" from slug for tape position variety */
function slugHash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function PolaroidCard({ trip, onClick, disableRotation, featured }: PolaroidCardProps) {
  const rotation = disableRotation ? 0 : trip.rotation;
  const h = slugHash(trip.slug);

  const tapeRotate = (h % 30) - 15;
  const tapeLeft = 30 + (h % 40);
  const tapeWidth = featured ? 80 : 56;

  return (
    <button
      onClick={onClick}
      className="scroll-reveal polaroid-card block w-full text-left cursor-pointer outline-none focus-visible:border-accent group relative"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Tape strip */}
      <div
        className="absolute -top-3 z-10 pointer-events-none h-[18px] polaroid-tape"
        style={{
          left: `${tapeLeft}%`,
          transform: `translateX(-50%) rotate(${tapeRotate}deg)`,
          width: tapeWidth,
        }}
      />

      {/* Card body */}
      <div className="p-2 pb-10 md:p-3 md:pb-14 border border-border/60 relative overflow-hidden polaroid-body">
        {/* Paper grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] polaroid-grain" />

        {/* Image with vignette */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={trip.coverSrc}
            alt={trip.coverAlt}
            fill
            sizes={featured ? '(max-width: 768px) 80vw, 50vw' : '(max-width: 768px) 80vw, 33vw'}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            {...(trip.coverBlurDataURL
              ? { placeholder: 'blur', blurDataURL: trip.coverBlurDataURL }
              : {})}
          />
          <div className="absolute inset-0 pointer-events-none polaroid-vignette" />
        </div>

        {/* Caption */}
        <div className="mt-3 md:mt-4 px-1 relative">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-accent mb-1">
            {trip.location}
          </p>
          <h3 className={`font-bold tracking-tight text-foreground ${featured ? 'text-lg md:text-2xl' : 'text-base md:text-lg'}`}>
            {trip.title}
          </h3>
          <p className="text-xs text-muted mt-0.5">
            {trip.displayDate}
          </p>

          {/* Dot map */}
          {trip.lat != null && trip.lng != null && (
            <DotMap
              lat={trip.lat}
              lng={trip.lng}
              className={`absolute -bottom-12 -right-1 text-foreground w-40 ${featured ? 'md:w-52' : 'md:w-28'}`}
            />
          )}
        </div>
      </div>
    </button>
  );
}
