import SiteMenu from "@/components/SiteMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { socialMediaLinks } from "@/config";
import avatarImage from "@/public/avatar.png";
import Image from "next/image";
import Link from "next/link";

const StickyHeader = () => {
  return (
    <header className="lg:col-span-2 lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:flex-col lg:justify-between lg:py-24">
      <div className="flex flex-col justify-between">
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl w-fit">
                David Chien
              </h1>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="ml-4 flex justify-center items-center"
            >
              <Image
                src={avatarImage}
                alt="David Chien"
                width={60}
                height={60}
              />
            </TooltipContent>
          </Tooltip>
          <h2 className="mt-3 font-medium tracking-tight text-foreground/80">
            Software Engineer based in{" "}
            <Tooltip>
              <TooltipTrigger asChild>
                <span>Taipei</span>
              </TooltipTrigger>
              <TooltipContent side="bottom">🇹🇼</TooltipContent>
            </Tooltip>
            .
          </h2>
          <p className="mt-4 max-w-lg lg:max-w-xs leading-normal text-sm text-muted-foreground">
            {/* eslint-disable-next-line react/no-unescaped-entities */}I build
            things for the web. I'm passionate about creating software that is
            fast, reliable, and user-friendly.
          </p>
        </div>

        <SiteMenu />
      </div>

      <ol className="ml-1 mt-8 flex items-center">
        {socialMediaLinks.map((link) => (
          <li key={link.name} className="mr-5 text-xs shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-slate-200"
                >
                  <div className="w-6 h-6">{link.icon}</div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>{link.name}</TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ol>
    </header>
  );
};

export default StickyHeader;
