import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  className?: string;
  sectionName: string;
  children: ReactNode;
}

const SectionWrapper = ({ sectionName, className, children }: Props) => {
  return (
    <section
      id={sectionName.toLowerCase()}
      className={cn("pb-8 lg:pt-24", className)}
    >
      {sectionName && (
        <div className="py-4 text-base uppercase text-foreground font-bold lg:hidden z-50 sticky top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {sectionName}
        </div>
      )}
      {children}
    </section>
  );
};

export default SectionWrapper;
