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
    <section className="mb-16">
      <h2 className="text-lg font-medium mb-6" style={{ color: 'var(--foreground)' }}>
        Side Projects
      </h2>
      <div className="space-y-8">
        {projects.map((project, index) => (
          <a href={project.link} target="_blank" rel="noopener noreferrer" key={index} className="border-b pb-6 block transition-all duration-200  hover:translate-x-1" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-medium mb-3" style={{ color: 'var(--foreground)' }}>
              {project.name}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
              {project.description}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}