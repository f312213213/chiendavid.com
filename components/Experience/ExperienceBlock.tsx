interface Props {
  title: string;
  company: string;
  field: string;
  date: string;
  description: string;
  companyLink: string;
}

const ExperienceBlock = ({
  title,
  companyLink,
  company,
  // eslint-disable-next-line no-unused-vars
  field,
  description,
  date,
}: Props) => {
  return (
    <div className="flex flex-col w-full gap-2 group rounded-md py-4 relative lg:hover:!opacity-100 lg:group-hover/list:opacity-50 transition-all">
      <div className="absolute -inset-x-4 -inset-y-1 z-0 hidden rounded-md transition motion-reduce:transition-none lg:block dark:lg:group-hover:bg-slate-800/50 lg:group-hover:bg-slate-200/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg" />
      <div className="text-sm text-muted-foreground z-10">{date}</div>
      <div className="flex flex-col justify-start w-full gap-1 z-10">
        <div className="flex font-bold z-20">
          <p className="mr-2">{title}</p>@
          <a href={companyLink}>
            {company}{" "}
            <span className="absolute -inset-x-4 -inset-y-1 hidden rounded lg:block" />
          </a>
        </div>

        <div className="text-sm text-muted-foreground z-10">{description}</div>
      </div>
    </div>
  );
};

export default ExperienceBlock;
