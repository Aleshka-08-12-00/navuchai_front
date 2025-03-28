import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TimeLinearProps {
  timeInSeconds: number; // Время, затраченное на тест, в секундах
}

const MAX_TIME = 720; // 12 минут = 720 секунд

export default function TimeLinear({ timeInSeconds }: TimeLinearProps) {
  // Рассчитываем процент заполненности
  const progress = Math.min((timeInSeconds / MAX_TIME) * 100, 100);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 3 }}/>
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} />
      </Box>
    </Box>
  );
}
