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
    <section className="mb-16">
      <h2 className="text-lg font-medium mb-6" style={{ color: 'var(--foreground)' }}>
        Education
      </h2>
      <div className="space-y-8">
        {education.map((edu, index) => (
          <div key={index}>
            <h3 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>
              {edu.institution}
            </h3>
            <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>
              {edu.degree}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              {edu.period}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}