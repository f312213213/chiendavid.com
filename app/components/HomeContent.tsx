import type { Trip } from '@/lib/travel';
import TravelGrid from './TravelGrid';
import ScrollReveal from './ScrollReveal';
import Footer from './Footer';
import HeroDotMap, { type HeroPin } from './HeroDotMap';

const links = [
  { label: "CV", href: "https://chiendavid.com/cv", external: true, primary: true },
  { label: "Email", href: "mailto:f312213213david@gmail.com" },
  { label: "LinkedIn", href: "https://chiendavid.com/linkedin", external: true },
  { label: "GitHub", href: "https://chiendavid.com/github", external: true },
  { label: "davidchien.eth", href: "https://chiendavid.com/eth", external: true },
];

interface HomeContentProps {
  trips: Trip[];
  heroPins: HeroPin[];
}

export default function HomeContent({ trips, heroPins }: HomeContentProps) {
  return (
    <div className="min-h-[100dvh] bg-background">
      <ScrollReveal />

      <header className="relative min-h-[100dvh] flex flex-col justify-center px-6 py-20 md:px-12 lg:px-20 overflow-x-clip">
        <div className="animate-in delay-2 absolute bottom-8 right-0 md:right-[5%] hidden md:block w-[60%] lg:w-[55%] max-w-3xl z-10 pointer-events-none">
          <HeroDotMap pins={heroPins} className="w-full text-foreground" />
        </div>

        <div className="max-w-7xl w-full mx-auto relative z-20 pointer-events-none text-center md:text-left">
          <p className="animate-in delay-1 text-xs font-bold tracking-[0.3em] uppercase text-accent mb-8">
            David Chien
          </p>

          <h1 className="animate-in delay-2 font-nabla text-[4.5rem] md:text-[9rem] lg:text-[12rem] xl:text-[14rem] tracking-tight leading-[0.82]">
            Travel<br />Log
          </h1>

          <div className="animate-in delay-3 flex flex-col items-center md:items-start gap-6 mt-12 md:mt-20">
            <p className="text-lg md:text-xl font-light text-muted">
              Places I&apos;ve been, things I&apos;ve seen.
            </p>

            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 pointer-events-auto">
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

      <main className="px-6 pt-4 pb-24 md:px-12 md:pb-32 lg:px-20 lg:pb-40">
        <div className="max-w-7xl mx-auto">
          <TravelGrid trips={trips} />
        </div>
      </main>

      <div className="px-6 pb-12 md:px-12 md:pb-16 lg:px-20 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
