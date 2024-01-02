import {
  EnvelopeClosedIcon,
  FileTextIcon,
  GitHubLogoIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";

export const emailLink = "mailto:me@chiendavid.com";

export const socialMediaLinks = [
  {
    icon: <GitHubLogoIcon className="w-full h-full" />,
    name: "GitHub",
    link: "https://github.com/f312213213",
  },
  {
    icon: <InstagramLogoIcon className="w-full h-full" />,
    link: "https://www.instagram.com/yeeggg_/",
    name: "Instagram",
  },
  {
    icon: <LinkedInLogoIcon className="w-full h-full" />,
    link: "https://www.linkedin.com/in/davidchien419",
    name: "LinkedIn",
  },
  {
    icon: <EnvelopeClosedIcon className="w-full h-full" />,
    link: emailLink,
    name: "Email",
  },
  {
    icon: <FileTextIcon className="w-full h-full" />,
    link: "../cv",
    name: "Formal CV",
  },
];

export const experience = [
  {
    title: "Software Engineer Intern",
    company: "Appier",
    field: "Frontend",
    date: "2023 / 7 - Present",
    description: "Join the first software unicorn in Taiwan.",
    companyLink: "https://www.appier.com/",
  },
  {
    title: "Software Engineer",
    company: "Lang Live",
    field: "Frontend",
    date: "2022 / 6 - 2023 / 6",
    description:
      "Maintain web version of the largest streaming platform in Taiwan. My first full time internship in the industry.",
    companyLink: "https://www.lang.live",
  },
  {
    title: "Software Engineer",
    company: "Dimorder",
    field: "Frontend",
    date: "2022 / 2 - 2023 / 2",
    description:
      "Leading a community in my college. Introduce google products, basic programming skills to other students.",
    companyLink: "https://www.dimorder.com/",
  },
];

export const projects = [
  {
    title: "NTPU Past Exam",
    badge: ["Next.js", "Fast API", "Zeabuar", "AWS", "Cloud Run"],
    description:
      "A full-stack website that provides past exams for students in National Taipei University.",
    link: "https://past-exam.ntpu.cc",
  },
  {
    title: "NTPU All Star",
    badge: ["Next.js", "Vercel", "Firebase"],
    description:
      "A full-stack voting system for selecting the highest-rated player.",
    link: "https://ntpu-all-star-2023-vote.vercel.app/vote",
  },
];
