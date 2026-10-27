import { useEffect, useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useMotionPreference } from '../utils/useMotionPreference';

export default function ProjectMedia({ image, video, title, caption, motionEnabled = true }) {
  const id = useId();
  const videoId = `${id}-preview`;
  const captionId = `${id}-caption`;
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
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
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
    return () => {
      cancelled = true;
    };
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
    <figure ref={figureRef} className="project-media">
      <div className="media-frame" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className="media-image"
        />
        {!failed && (
          <video
            id={videoId}
            ref={videoRef}
            src={shouldLoad ? video.src : undefined}
            poster={image.src}
            muted
            loop
            playsInline
            preload="none"
            aria-label={title}
            aria-describedby={captionId}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
            className="media-video"
            hidden={reducedMotion && playback !== true}
          />
        )}
      </div>
      <figcaption id={captionId} className="media-caption">
        <p>{failed ? 'Preview unavailable. The screenshot is shown instead.' : caption}</p>
        <div className="media-actions">
          {!failed && (
            <button type="button" aria-controls={videoId} onClick={togglePlayback}>
              {playing ? 'Pause preview' : 'Play preview'}
            </button>
          )}
          <a href={image.src} target="_blank" rel="noreferrer">
            View screenshot <span aria-hidden="true">↗</span>
          </a>
        </div>
      </figcaption>
    </figure>
  );
}

ProjectMedia.propTypes = {
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  motionEnabled: PropTypes.bool,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  video: PropTypes.shape({ src: PropTypes.string.isRequired }).isRequired,
};
