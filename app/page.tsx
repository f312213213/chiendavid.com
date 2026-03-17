import ExperienceSection from './components/ExperienceSection';
import ProjectSection from './components/ProjectSection';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';

const experiences = [
  {
    company: "Make",
    current: true,
    roles: [
      {
        title: "Software Engineer",
        period: "Feb 2026 – Present",
        achievements: [
          "Working on the billing system powering Make's automation platform, ensuring reliable payment processing at scale."
        ]
      }
    ]
  },
  {
    company: "Appier",
    roles: [
      {
        title: "Software Engineer",
        period: "July 2024 – Feb 2026",
        achievements: [
          "Modernized monorepo infrastructure by leading migration from Yarn/Lerna to pnpm/NX, reducing CI/CD pipeline execution time by 83%.",
          "Designed and deployed a comprehensive logging service, enabling real-time performance monitoring and accelerating issue resolution by 15%.",
          "Collaborated with cross-functional teams to implement scalable solutions and drive continuous improvement.",
          "Acted as a key decision-maker in selecting and implementing new build tools."
        ]
      },
      {
        title: "Software Engineer Intern",
        period: "July 2023 – July 2024",
        achievements: [
          "Developed an intuitive campaign management dashboard, streamlining manager workflows.",
          "Optimized mission-critical page performance, reducing load time from unresponsive to 1 second.",
          "Spearheaded migration from Webpack to Rspack, achieving a 10x improvement in build times.",
          "Led major UI library upgrade, coordinating systematic migration across multiple applications and teams."
        ]
      }
    ]
  },
  {
    company: "LangLive",
    roles: [
      {
        title: "Software Engineer",
        period: "June 2022 – June 2023",
        achievements: [
          "Refactored gift animation system with WebGL, reducing CPU usage by 30%.",
          "Re-architected data fetching, cutting API calls by 50% and improving page load speed.",
          "Implemented end-to-end testing with Playwright across three products."
        ]
      }
    ]
  },
  {
    company: "Dimorder",
    roles: [
      {
        title: "Software Engineer (Part time)",
        period: "Feb 2022 – Feb 2023",
        achievements: [
          "Owned and evolved a food delivery platform, building end-to-end ordering and restaurant management features."
        ]
      }
    ]
  }
];

const projects = [
  {
    name: "demodone.app",
    link: "https://demodone.app",
    description: "Building a web app to help teams showcase and track product demos.",
    image: "https://demodone.app/og-image.png"
  }
];

const education = [
  {
    institution: "National Taipei University",
    degree: "Bachelor of Science: Computer Science",
    period: "2019 - 2024"
  }
];

const links = [
  { label: "CV", href: "https://chiendavid.com/cv", variant: "primary" as const },
  { label: "Email", href: "mailto:f312213213david@gmail.com", variant: "secondary" as const },
  { label: "LinkedIn", href: "https://chiendavid.com/linkedin", external: true, variant: "ghost" as const },
  { label: "GitHub", href: "https://chiendavid.com/github", external: true, variant: "ghost" as const },
  { label: "davidchien.eth", href: "https://chiendavid.com/eth", external: true, variant: "ghost" as const },
];

export default function Home() {
  return (
    <div className="min-h-[100dvh] px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 bg-background">
      <main className="max-w-3xl mx-auto">

        {/* Hero */}
        <section className="mb-24 md:mb-36">
          <p className="animate-in delay-1 text-sm font-medium tracking-wide uppercase mb-6 text-accent">
            Software Engineer
          </p>
          <h1 className="animate-in delay-2 font-nabla text-6xl md:text-8xl lg:text-9xl tracking-tight mb-10 leading-[0.9]">
            David<br />Chien
          </h1>
          <div className="animate-in delay-3 mb-12">
            <p className="text-xl md:text-2xl leading-relaxed max-w-xl font-light text-foreground">
              I obsess over build systems, billing pipelines, and making slow things fast.
            </p>
            <p className="text-base md:text-lg leading-relaxed mt-4 text-muted">
              Currently in Prague 🇨🇿 &mdash; also available in Taiwan 🇹🇼 and the USA 🇺🇸
            </p>
          </div>
          <div className="animate-in delay-4 flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`px-5 py-2.5 text-sm font-semibold uppercase tracking-wider border-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 outline-none ${
                  link.variant === 'primary'
                    ? 'bg-accent border-accent text-white hover:opacity-85'
                    : link.variant === 'secondary'
                    ? 'text-accent border-accent hover:bg-accent hover:text-white'
                    : 'text-foreground border-border hover:text-accent hover:border-accent'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <ScrollReveal />

        {/* Current Project */}
        <div className="animate-in delay-4">
          <ProjectSection projects={projects} />
        </div>

        {/* Work Experience */}
        <ExperienceSection experiences={experiences} />

        <Footer education={education} />
      </main>
    </div>
  );
}
