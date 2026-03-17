'use client';

import Image from 'next/image';
import { Tooltip } from '@base-ui-components/react/tooltip';

interface Project {
  name: string;
  description: string;
  link: string;
  image?: string;
}

interface ProjectSectionProps {
  projects: Project[];
}

export default function ProjectSection({ projects }: ProjectSectionProps) {
  return (
    <section className="mb-20 md:mb-28">
      <h2 className="text-xs font-semibold tracking-widest uppercase mb-8 text-accent">
        Current Project
      </h2>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <Tooltip.Provider key={index} delay={300}>
            <Tooltip.Root>
              <Tooltip.Trigger
                render={
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-8 border-l-4 border-l-accent border-2 border-border transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:bg-accent/4 group"
                  />
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {project.name}
                  </h3>
                  <span className="text-xl transition-transform duration-200 group-hover:translate-x-2 text-accent">
                    &rarr;
                  </span>
                </div>
                <p className="text-base leading-relaxed text-muted">
                  {project.description}
                </p>
              </Tooltip.Trigger>
              {project.image && (
                <Tooltip.Portal>
                  <Tooltip.Positioner sideOffset={12} side="top">
                    <Tooltip.Popup className="project-tooltip">
                      <Image
                        src={project.image}
                        alt={`${project.name} preview`}
                        width={480}
                        height={252}
                        className="rounded-sm"
                      />
                    </Tooltip.Popup>
                  </Tooltip.Positioner>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}
      </div>
    </section>
  );
}
