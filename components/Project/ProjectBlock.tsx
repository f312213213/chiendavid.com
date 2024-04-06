import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

interface Props {
  title: string;
  badge: string[];
  description: string;
  link: string;
}

const ProjectBlock = ({ title, badge, link, description }: Props) => {
  return (
    <div className="flex flex-col w-full gap-2 group/link rounded-md py-4 relative lg:hover:!opacity-100 lg:group-hover/list:opacity-50 transition-all">
      <div className="absolute -inset-x-4 -inset-y-1 z-0 hidden rounded-md transition motion-reduce:transition-none lg:block dark:lg:group-hover/link:bg-slate-800/50 lg:group-hover/link:bg-slate-200/50 lg:group-hover/link:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover/link:drop-shadow-lg" />
      <Link href={link} target="_blank" className="z-20">
        {title}
        <span className="inline-block ml-2 h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-px group-hover/link:translate-x-px group-focus-visible/link:-translate-y-px group-focus-visible/link:translate-x-px motion-reduce:transition-none translate-y-1 -translate-x-1">
          <ArrowTopRightIcon />
        </span>
        <span className="absolute -inset-x-4 -inset-y-1 hidden rounded lg:block" />
      </Link>
      <div className="text-muted-foreground z-10 text-sm">{description}</div>
    </div>
  );
};

export default ProjectBlock;
