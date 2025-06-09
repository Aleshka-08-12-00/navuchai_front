import React, { useEffect, useState, useRef } from 'react';
import { Typography } from '@mui/material';

interface TestTimerProps {
  timeLimit: number; // в секундах, 0 — бесконечный
  onTimeEnd?: () => void;
}

const TestTimer: React.FC<TestTimerProps> = ({ timeLimit, onTimeEnd }) => {
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLimit === 0) return; // не запускаем таймер, если нет лимита

    setSecondsLeft(timeLimit); // сброс при старте
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimeEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLimit, onTimeEnd]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Typography variant="h6" color={secondsLeft <= 10 && timeLimit !== 0 ? 'error' : 'textPrimary'}>
      {timeLimit === 0
        ? 'Время не ограничено'
        : `Осталось времени: ${formatTime(secondsLeft)}`}
    </Typography>
  );
};

export default TestTimer;
