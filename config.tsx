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
    description:
      "Developed a comprehensive log service enabling tracking of campaign operations for both managers and engineers, streamlined and consolidated similar code into a cohesive component with a focus on usability, and introduced new design system elements like Table, Chart, and Widget.",
    companyLink: "https://www.appier.com/",
  },
  {
    title: "Software Engineer",
    company: "Lang Live",
    field: "Frontend",
    date: "2022 / 6 - 2023 / 6",
    description:
      "Created a global React streaming web app, optimizing its performance by integrating WebGL for a 30% CPU reduction, streamlined gift animation algorithms, decreased API calls by 50% through a new recharge page flow, resolved over 1000 ESLint errors, and bolstered deployment confidence by implementing e2e testing in the CI pipeline for three products on GitLab.",
    companyLink: "https://www.lang.live",
  },
  {
    title: "Software Engineer",
    company: "Dimorder",
    field: "Frontend",
    date: "2022 / 2 - 2023 / 2",
    description:
      "Built a React.js-based Hong Kong food delivery platform and utilized Cordova to transform it into a mobile app, collaborating with UI/UX designers to implement a newly designed and intuitive homepage interface.",
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
