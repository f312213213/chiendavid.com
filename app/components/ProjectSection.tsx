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
    <section className="mb-20 md:mb-28">
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
            className="project-card block p-6 border-2 transition-all duration-200 hover:-translate-y-1 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {project.name}
              </h3>
              <span className="text-sm transition-transform duration-200 group-hover:translate-x-1" style={{ color: 'var(--accent)' }}>
                &rarr;
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              {project.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
