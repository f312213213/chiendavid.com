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
    <section className="mb-16">
      <h2 className="text-lg font-medium mb-6" style={{ color: 'var(--foreground)' }}>
        Work Experiences
      </h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="border-b pb-6" style={{ borderColor: 'var(--border)' }}>
            <div className="mb-4">
              <h3 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                {exp.title}
              </h3>
              <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>
                {exp.company}
              </p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {exp.period}
              </p>
            </div>
            {exp.achievements.length > 0 && (
              <ul className="space-y-3 mt-4">
                {exp.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-sm leading-relaxed flex items-start gap-3" style={{ color: 'var(--muted)' }}>
                    <span className="text-xs mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--muted)' }}></span>
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