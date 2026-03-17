import Link from 'next/link';
import { getAllTrips } from '@/lib/travel';
import TravelGrid from './components/TravelGrid';
import ScrollReveal from '../components/ScrollReveal';

export default async function TravelPage() {
  const trips = await getAllTrips();

  return (
    <>
      <ScrollReveal />

      <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-16">
        {/* Title — sticky left column */}
        <header className="md:w-2/5 md:sticky md:top-24 shrink-0">
          <Link
            href="/"
            className="animate-in delay-1 inline-block text-sm font-medium tracking-wide uppercase mb-12 text-accent hover:opacity-70 transition-opacity relative z-10"
          >
            &larr; Back
          </Link>
          <h1 className="animate-in delay-2 font-nabla text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9]">
            Travel<br />Log
          </h1>
          <p className="animate-in delay-3 text-lg md:text-xl font-light text-muted mt-8 max-w-sm">
            Places I&apos;ve been, things I&apos;ve seen.
          </p>
          <div className="animate-in delay-4 w-16 h-0.5 bg-accent mt-8" />
        </header>

        {/* Cards — right column */}
        <div className="flex-1 md:pt-8">
          <TravelGrid trips={trips} />
        </div>
      </div>
    </>
  );
}
