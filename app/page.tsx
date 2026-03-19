import { getAllTrips } from '@/lib/travel';
import TravelGrid from './components/TravelGrid';
import ScrollReveal from './components/ScrollReveal';
import Footer from './components/Footer';

const links = [
  { label: "CV", href: "https://chiendavid.com/cv", external: true, primary: true },
  { label: "Email", href: "mailto:f312213213david@gmail.com" },
  { label: "LinkedIn", href: "https://chiendavid.com/linkedin", external: true },
  { label: "GitHub", href: "https://chiendavid.com/github", external: true },
  { label: "davidchien.eth", href: "https://chiendavid.com/eth", external: true },
];

export default async function Home() {
  const trips = await getAllTrips();

  return (
    <div className="min-h-[100dvh] bg-background">
      <ScrollReveal />

      {/* Hero — full-bleed, dramatic */}
      <header className="relative px-6 pt-20 pb-16 md:px-12 md:pt-32 md:pb-24 lg:px-20 lg:pt-40 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          <p className="animate-in delay-1 text-xs font-bold tracking-[0.3em] uppercase text-accent mb-6">
            David Chien
          </p>
          <h1 className="animate-in delay-2 font-nabla text-7xl md:text-9xl lg:text-[10rem] tracking-tight leading-[0.85]">
            Travel<br />Log
          </h1>
          <p className="animate-in delay-3 text-lg md:text-xl font-light text-muted mt-8 max-w-md">
            Places I&apos;ve been, things I&apos;ve seen.
          </p>

          {/* Links */}
          <nav className="animate-in delay-4 flex flex-wrap items-center gap-4 mt-10">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={link.primary
                  ? "px-5 py-2.5 text-sm font-semibold uppercase tracking-wider border-2 bg-accent border-accent text-white hover:opacity-85 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                  : "text-sm font-semibold uppercase tracking-wider text-muted hover:text-accent transition-colors duration-200"
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="animate-in delay-4 w-20 h-1 bg-accent mt-10" />
        </div>
      </header>

      {/* Grid */}
      <main className="px-6 pb-16 md:px-12 md:pb-24 lg:px-20 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          <TravelGrid trips={trips} />
        </div>
      </main>

      <div className="px-6 pb-16 md:px-12 md:pb-24 lg:px-20 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
