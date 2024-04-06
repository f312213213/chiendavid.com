import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  className?: string;
  sectionName: string;
  children: ReactNode;
}

const SectionWrapper = ({ sectionName, className, children }: Props) => {
  return (
    <section id={sectionName} className={cn("pb-8", className)}>
      {children}
    </section>
  );
};

export default SectionWrapper;
