'use client';

import { useState, useEffect } from 'react';

export default function CacheTimer() {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const fetchTimestamp = async () => {
      try {
        const response = await fetch('/api/cache-timestamp');
        const { timestamp } = await response.json();
        const elapsed = Math.floor((Date.now() - timestamp) / 1000);
        return Math.max(0, 300 - elapsed);
      } catch {
        // Remove error parameter since it's not used
        return 300;
      }
    };

    fetchTimestamp().then(setTimeLeft);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          fetchTimestamp().then(setTimeLeft);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed bottom-2 left-2 text-xs text-gray-400/50 hover:text-gray-400 transition-colors">
      <span className="font-mono">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}