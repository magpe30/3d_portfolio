import {
  codepen,
  galaxy,
  github,
  gmail,
  linked,
  motive,
  motorway,
  visionogy,
  visionogysite,
} from "../assets";
  
export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
];
  
const experiences = [
    {
      title: "Junior Frontend Engineer",
      company_name: "Motorway",
      icon: motorway,
      iconBg: "#383E56",
      date: "Oct 2021 - Mar 2023",
      points: [
        "Enhanced the user experience by releasing to production service history and wheel damage feature sections that automated and speed up the process of selling users cars.",
        "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
        "Developed campaign of emails and integrated them in Braze that generated new users and helped speed up the process of profile confirmations.",
        "Constantly improved the code base by writing new unit tests, migrating to TypeScript and converting to functional components.",
      ],
    },
    {
      title: "Junior Frontend Engineer",
      company_name: "Motive Create",
      icon: motive,
      iconBg: "#E6DEDD",
      date: "Aug 2021 - Oct 2021",
      points: [
        "Created skeleton pages and basic logic using proprietary tech and internal tools.",
        "Worked closely with SDK developers on connecting the APIs and improving the API’s performance.",
      ],
    },
    {
      title: "Fullstack Developer",
      company_name: "Visionogy",
      icon: visionogy,
      iconBg: "#383E56",
      date: "Jan 2021 - Jul 2021",
      points: [
        "Designed and developed frontend and backend for a SaaS platform and website.",
        "Implementing responsive design and ensuring cross-browser compatibility.",
      ],
    },
];
  
const projects = [
    {
      name: "Candles E-commerce",
      description:
        "E-commerce platform that contains all the essentials for adding products and Stripe as payment system. Users can also browse through a blog and leave comments",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "django",
          color: "pink-text-gradient",
        },
        {
          name: "stripe",
          color: "blue-text-gradient",
        },
        {
          name: "redux",
          color: "pink-text-gradient",
        },
        {
          name: "graphQL",
          color: "blue-text-gradient",
        },
      ],
      image: "https://user-images.githubusercontent.com/67764650/230641269-6c4beafc-c7de-4acd-9052-05ab93c5a6b1.png",
      source_code_link: "https://github.com/magpe30/ecommerce_app",
    },
    {
      name: "Dictionary",
      description:
        "Web application that enables users to search for word definitions and pronunciation.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "typescript",
          color: "pink-text-gradient",
        },
        {
          name: "scss",
          color: "blue-text-gradient",
        },
      ],
      image: 'https://user-images.githubusercontent.com/67764650/221048004-8952ea18-33db-48d9-bfc4-40aa413bf0c4.png',
      source_code_link: "https://github.com/magpe30/dictionary_app",
    },
    {
      name: "Visionogy web & platform",
      description:
        "A comprehensive and responsive website & platform for a startup called Visionogy, showing their product.",
      tags: [
        {
          name: "javascript",
          color: "blue-text-gradient",
        },
        {
          name: "node.js",
          color: "pink-text-gradient",
        },
        {
          name: "express",
          color: "blue-text-gradient",
        },
        {
          name: "firebase",
          color: "pink-text-gradient",
        },
      ],
      image: visionogysite,
      source_code_link: "https://www.visionogy.com/",
    },
    {
      name: "Galaxy",
      description:
        "Used three js and shaders to build galaxy 3d. It was a part of a three.js course",
      tags: [
        {
          name: "threejs",
          color: "blue-text-gradient",
        },
        {
          name: "shaders",
          color: "pink-text-gradient",
        },
      ],
      image: galaxy,
      source_code_link: "https://codepen.io/Mag_90/pen/KKBEpwz",
    },
];

const contactLinks = [
  { 
    name: "email",
    img: gmail,
    link: "mpelka892@gmail.com"
  },
  { 
    name: "linkedIn",
    img: linked,
    link: "https://www.linkedin.com/in/magdalena-pelka-17443217a/"
  },
  {
    name: 'github',
    img: github,
    link: "https://github.com/magpe30"
  },
  {
    name: "codepen",
    img: codepen,
    link: "https://codepen.io/Mag_90/"
  }
];
  
  export { contactLinks, experiences, projects };
