import {
  candlesEcommerce,
  carSearch,
  codepen,
  github,
  gmail,
  linked,
  mainWebsite,
  motorway,
  roadra,
  visionogy
} from "../assets";
  
export const navLinks = [
    {
      id: "about",
      title: "// about",
    },
    {
      id: "work",
      title: "// work",
    },
    {
      id: "contact",
      title: "// contact",
    },
];
  
const experiences = [
    {
      title: "Software Developer",
      company_name: "Roadra",
      link: "https://www.roadra.com",
      location: "San Diego, CA",
      icon: roadra,
      tech: ["Vue", "Vuex", "Node", "AWS", "MongoDB"],
      iconBg: "#E6DEDD",
      date: "June 2023",
      desc: "I am the third developer working alongside two founders at a startup, where I focus on maintaining the core app and tools for agents. In addition to maintaining existing systems, I rapidly develop new features to meet evolving business needs and support the growth of our product."
    },
    {
      title: "Junior Frontend Engineer",
      company_name: "Motorway",
      link: "https://www.motorway.co.uk",
      location: "London, UK",
      icon: motorway,
      tech: ["React", "Redux", "Jest", "Node", "TS"],
      iconBg: "#383E56",
      date: "Oct 2021 - Mar 2023",
      desc: "Working as a Junior Frontend Engineer in a small, agile squad comprising talented designers, quality assurance specialists, developers, and a dedicated project manager. Together, we collaborated on a client-facing application within a fast-paced environment.",
    },
    {
      title: "Fullstack Developer",
      company_name: "Visionogy",
      link: "https://www.visionogy.com/",
      location: "London, UK",
      icon: visionogy,
      tech: ["HTML", "CSS", "JS", "Node", "Firebase"],
      iconBg: "#383E56",
      date: "Jan 2021 - Jul 2021",
      desc: "My job was mostly focused on designing and developing frontend and backend for a SaaS platform and website. I implemented responsive design and ensured cross-browser compatibility.",
    },
];
  
const projects = [
    {
      name: "Car platform",
      description: "Full stack platform for searching and booking cars with log in and account page.",
      tags: [
        {
          name: "next.js",
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
          name: "tailwindCSS",
          color: "pink-text-gradient",
        },
      ],
      image: carSearch,
      source_code_link: "https://github.com/magpe30/car_search",
    },
    {
      name: "Candles E-commerce",
      description:
        "E-commerce platform that offers a range of features, including seamless product addition and integration with the Stripe payment system. Additionally, users can explore blog and leave comments.",
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
      image: candlesEcommerce,
      source_code_link: "https://github.com/magpe30/ecommerce_app",
    },
    {
      name: "Visionogy product",
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
      image: mainWebsite,
      source_code_link: "https://www.visionogy.com/",
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

