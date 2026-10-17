import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useMotionPreference } from '../utils/useMotionPreference';

export default function ProjectMedia({ image, video, motionEnabled = true }) {
  const figureRef = useRef(null);
  const videoRef = useRef(null);
  const systemReducedMotion = useMotionPreference();
  const reducedMotion = systemReducedMotion || !motionEnabled;
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [playback, setPlayback] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const shouldPlay = visible && pageVisible && !failed && (playback ?? !reducedMotion);
  const shouldLoad = !failed && (hasLoaded || playback === true || (visible && !reducedMotion));

  useEffect(() => {
    if (shouldLoad) setHasLoaded(true);
  }, [shouldLoad]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(figureRef.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    // A changed system preference also stops a previously requested preview.
    setPlayback(null);
  }, [reducedMotion]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return undefined;
    let cancelled = false;
    if (shouldPlay && shouldLoad && !autoplayBlocked) {
      element.play().catch((error) => {
        if (!cancelled && error.name !== 'AbortError') setAutoplayBlocked(true);
      });
    } else {
      element.pause();
    }
    return () => { cancelled = true; };
  }, [shouldPlay, shouldLoad, autoplayBlocked]);

  const togglePlayback = () => {
    const element = videoRef.current;
    if (!element.paused) {
      setPlayback(false);
      element.pause();
    } else {
      setAutoplayBlocked(false);
      setPlayback(true);
      // Keep an explicit play request in the user gesture for mobile browsers.
      if (!element.getAttribute('src')) element.src = video.src;
      element.play().catch((error) => {
        if (error.name !== 'AbortError') setAutoplayBlocked(true);
      });
    }
  };

  return (
    <figure ref={figureRef} className="project-media border-b border-white/[0.15]">
      <div className="relative bg-[#090d11]" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className="block w-full h-full object-contain"
        />
        {!failed && (
          <video
            id="ride-preview"
            ref={videoRef}
            src={shouldLoad ? video.src : undefined}
            poster={image.src}
            muted
            loop
            playsInline
            preload="none"
            aria-label="RIDE SD ride playback preview"
            aria-describedby="ride-media-caption"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => { setFailed(true); setPlaying(false); }}
            className={`absolute inset-0 w-full h-full object-contain ${reducedMotion && playback !== true ? 'invisible' : ''}`}
          />
        )}
      </div>
      <figcaption id="ride-media-caption" className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 px-5 sm:px-8 py-3 text-sm text-white/75">
        <p>Ride playback, from speed profile to corner detail.</p>
        <div className="flex flex-wrap items-center gap-5">
          {!failed && <button type="button" aria-controls="ride-preview" onClick={togglePlayback} className="min-h-[44px] hover:text-white">{playing ? 'Pause preview' : 'Play preview'}</button>}
          <a href={image.src} target="_blank" rel="noreferrer" className="inline-flex items-center min-h-[44px] hover:text-white">View screenshot <span aria-hidden="true" className="ml-2">↗</span></a>
        </div>
      </figcaption>
    </figure>
  );
}

ProjectMedia.propTypes = {
  motionEnabled: PropTypes.bool,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  video: PropTypes.shape({ src: PropTypes.string.isRequired }).isRequired,
};
