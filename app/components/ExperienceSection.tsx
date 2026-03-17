interface Role {
  title: string;
  period: string;
  achievements: string[];
}

interface Experience {
  company: string;
  current?: boolean;
  roles: Role[];
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section className="mb-20 md:mb-28">
      <h2 className="scroll-reveal text-xs font-semibold tracking-widest uppercase mb-10 text-accent">
        Work Experience
      </h2>
      <div className="space-y-10">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className={`scroll-reveal relative border-l-2 pl-6 transition-[border-color,background] duration-300 hover:border-accent ${
              exp.current ? 'border-accent hover:bg-accent/5' : 'border-border'
            }`}
          >
            <h3
              className={`font-bold tracking-tight text-foreground ${exp.current ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}
            >
              {exp.company}
            </h3>

            <div className={exp.roles.length > 1 ? 'space-y-6 mt-3' : 'mt-1'}>
              {exp.roles.map((role, roleIdx) => (
                <div key={roleIdx}>
                  <p className={`font-medium text-muted ${exp.current ? 'text-base' : 'text-sm'}`}>
                    {role.title}
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-2 text-muted">
                    {role.period}
                    {exp.current && roleIdx === 0 && (
                      <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 inline-block bg-accent text-white">
                        Current
                      </span>
                    )}
                  </p>
                  {role.achievements.length > 0 && (
                    <ul className="space-y-2 mt-3">
                      {role.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm leading-relaxed flex items-start gap-3 text-muted">
                          <span className="mt-2 w-1.5 h-1.5 flex-shrink-0 bg-accent/60"></span>
                          <span className="flex-1">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
