'use client';

import Image from 'next/image';
import type { Trip } from '@/lib/travel';

interface PolaroidCardProps {
  trip: Trip;
  onClick: () => void;
  disableRotation?: boolean;
  featured?: boolean;
}

export default function PolaroidCard({ trip, onClick, disableRotation, featured }: PolaroidCardProps) {
  const rotation = disableRotation ? 0 : trip.rotation;

  return (
    <button
      onClick={onClick}
      className="scroll-reveal polaroid-card block w-full text-left p-2 pb-10 md:p-3 md:pb-14 border-2 border-border shadow-md cursor-pointer outline-none focus-visible:border-accent group"
      style={{
        transform: `rotate(${rotation}deg)`,
        backgroundColor: 'color-mix(in srgb, var(--background) 100%, white 8%)',
      }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={trip.coverSrc}
          alt={trip.coverAlt}
          fill
          sizes={featured ? '(max-width: 768px) 80vw, 50vw' : '(max-width: 768px) 80vw, 33vw'}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="mt-3 md:mt-4 px-1">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-accent mb-1">
          {trip.location}
        </p>
        <h3 className={`font-bold tracking-tight text-foreground ${featured ? 'text-lg md:text-2xl' : 'text-base md:text-lg'}`}>
          {trip.title}
        </h3>
        <p className="text-xs text-muted mt-0.5">
          {trip.date}
        </p>
      </div>
    </button>
  );
}
