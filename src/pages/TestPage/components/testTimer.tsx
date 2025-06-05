import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

interface testTimerProps {
  timeLimit: number; // в секундах
  onTimeEnd?: () => void; // колбэк при завершении таймера
}

const testTimer: React.FC<testTimerProps> = ({ timeLimit, onTimeEnd }) => {
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeEnd) onTimeEnd();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeEnd]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Typography variant="h6" color={secondsLeft <= 10 ? 'error' : 'textPrimary'}>
      Осталось времени: {formatTime(secondsLeft)}
    </Typography>
  );
};

export default testTimer;
