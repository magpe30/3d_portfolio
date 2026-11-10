import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';

// Complete the transition when the section's bottom reaches the viewport's
// bottom, so even the final section can reach its destination color.
export default function ColorSection({ animate, from, to, children, ...props }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const backgroundColor = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.section
      {...props}
      ref={ref}
      style={{ backgroundColor: animate ? backgroundColor : to }}
    >
      {children}
    </motion.section>
  );
}

ColorSection.propTypes = {
  animate: PropTypes.bool.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
