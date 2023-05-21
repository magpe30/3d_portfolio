import React, { useRef, useState, Suspense } from "react";
import { motion } from "framer-motion";
import Spline from '@splinetool/react-spline';

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { Loader } from '../components';
import { slideIn, fadeIn } from "../utils/motion";
import { contactLinks } from '../constants';

const Contact = () => {

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] p-8 z-10'
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact</h3>
        <p>Let's connect! Drop me a line if you fancy a chat.</p>
        <div className='flex-[0.75] rounded-2xl my-10 flex flex-wrap justify-start gap-7 items-center z-10'>
          {
            contactLinks.map((link) => 
            <div className='xs:w-[100px]'>
              <motion.div
                variants={fadeIn("right", "spring", 0.5, 0.75)}
                className='w-full blue-gradient p-[1px] rounded-[20px]'
              >
                <div
                  // eslint-disable-next-line react/no-unknown-property
                  options={{
                    max: 45,
                    scale: 1,
                    speed: 450,
                  }}
                  className='bg-tertiary rounded-[20px] py-2 px-1 flex justify-evenly items-center flex-col'
                >
                  <a href={link.name === "email" ? `mailto:${link.link}`: link.link} target="_blank">
                    <img
                      src={link.img}
                      alt={link.name}
                      className='w-10 h-10 rounded-full object-contain'
                    />
                  </a>
                </div>
              </motion.div>
            </div>
            )
          } 
        </div>
      </motion.div>
      <Suspense fallback={<Loader />}>
        <Spline className="splineButton" scene='https://prod.spline.design/1vcGr0ORyCbons11/scene.splinecode' />
      </Suspense>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");