import ExperienceBlock from "@/components/Experience/ExperienceBlock";
import SectionWrapper from "@/components/SectionWrapper";
import { experience } from "@/config";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const Experience = () => {
  return (
    <SectionWrapper sectionName="experiences">
      <ul className="space-y-4 flex flex-col group/list">
        {experience.map((exp) => (
          <ExperienceBlock {...exp} />
        ))}
      </ul>
      <Link
        href="./cv"
        target="_blank"
        className="mt-6 inline-flex items-baseline font-medium leading-tight focus-visible:text-teal-300 group/link text-base"
      >
        View Full Resume{" "}
        <span className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-px group-hover/link:translate-x-px group-focus-visible/link:-translate-y-px group-focus-visible/link:translate-x-px motion-reduce:transition-none ml-1 translate-y-1 -translate-x-1">
          <ArrowTopRightIcon />
        </span>
      </Link>
    </SectionWrapper>
  );
};

export default Experience;
