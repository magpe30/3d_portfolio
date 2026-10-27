import { useEffect, useState } from 'react';

export function useLocalTime(timeZone) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [timeZone]);
  return time;
}
