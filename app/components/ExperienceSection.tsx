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
      <div className="space-y-10">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className={`exp-entry relative border-l-2 ${index === 0 ? 'pl-8 py-6 -ml-2' : 'pl-6'}`}
            style={index === 0 ? { borderColor: 'var(--accent)' } : undefined}
          >
            {index === 0 && (
              <span
                className="absolute top-6 left-8 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5"
                style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
              >
                Current
              </span>
            )}
            <div className={index === 0 ? 'mt-8' : ''}>
              <h3
                className={`font-bold tracking-tight ${index === 0 ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}
                style={{ color: 'var(--foreground)' }}
              >
                {exp.company}
              </h3>
              <p className={`font-medium mt-1 ${index === 0 ? 'text-base' : 'text-sm'}`} style={{ color: 'var(--muted)' }}>
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
                    <span className="mt-2 w-1.5 h-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--accent)', opacity: 0.6 }}></span>
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
