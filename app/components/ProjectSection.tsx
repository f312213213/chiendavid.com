interface Project {
  name: string;
  description: string;
  link: string;
}

interface ProjectSectionProps {
  projects: Project[];
}

export default function ProjectSection({ projects }: ProjectSectionProps) {
  return (
    <section className="mb-20 md:mb-28 scroll-reveal">
      <h2 className="text-xs font-semibold tracking-widest uppercase mb-8" style={{ color: 'var(--accent)' }}>
        Current Project
      </h2>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            className="project-card block p-8 border-l-4 border-2 transition-all duration-200 hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                {project.name}
              </h3>
              <span className="text-xl transition-transform duration-200 group-hover:translate-x-2" style={{ color: 'var(--accent)' }}>
                &rarr;
              </span>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
              {project.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
