import { useCallback, useEffect, useState } from 'react';

export function useIntroLoading(enabled) {
  const [loading, setLoading] = useState(enabled);
  const [fontReady, setFontReady] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    // Explicitly request the face used in the first viewport, including its headline weight.
    Promise.all([
      document.fonts.load('400 16px "Manrope Variable"'),
      document.fonts.load('600 16px "Manrope Variable"'),
    ])
      .catch(() => {}) // The system font remains usable if the font request fails.
      .then(() => {
        if (!cancelled) setFontReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const complete = useCallback(() => setLoading(false), []);
  const skip = useCallback(() => {
    setUseFallback(true);
    setLoading(false);
  }, []);
  const reportHeroProgress = useCallback((value) => {
    setHeroProgress((previous) => Math.max(previous, value));
  }, []);

  useEffect(() => {
    if (!loading) return undefined;
    // A stalled import or font request must never block access to the portfolio.
    const timeout = window.setTimeout(skip, 10000);
    return () => window.clearTimeout(timeout);
  }, [loading, skip]);

  return {
    loading,
    useFallback,
    progress: Math.round((fontReady ? 25 : 0) + heroProgress * 75),
    reportHeroProgress,
    complete,
    skip,
  };
}
