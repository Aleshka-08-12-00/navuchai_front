import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TimeLinearProps {
  timeInSeconds: number;      // Время, затраченное на тест, в секундах
  maxTimeInSeconds: number;   // Максимально допустимое время
}

export default function TimeLinear({ timeInSeconds, maxTimeInSeconds }: TimeLinearProps) {
  const progress = Math.min((timeInSeconds / maxTimeInSeconds) * 100, 100);

  // Преобразуем в формат MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'wrap', justifyContent: 'space-between', textAlign: 'center' }}>
      <Box sx={{ width: '70%', mb: 1, mt: 0.5}}>
        <LinearProgress
          variant="determinate"
          value={progress}
          
          sx={{ height: 10, borderRadius: 3 }}
        />
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary'}}>
        {formatTime(timeInSeconds)} / {formatTime(maxTimeInSeconds)} мин
      </Typography>
    </Box>
  );
}

