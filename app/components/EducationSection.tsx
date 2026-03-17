interface Education {
  institution: string;
  degree: string;
  period: string;
  location: string;
}

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  return (
    <section className="mb-20 md:mb-28">
      <h2 className="text-xs font-semibold tracking-widest uppercase mb-8" style={{ color: 'var(--accent)' }}>
        Education
      </h2>
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              {edu.institution}
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              {edu.degree}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              {edu.period}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
