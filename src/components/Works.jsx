import { motion } from "framer-motion";
import React from "react";

import { rightArrow } from '../assets';

import { projects } from "../constants";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textAnimation } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  image,
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <div className="workCard">
        <div className='relative w-full h-full'>
            <img
              src={image}
              alt='project_image'
              loading="lazy"
              className='max-w-[350px] rounded-2xl'
            />
        </div>
        <div className="py-[24px] px-[24px] max-w-[350px] h-[200px] bg-[#121522] cardImage">
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[15px]'>{description}</p>
        </div>
        <div className="divider"></div>
        <div onClick={() => window.open(source_code_link, "_blank")} className="py-5 px-3 flex justify-between cursor-pointer">
           <p>View project</p>
           <img src={rightArrow} alt="right arrow"></img>
        </div>
      </div>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textAnimation()}>
        <p className={`${styles.sectionSubText} `}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects</h2>
        <div className="divider"></div>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          A selection of projects I have built, using modern tech.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "works");