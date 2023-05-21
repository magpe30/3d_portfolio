import { Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { motion } from 'framer-motion';
import { Blob } from '../components';

import { styles } from '../styles';

const Hero = () => {
  return (
    <section className='relative w-full h-screen mx-auto'>
      <div
        className={`absolute inset-0 top-[120px]  z-30 max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 z-50`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-1 sm:h-80 h-40 blue-gradient rounded-t'/>
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hello, I am <span className='text-[#3551FF]'>Magda</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I enjoy building user <br className='sm:block hidden' />
            interfaces and responsive web applications
          </p>
        </div>
      </div>
      <div className="container">
        <Canvas camera={{ position: [0.0, 0.0, 8.0] }}>
          <Suspense fallback={<>Loading...</>}>
            <Blob />
          </Suspense>
        </Canvas>
      </div>
      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-2 border-primary blue-gradient flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  )
}

export default Hero