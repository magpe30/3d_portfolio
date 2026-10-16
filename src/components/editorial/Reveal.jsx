import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function Reveal({ children, className = '', animate = true, delay = 0 }) {
  return (
    <motion.div className={className}
      initial={animate ? { opacity: 0, y: 36 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .12 }}
      transition={{ duration: animate ? .85 : 0, delay: animate ? delay : 0, ease: [.22, 1, .36, 1] }}
    >{children}</motion.div>
  );
}
Reveal.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animate: PropTypes.bool,
  delay: PropTypes.number,
};
