import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import PropTypes from 'prop-types';

const FOLLOWER_WIDTH = 176;
const FOLLOWER_HEIGHT = 56;

export default function ExperienceLink({ job, index, animate }) {
  const [following, setFollowing] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 210, damping: 27, mass: .65 });
  const springY = useSpring(y, { stiffness: 210, damping: 27, mass: .65 });

  useEffect(() => {
    if (!following) return undefined;
    const hide = () => setFollowing(false);
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('blur', hide);
    window.addEventListener('resize', hide);
    return () => {
      window.removeEventListener('scroll', hide);
      window.removeEventListener('blur', hide);
      window.removeEventListener('resize', hide);
    };
  }, [following]);

  const follow = (event, entering = false) => {
    if (!animate || event.pointerType === 'touch' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    // Flip near the viewport edges so the label never covers the pointer or clips.
    const nextX = event.clientX + FOLLOWER_WIDTH + 28 > window.innerWidth
      ? Math.max(12, event.clientX - FOLLOWER_WIDTH - 20) : event.clientX + 20;
    const nextY = event.clientY + FOLLOWER_HEIGHT + 28 > window.innerHeight
      ? Math.max(12, event.clientY - FOLLOWER_HEIGHT - 20) : event.clientY + 20;
    x.set(nextX);
    y.set(nextY);
    if (entering || !following) {
      springX.jump(nextX);
      springY.jump(nextY);
      setFollowing(true);
    }
  };

  return (
    <>
      <a className="experience-row" href={job.url} target="_blank" rel="noreferrer"
        data-follow={animate ? 'on' : 'off'}
        aria-label={`${job.company} — Visit the page (opens in a new tab)`}
        onPointerEnter={(event) => follow(event, true)} onPointerMove={follow}
        onPointerLeave={() => setFollowing(false)} onPointerCancel={() => setFollowing(false)}
        onBlur={() => setFollowing(false)} onClick={() => setFollowing(false)}>
        <span className="micro job-index">0{index + 1}</span>
        <div><h3 className="heading heading--title">{job.company}</h3><p className="job-dates micro">{job.dates}</p></div>
        <div className="job-detail"><p className="job-role">{job.role}</p><p>{job.description}</p><p className="micro job-stack">{job.stack}</p></div>
        <span className="job-action" aria-hidden="true">
          <span className="job-visit">Visit the page</span>
          <svg className="job-mark" viewBox="0 0 32 32" fill="none"><path d="M5 16h22M18 7l9 9-9 9" stroke="currentColor" strokeWidth="2" /></svg>
        </span>
      </a>
      {createPortal(
        <motion.div className="visit-follower" aria-hidden="true" style={{ x: springX, y: springY }}
          initial={false} animate={{ opacity: following && animate ? 1 : 0, scale: following && animate ? 1 : .88 }}
          transition={{ duration: animate ? .24 : 0, ease: [.22, 1, .36, 1] }}>
          <span>Visit the page</span><span className="visit-follower-arrow">↗</span>
        </motion.div>, document.body)}
    </>
  );
}

ExperienceLink.propTypes = {
  job: PropTypes.shape({
    company: PropTypes.string.isRequired, url: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired, dates: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired, stack: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  animate: PropTypes.bool.isRequired,
};
