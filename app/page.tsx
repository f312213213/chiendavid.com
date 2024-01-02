import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { experience, projects, socialMediaLinks } from "@/config";

export default function Home() {
  return (
    <main className="antialiased max-w-2xl flex flex-col py-10 mx-4 md:mx-auto gap-4">
      {/* Basic Info */}
      <div className="flex justify-between w-full gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-2xl flex items-center">David Chien</h1>
          <div className="flex flex-col justify-center gap-1">
            <p>Juggling my time between bench pressing and coding.</p>
            <p>Passionate about web development.</p>
          </div>

          <div className="flex gap-2 place-items-center w-full">
            {socialMediaLinks.map(({ icon, link }, index) => (
              <Button key={index} variant="outline" size="icon">
                <a
                  className="w-full h-full p-2"
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {icon}
                </a>
              </Button>
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
        <h2 className="font-bold text-xl my-4">About</h2>
        <p className="w-full text-sm text-muted-foreground">
          I&apos;m a software engineer based in Taipei, Taiwan. I&apos;m
          currently a senior at National Taipei University, majoring in Computer
          Science.
        </p>
      </div>

      {/* Work Experience */}
      <div>
        <h2 className="font-bold text-xl my-4">Work Experience</h2>
        <div className="flex flex-col w-full">
          {experience.map((e, index) => (
            <div
              className="flex flex-col border-b last:border-0 py-2"
              key={index}
            >
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
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-xl my-4">Projects</h2>
        <div className="flex flex-col gap-2">
          {projects.map((p, index) => (
            <a
              href={p.link}
              className="w-full print:border-b last:border-0"
              key={index}
              target="_blank"
              rel="noreferrer"
            >
              <div className="hidden print:flex flex-col py-2">
                <p>{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {p.badge.map((b, idx) => (
                    <Badge key={idx} variant="outline" className="font-mono">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
              <Card className="print:hidden">
                <CardHeader>
                  <CardTitle>{p.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {p.description}
                  </p>
                </CardContent>

                <CardFooter>
                  <div className="flex gap-2 flex-wrap">
                    {p.badge.map((b, idx) => (
                      <Badge key={idx} variant="outline" className="font-mono">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="font-bold text-xl my-4">Education</h2>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
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
