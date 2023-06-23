/* eslint-disable react-refresh/only-export-components */
import { motion } from "framer-motion";
import React from "react";
import { experiences } from "../constants";

import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { fadeIn, textAnimation } from "../utils/motion";



const Experience = () => {
  return (
    <>
      <motion.div variants={textAnimation()}>
        <p className={`${styles.sectionSubText} mt-6`}>
          What I have done so far
        </p>
        <h2 className={`${styles.sectionHeadText}`}>
          Work Experience
        </h2>
        <div className="divider"></div>
        <div className="mainGradient setLeft" />
      </motion.div>

      <div className='mt-20 flex cardExperienceContainer'>
            { experiences.map((experience, index) => 
            
              <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)} key={index} className="mb-6">
                <img 
                  src={experience.icon}
                  alt='company logo'
                  className='w-10 h-10 object-contain grayscale'
                  loading="lazy"
                >
                </img>
                <h1 className="mb-2 mt-6 font-bold text-[20px]">
                  {experience.company_name}
                </h1>
                <p>{experience.date}</p>
                <p className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'>
                  {experience.desc}
                </p>
              </motion.div>)
            }
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");