import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function Reveal({ children, className = '', animate = true, delay = 0 }) {
  return (
    <motion.div
      className={`reveal ${className}`.trim()}
      initial={animate ? { opacity: 0, y: 36 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: animate ? 0.85 : 0,
        delay: animate ? delay : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
Reveal.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animate: PropTypes.bool,
  delay: PropTypes.number,
};
