import React, { useState } from 'react';
import { Box, Typography, Button, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CustomVideoPlayer from './CustomVideoPlayer';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title = "Видео урока" }) => {
  const [playerMode, setPlayerMode] = useState<'custom' | 'iframe'>('custom');
  const [iframeError, setIframeError] = useState(false);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    const cleanUrl = url.trim();
    
    console.log('Оригинальный URL видео:', cleanUrl);
    
    if (cleanUrl.includes('youtube.com/embed/')) {
      console.log('Уже embed URL:', cleanUrl);
      return cleanUrl;
    }
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([^&?/]+)/,
      /youtube\.com\/watch\?.*v=([^&]+)/,
      /youtu\.be\/([^?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        const embedUrl = `https://www.youtube.com/embed/${match[1]}`;
        console.log('Преобразованный embed URL:', embedUrl);
        return embedUrl;
      }
    }
    
    console.log('Не YouTube URL, возвращаем как есть:', cleanUrl);
    return cleanUrl;
  };

  const handleIframeError = () => {
    console.error('Ошибка загрузки iframe');
    setIframeError(true);
  };

  const handleIframeLoad = () => {
    console.log('Iframe успешно загружен');
    setIframeError(false);
  };

  const embedUrl = getEmbedUrl(videoUrl);

  const handlePlayerModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'custom' | 'iframe' | null,
  ) => {
    if (newMode !== null) {
      setPlayerMode(newMode);
    }
  };

  if (!embedUrl) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error" variant="body1">
          Ошибка: Не удалось обработать URL видео
        </Typography>
        <Typography variant="body2" color="text.secondary">
          URL: {videoUrl}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* Переключатель режимов плеера */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={playerMode}
          exclusive
          onChange={handlePlayerModeChange}
          aria-label="режим плеера"
        >
          <ToggleButton value="custom" aria-label="собственный плеер">
            <VideoLibraryIcon sx={{ mr: 1 }} />
            Собственный плеер
          </ToggleButton>
          <ToggleButton value="iframe" aria-label="iframe плеер">
            <PlayArrowIcon sx={{ mr: 1 }} />
            Iframe плеер
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Собственный видеоплеер */}
      {playerMode === 'custom' && (
        <CustomVideoPlayer 
          videoUrl={videoUrl} 
          title={title}
          onTimeUpdate={(currentTime, duration) => {
            console.log(`Время воспроизведения: ${currentTime}/${duration}`);
          }}
          onEnded={() => {
            console.log('Видео завершено');
          }}
        />
      )}

      {/* Iframe плеер */}
      {playerMode === 'iframe' && (
        <Paper sx={{ position: 'relative' }}>
          {iframeError ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Видео не может быть воспроизведено в iframe
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 2 }}
              >
                Открыть в YouTube
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIframeError(false)}
              >
                Попробовать снова
              </Button>
            </Box>
          ) : (
            <iframe
              width="100%"
              height="400"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 'none' }}
              onError={handleIframeError}
              onLoad={handleIframeLoad}
            />
          )}
        </Paper>
      )}

      {/* Информация о режиме */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
        {playerMode === 'custom' 
          ? 'Собственный плеер - работает с локальными видео и YouTube' 
          : 'Iframe плеер - использует встроенный YouTube плеер'
        }
      </Typography>
    </Box>
  );
};

export default VideoPlayer; 