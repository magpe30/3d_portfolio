import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import PropTypes from 'prop-types';

const FOLLOWER_WIDTH = 236;
const FOLLOWER_HEIGHT = 52;
const POINTER_GAP = 20;

export default function ExperienceRow({ job, index, animate }) {
  const [following, setFollowing] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 32, mass: 0.55 });
  const springY = useSpring(y, { stiffness: 320, damping: 32, mass: 0.55 });

  useEffect(() => {
    if (!following) return undefined;
    const hide = () => setFollowing(false);
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('resize', hide);
    window.addEventListener('blur', hide);
    return () => {
      window.removeEventListener('scroll', hide);
      window.removeEventListener('resize', hide);
      window.removeEventListener('blur', hide);
    };
  }, [following]);

  const follow = (event) => {
    if (
      !animate ||
      event.pointerType === 'touch' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    )
      return;

    // Keep the label beside the pointer, flipping at the viewport edges.
    const nextX =
      event.clientX + POINTER_GAP + FOLLOWER_WIDTH > window.innerWidth - 12
        ? Math.max(12, event.clientX - POINTER_GAP - FOLLOWER_WIDTH)
        : event.clientX + POINTER_GAP;
    const nextY =
      event.clientY + POINTER_GAP + FOLLOWER_HEIGHT > window.innerHeight - 12
        ? Math.max(12, event.clientY - POINTER_GAP - FOLLOWER_HEIGHT)
        : event.clientY + POINTER_GAP;
    x.set(nextX);
    y.set(nextY);
    if (!following) {
      springX.jump(nextX);
      springY.jump(nextY);
      setFollowing(true);
    }
  };

  return (
    <article aria-labelledby={`job-${index}`}>
      <a
        className="experience-row"
        href={job.url}
        target="_blank"
        rel="noreferrer"
        aria-labelledby={`job-${index} job-action-${index}`}
        data-cursor={animate ? 'enabled' : 'disabled'}
        onPointerEnter={follow}
        onPointerMove={follow}
        onPointerLeave={() => setFollowing(false)}
        onPointerCancel={() => setFollowing(false)}
        onBlur={() => setFollowing(false)}
        onClick={() => setFollowing(false)}
      >
        <span className="micro job-index" aria-hidden="true">
          0{index + 1}
        </span>
        <div>
          <h3 id={`job-${index}`} className="heading heading--title">
            {job.company}
          </h3>
          <p className="job-dates micro">{job.dates}</p>
        </div>
        <div className="job-detail">
          <p className="job-role">{job.role}</p>
          <p>{job.description}</p>
          <p className="micro job-stack">{job.stack}</p>
          <span id={`job-action-${index}`} className="company-link">
            Visit company website<span className="sr-only"> (opens in a new tab)</span>
          </span>
        </div>
        <span className="job-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
      {createPortal(
        <motion.div
          className="company-cursor"
          aria-hidden="true"
          style={{ x: springX, y: springY, width: FOLLOWER_WIDTH, height: FOLLOWER_HEIGHT }}
          initial={false}
          animate={{ opacity: following && animate ? 1 : 0, scale: following && animate ? 1 : 0.9 }}
          transition={{ duration: animate ? 0.22 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>Visit company website</span>
          <span aria-hidden="true">↗</span>
        </motion.div>,
        document.body,
      )}
    </article>
  );
}

ExperienceRow.propTypes = {
  job: PropTypes.shape({
    company: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    dates: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    stack: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  animate: PropTypes.bool.isRequired,
};
