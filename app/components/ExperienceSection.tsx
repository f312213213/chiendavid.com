interface Experience {
  title: string;
  company: string;
  period: string;
  achievements: string[];
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section className="mb-20 md:mb-28">
      <h2 className="text-xs font-semibold tracking-widest uppercase mb-10" style={{ color: 'var(--accent)' }}>
        Work Experience
      </h2>
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <div key={index} className="exp-entry relative pl-6 border-l-2" style={index === 0 ? { borderColor: 'var(--accent)' } : undefined}>
            <div className="mb-3">
              <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                {exp.company}
              </h3>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
                {exp.title}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                {exp.period}
              </p>
            </div>
            {exp.achievements.length > 0 && (
              <ul className="space-y-2 mt-4">
                {exp.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-sm leading-relaxed flex items-start gap-3" style={{ color: 'var(--muted)' }}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)', opacity: 0.6 }}></span>
                    <span className="flex-1">{achievement}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
