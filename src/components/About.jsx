/* eslint-disable react-refresh/only-export-components */
import { motion } from 'framer-motion';
import { profilePicture } from '../assets';
import { SectionWrapper } from "../hoc";

import { styles } from '../styles';
import { fadeIn, textAnimation } from '../utils/motion';

const ServiceCard = () => (
  <div className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", 0.5, 0.75)}
      className='w-full blue-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        // eslint-disable-next-line react/no-unknown-property
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[230px] flex justify-evenly items-center flex-col'
      >
        <img
          src={profilePicture}
          alt='profile picture'
          className='w-35 h-35 rounded-full object-contain'
        />
      </div>
    </motion.div>
  </div>
);

const About = () => {

  return (
    <div className='lg:flex justify-between'>
      <div>
        <motion.div variants={textAnimation()}>
          <p className={styles.sectionSubText}>Introduction</p>
          <h2 className={`${styles.sectionHeadText} textGradientHeadline`}>About me</h2>
          <div className="divider"></div>
        </motion.div>

        <motion.p 
          variants={fadeIn('', '', 0.2, 1)}
          className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          I am a highly motivated developer with a deep interest in creating visually rich applications, 
          drawing on my background in film and photography. Visual aesthetics are important to me, and I enjoy 
          crafting user-friendly interfaces that are both functional and visually appealing. My work centers on 
          creating engaging user experiences, which I find incredibly rewarding. I am passionate about the 
          intersection of technology and creativity, and writing clean, accessible code is a priority. 
          I'm always eager to take on new challenges and explore innovative solutions
        </motion.p>
      </div>
      <div className='mt-20 flex flex-wrap gap-10'>
        <ServiceCard />
      </div>
    </div>
  )
}

export default SectionWrapper(About, 'about');