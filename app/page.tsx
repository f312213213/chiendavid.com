import { getAllTrips } from '@/lib/travel';
import TravelGrid from './components/TravelGrid';
import ScrollReveal from './components/ScrollReveal';
import Footer from './components/Footer';
import DotMap from './components/DotMap';

const links = [
  { label: "CV", href: "https://chiendavid.com/cv", external: true, primary: true },
  { label: "Email", href: "mailto:f312213213david@gmail.com" },
  { label: "LinkedIn", href: "https://chiendavid.com/linkedin", external: true },
  { label: "GitHub", href: "https://chiendavid.com/github", external: true },
  { label: "davidchien.eth", href: "https://chiendavid.com/eth", external: true },
];

export default async function Home() {
  const trips = await getAllTrips();
  const countrySet = new Set(trips.map(t => t.location.split(',').pop()?.trim()));
  const pins = trips
    .filter(t => t.lat != null && t.lng != null)
    .map(t => ({ lat: t.lat!, lng: t.lng! }));

  return (
    <div className="min-h-[100dvh] bg-background">
      <ScrollReveal />

      {/* Hero */}
      <header className="relative min-h-[85dvh] flex flex-col justify-end px-6 pb-12 md:px-12 md:pb-20 lg:px-20 lg:pb-24 overflow-hidden">
        {/* Dot map — bottom-anchored, shifted right to avoid title collision */}
        <div className="animate-in delay-2 absolute bottom-8 right-0 md:right-[5%] pointer-events-none hidden md:block w-[70%] max-w-4xl">
          <DotMap pins={pins} className="w-full text-foreground opacity-20" />
        </div>

        <div className="max-w-7xl w-full mx-auto relative">
          <p className="animate-in delay-1 text-xs font-bold tracking-[0.3em] uppercase text-accent mb-8">
            David Chien
          </p>

          <h1 className="animate-in delay-2 font-nabla text-[4.5rem] md:text-[9rem] lg:text-[12rem] xl:text-[14rem] tracking-tight leading-[0.82] -ml-1 md:-ml-3">
            Travel<br />Log
          </h1>

          <div className="animate-in delay-3 flex flex-col gap-6 mt-10 md:mt-14">
            <p className="text-lg md:text-xl font-light text-muted">
              {trips.length} trips across {countrySet.size} countries.
            </p>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={link.primary
                    ? "px-5 py-2.5 text-sm font-semibold uppercase tracking-wider border-2 bg-accent border-accent text-white hover:opacity-85 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                    : "text-sm font-semibold uppercase tracking-wider text-muted/60 hover:text-accent transition-colors duration-200"
                  }
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="px-6 pb-16 md:px-12 md:pb-24 lg:px-20 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <TravelGrid trips={trips} />
        </div>
      </main>

      <div className="px-6 pb-16 md:px-12 md:pb-24 lg:px-20 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
