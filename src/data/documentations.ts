import { IDocumentation } from "../interfaces/IDocumentation";

const documentations: IDocumentation[] = [
  {
    name: "Next.js",
    id: "next_js",
    description: "A React framework for building full-stack web applications",
    url: "https://nextjs.org/docs",
    icon: "https://nextjs.org/favicon.ico",
    author: "Vercel",
    tags: ["Fullstack"],
    languages: ["JavaScript", "TypeScript"],
    difficulty: "Intermediate",
  },
  {
    name: "React",
    id: "react",
    description: "The library for web and native user interfaces",
    url: "https://react.dev/learn",
    icon: "https://react.dev/favicon-32x32.png",
    author: "Meta Open Source",
    tags: ["Frontend"],
    languages: ["JavaScript", "TypeScript"],
    difficulty: "Beginner",
  },
  {
    name: "Tailwind CSS",
    id: "tailwind_css",
    description: "The library for web and native user interfaces",
    url: "https://tailwindcss.com/docs/installation",
    icon: "https://tailwindcss.com/favicons/favicon-32x32.png?v=3",
    author: "Tailwind Labs Inc.",
    tags: ["Frontend"],
    languages: ["CSS"],
    difficulty: "Beginner",
  },
];

export default documentations;
