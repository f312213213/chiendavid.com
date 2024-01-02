import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { emailLink, experience, projects, socialMediaLinks } from "@/config";

export default function Home() {
  return (
    <main className="antialiased max-w-2xl flex flex-col py-10 mx-4 md:mx-auto gap-4">
      {/* Basic Info */}
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-2xl flex items-center">David Chien</h1>
          <div className="flex flex-col justify-center gap-1">
            <p>Juggling my time between bench pressing and coding.</p>
            <p>Passionate about web development.</p>
          </div>

          <div className="flex gap-2 place-items-center w-full">
            {socialMediaLinks.map(({ icon, link, name }, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <a
                      className="w-full h-full p-2"
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {icon}
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <Avatar className="w-[130px] h-[130px]">
            <AvatarImage src="./avatar.png" />
            <AvatarFallback className="">David Chien</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* About */}
      <div>
        <h2 className="font-bold text-xl">About</h2>
        <div className="w-full text-sm text-muted-foreground py-2 flex flex-col gap-2">
          <p>
            I&apos;m a software engineer based in{" "}
            <span className="font-bold">Taipei, Taiwan</span>.
          </p>
          <p>
            With <span className="font-bold">three years of experience</span> in
            software development, I&apos;ve actively contributed to diverse
            industries such as delivery, live streaming, advertising and so on.
          </p>
          <p>
            If there are any opportunities to build interesting projects, feel
            free to{" "}
            <a href={emailLink} className="hover:underline font-bold">
              contact me
            </a>
            .
          </p>
        </div>
      </div>

      {/* Work Experience */}
      <div>
        <h2 className="font-bold text-xl">Work Experience</h2>
        <div className="flex flex-col w-full divide-y">
          {experience.map((e, index) => (
            <div className="flex flex-col py-2" key={index}>
              <div className="flex justify-between items-center">
                <div>
                  <a
                    href={e.companyLink}
                    target="_blank"
                    className="hover:underline font-semibold text-lg"
                    rel="noreferrer"
                  >
                    {e.company}
                  </a>
                  <Badge variant="outline" className="mx-2 font-mono">
                    {e.field}
                  </Badge>
                </div>

                <p>{e.date}</p>
              </div>
              <p>{e.title}</p>
              <p className="text-sm text-muted-foreground">{e.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="flex flex-col">
        <h2 className="font-bold text-xl">Projects</h2>
        <div className="flex flex-col divide-y">
          {projects.map((p, index) => (
            <div className="w-full py-2" key={index}>
              <div className="flex flex-col gap-1">
                <a
                  href={p.link}
                  key={index}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline font-semibold text-lg w-fit"
                >
                  {p.title}
                </a>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="flex gap-1 flex-wrap">
                  {p.badge.map((b, idx) => (
                    <Badge key={idx} variant="outline" className="font-mono">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="font-bold text-xl">Education</h2>
        <div className="flex flex-col">
          <div className="flex justify-between items-center py-2">
            <div>
              <a
                href="https://new.ntpu.edu.tw/?lang=en"
                className="hover:underline font-semibold text-lg"
              >
                National Taipei University
              </a>
            </div>

            <p>2019 - 2024</p>
          </div>
          <p className="text-sm text-muted-foreground">Computer Science</p>
        </div>
      </div>
    </main>
  );
}
