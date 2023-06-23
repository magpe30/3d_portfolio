import {
  candlesEcommerce,
  carSearch,
  codepen,
  github,
  gmail,
  linked,
  mainWebsite,
  motive,
  motorway,
  visionogy
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
      desc: "Working as a Junior Frontend Engineer in a small, agile squad comprising talented designers, quality assurance specialists, developers, and a dedicated project manager. Together, we collaborated on a client-facing application within a fast-paced environment.",
    },
    {
      title: "Junior Frontend Engineer",
      company_name: "Motive Create",
      icon: motive,
      iconBg: "#E6DEDD",
      date: "Aug 2021 - Oct 2021",
      desc: "As a Junior Frontend Engineer, I worked closely with SDK developers on connecting the APIs and improving the API’s performance."
    },
    {
      title: "Fullstack Developer",
      company_name: "Visionogy",
      icon: visionogy,
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

