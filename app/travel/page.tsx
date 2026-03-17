import { getAllTrips } from '@/lib/travel';
import TravelGrid from './components/TravelGrid';
import ScrollReveal from '../components/ScrollReveal';

export default async function TravelPage() {
  const trips = await getAllTrips();

  return (
    <>
      <ScrollReveal />
      <header className="mb-16 md:mb-24">
        <a
          href="/"
          className="animate-in delay-1 inline-block text-sm font-medium tracking-wide uppercase mb-10 text-accent hover:opacity-70 transition-opacity relative z-10"
        >
          &larr; Back
        </a>
        <h1 className="animate-in delay-2 font-nabla text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9]">
          Travel<br />Log
        </h1>
      </header>
      <TravelGrid trips={trips} />
    </>
  );
}
