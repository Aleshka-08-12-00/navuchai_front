import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

interface TestTimerProps {
  timeLimit: number; // в секундах
  onTimeEnd?: () => void;
  label?: string;
}

const TestTimer: React.FC<TestTimerProps> = ({ timeLimit, onTimeEnd }) => {
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);

  useEffect(() => {
    if (timeLimit === 0) return;

    if (secondsLeft <= 0) {
      onTimeEnd?.();
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
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: "#e3f2fd",
        borderRadius: 2,
        px: 2,
        py: 1,
        mb: 2,
        display: "inline-block",
        textAlign: "center",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color={secondsLeft <= 10 && timeLimit !== 0 ? "error" : "primary"}
      >
        {timeLimit === 0
          ? "Время не ограничено"
          : `Осталось времени: ${formatTime(secondsLeft)}`}
      </Typography>
    </Box>
  );
};

export default TestTimer;
