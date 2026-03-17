'use client';

import Image from 'next/image';
import type { Trip } from '@/lib/travel';

interface PolaroidCardProps {
  trip: Trip;
  onClick: () => void;
}

export default function PolaroidCard({ trip, onClick }: PolaroidCardProps) {
  return (
    <button
      onClick={onClick}
      className="scroll-reveal polaroid-card block w-full text-left p-2 pb-10 md:p-3 md:pb-14 bg-white dark:bg-[#2a2725] border-2 border-border shadow-md cursor-pointer outline-none focus-visible:border-accent"
      style={{ transform: `rotate(${trip.rotation}deg)` }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={trip.coverSrc}
          alt={trip.coverAlt}
          fill
          sizes="(max-width: 768px) 80vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="mt-3 md:mt-4 px-1">
        <h3 className="text-base md:text-lg font-bold tracking-tight text-foreground">
          {trip.title}
        </h3>
        <p className="text-xs text-muted mt-0.5">
          {trip.location} &middot; {trip.date}
        </p>
      </div>
    </button>
  );
}
