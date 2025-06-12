import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  TextField, 
  Button,
  Stack
} from '@mui/material';
import VideoPlayer from './VideoPlayer';
import LocalVideoPlayer from './LocalVideoPlayer';
import CustomVideoPlayer from './CustomVideoPlayer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`video-tabpanel-${index}`}
      aria-labelledby={`video-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const VideoPlayerDemo: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [customUrl, setCustomUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [localUrl, setLocalUrl] = useState('/videos/sample.mp4');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const sampleVideos = [
    {
      title: 'YouTube видео',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Стандартное YouTube видео'
    },
    {
      title: 'Локальное видео (MP4)',
      url: '/videos/sample.mp4',
      description: 'Локальный видео файл в формате MP4'
    },
    {
      title: 'Веб-видео',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      description: 'Образец видео из интернета'
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Демонстрация видеоплееров
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="видео плееры"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Универсальный плеер" />
          <Tab label="Локальный плеер" />
          <Tab label="Кастомный плеер" />
          <Tab label="Примеры" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Универсальный плеер с переключением режимов
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="URL видео"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              fullWidth
              helperText="Введите URL YouTube видео или локального файла"
            />
            <VideoPlayer videoUrl={customUrl} title="Демо видео" />
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Локальный видеоплеер
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="URL локального видео"
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              fullWidth
              helperText="Введите путь к локальному видео файлу"
            />
            <LocalVideoPlayer videoUrl={localUrl} title="Локальное видео" />
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Кастомный плеер
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="URL видео"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              fullWidth
              helperText="Поддерживает YouTube и локальные файлы"
            />
            <CustomVideoPlayer 
              videoUrl={customUrl} 
              title="Кастомное видео"
              onTimeUpdate={(currentTime, duration) => {
                console.log(`Время: ${currentTime}/${duration}`);
              }}
              onEnded={() => {
                console.log('Видео завершено');
              }}
            />
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Примеры различных типов видео
          </Typography>
          <Stack spacing={3}>
            {sampleVideos.map((video, index) => (
              <Box key={index}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {video.description}
                </Typography>
                <VideoPlayer videoUrl={video.url} title={video.title} />
              </Box>
            ))}
          </Stack>
        </TabPanel>
      </Paper>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Инструкции по использованию
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • <strong>Универсальный плеер</strong> - автоматически определяет тип видео и предлагает переключение между режимами<br/>
          • <strong>Локальный плеер</strong> - оптимизирован для локальных видео файлов<br/>
          • <strong>Кастомный плеер</strong> - полный контроль с дополнительными функциями<br/>
          • Для YouTube видео используйте стандартные URL (youtube.com/watch?v=...)<br/>
          • Для локальных файлов используйте относительные пути (/videos/file.mp4)
        </Typography>
      </Paper>
    </Box>
  );
};

export default VideoPlayerDemo; 