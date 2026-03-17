import ExperienceSection from './components/ExperienceSection';
import ProjectSection from './components/ProjectSection';
import EducationSection from './components/EducationSection';
import Footer from './components/Footer';

const experiences = [
  {
    title: "Software Engineer",
    company: "Make",
    period: "Feb 2026 – Present",
    achievements: [
      "Building automation tools and platform features for Make's no-code integration platform."
    ]
  },
  {
    title: "Software Engineer",
    company: "Appier",
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
    company: "Appier",
    period: "July 2023 – July 2024",
    achievements: [
      "Developed an intuitive campaign management dashboard, streamlining manager workflows.",
      "Optimized mission-critical page performance, reducing load time from unresponsive to 1 second.",
      "Spearheaded migration from Webpack to Rspack, achieving a 10x improvement in build times.",
      "Led major UI library upgrade, coordinating systematic migration across multiple applications and teams."
    ]
  },
  {
    title: "Software Engineer",
    company: "LangLive",
    period: "June 2022 – June 2023",
    achievements: [
      "Refactored gift animation system with WebGL, reducing CPU usage by 30%.",
      "Re-architected data fetching, cutting API calls by 50% and improving page load speed.",
      "Implemented end-to-end testing with Playwright across three products."
    ]
  },
  {
    title: "Software Engineer (Part time)",
    company: "Dimorder",
    period: "Feb 2022 – Feb 2023",
    achievements: [
      "Contributed to the development of a restaurant ordering and management platform."
    ]
  }
];

const projects = [
  {
    name: "demodone.app",
    link: "https://demodone.app",
    description: "Building a web app to help teams showcase and track product demos."
  }
];

const education = [
  {
    institution: "National Taipei University",
    degree: "Bachelor of Science: Computer Science",
    period: "2019 - 2024",
    location: "Sanxia campus"
  }
];

const links = [
  { label: "CV", href: "https://chiendavid.com/cv" },
  { label: "Email", href: "mailto:f312213213david@gmail.com" },
  { label: "LinkedIn", href: "https://chiendavid.com/linkedin", external: true },
  { label: "GitHub", href: "https://chiendavid.com/github", external: true },
  { label: "davidchien.eth", href: "https://chiendavid.com/eth", external: true },
];

export default function Home() {
  return (
    <div className="min-h-[100dvh] px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-32 font-exo2" style={{ background: 'var(--background)' }}>
      <main className="max-w-2xl mx-auto">

        {/* Hero */}
        <section className="mb-24 md:mb-36">
          <p className="animate-in delay-1 text-sm font-medium tracking-wide uppercase mb-6" style={{ color: 'var(--accent)' }}>
            Software Engineer
          </p>
          <h1 className="animate-in delay-2 font-nabla text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-10 leading-[0.9]" style={{ color: 'var(--foreground)' }}>
            David<br />Chien
          </h1>
          <div className="animate-in delay-3 flex flex-col gap-3 mb-12 font-exo2">
            <p className="text-lg md:text-xl leading-relaxed max-w-lg" style={{ color: 'var(--muted)' }}>
              I build web applications and care deeply about creating products that help people live better lives.
            </p>
            <p className="text-lg md:text-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
              Currently in Prague 🇨🇿 &mdash; also able to work in Taiwan 🇹🇼 and the USA 🇺🇸
            </p>
          </div>
          <div className="animate-in delay-4 flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="link-pill px-4 py-2 text-sm font-medium rounded-full border-2 transition-all duration-200 hover:-translate-y-0.5"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        {/* Current Project */}
        <div className="animate-in delay-5">
          <ProjectSection projects={projects} />
        </div>

        {/* Work Experience */}
        <ExperienceSection experiences={experiences} />

        {/* Education */}
        <EducationSection education={education} />

        <Footer />
      </main>
    </div>
  );
}
