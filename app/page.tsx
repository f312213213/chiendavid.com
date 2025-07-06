import ExperienceSection from './components/ExperienceSection';
import ProjectSection from './components/ProjectSection';
import EducationSection from './components/EducationSection';
import Footer from './components/Footer';

const experiences = [
  {
    title: "Software Engineer",
    company: "Appier",
    period: "July 2024 – Present",
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
    achievements: []
  }
];

const projects = [
  {
    name: "cvsite.cc",
    link: "https://cvsite.cc",
    description: "Developed a web app that transforms traditional CVs into visually appealing websites."
  },
  {
    name: "Alpha Point Tracker",
    link: "https://alpha-tracker.zeabur.app/",
    description: "Developed a webapp that utilizes bscscan api to help users track their progress in the Binance alpha points event."
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

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-screen-sm mx-auto px-6 py-12">
        
        {/* Intro */}
        <section className="mb-16">
          <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--foreground)' }}>
            David Chien
          </h1>
          <div className="flex flex-col gap-4 mb-8">
            <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
              Software Engineer focused on frontend optimization, infrastructure modernization, 
              and performance tuning for large-scale React applications. 
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
              I'm also involved in full-stack development, and I'm interested in building products that help people live better lives.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
              Currently based between Taipei, Taiwan 🇹🇼 and Seattle, USA 🇺🇸.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="https://chiendavid.com/cv" className="hover:underline" style={{ color: 'var(--muted)' }}>
                CV
            </a>
            <a href="mailto:f312213213david@gmail.com" className="hover:underline" style={{ color: 'var(--muted)' }}>
              Email
            </a>
            <a href="https://chiendavid.com/linkedin" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--muted)' }}>
              LinkedIn
            </a>
            <a href="https://chiendavid.com/github" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--muted)' }}>
              GitHub
            </a>
            <a href="https://chiendavid.com/eth" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--muted)' }}>
              davidchien.eth
            </a>
          </div>
        </section>

        {/* Side Projects */}
        <ProjectSection projects={projects} />

        {/* Work Experience */}
        <ExperienceSection experiences={experiences} />

        {/* Education */}
        <EducationSection education={education} />
      </div>
      <Footer />
    </main>
  );
}