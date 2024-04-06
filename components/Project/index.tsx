import ProjectBlock from "@/components/Project/ProjectBlock";
import SectionWrapper from "@/components/SectionWrapper";
import { projects } from "@/config";

const Project = () => {
  return (
    <SectionWrapper sectionName="projects" className="border-b-2">
      <ul className="space-y-4 flex flex-col group/list">
        {projects.map((project) => (
          <ProjectBlock {...project} />
        ))}
      </ul>
    </SectionWrapper>
  );
};

export default Project;
