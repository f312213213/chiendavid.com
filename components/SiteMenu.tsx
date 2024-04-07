"use client";

interface MenuItemProps {
  name: string;
}

const MenuItem = ({ name }: MenuItemProps) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <li
      onClick={() => {
        // @ts-ignore
        document.getElementById(name.toLowerCase()).scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }}
      className="group text-muted-foreground w-fit flex items-center gap-2 cursor-pointer uppercase font-bold text-sm hover:text-foreground transition-all"
    >
      <div className="w-4 h-px bg-muted-foreground group-hover:bg-foreground group-hover:w-8 transition-all" />
      {name}
    </li>
  );
};

const SiteMenu = () => {
  return (
    <ol className="flex-col gap-8 flex-1 mt-12 hidden lg:flex">
      {["about", "Experience", "Project"].map((item) => (
        <MenuItem name={item} key={item} />
      ))}
    </ol>
  );
};

export default SiteMenu;
