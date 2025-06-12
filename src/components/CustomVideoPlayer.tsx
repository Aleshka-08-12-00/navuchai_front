import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Slider, 
  IconButton,
  Stack
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  SkipPrevious,
  SkipNext
} from '@mui/icons-material';

interface CustomVideoPlayerProps {
  videoUrl: string;
  title?: string;
  poster?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoUrl,
  title = "Видео",
  poster,
  onTimeUpdate,
  onEnded
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState('');

  // Определяем, является ли это YouTube видео
  useEffect(() => {
    const isYouTubeVideo = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    setIsYouTube(isYouTubeVideo);
    
    if (isYouTubeVideo) {
      const embedUrl = getYouTubeEmbedUrl(videoUrl);
      setYoutubeEmbedUrl(embedUrl);
    }
  }, [videoUrl]);

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    const cleanUrl = url.trim();
    
    if (cleanUrl.includes('youtube.com/embed/')) {
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
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    return cleanUrl;
  };

  // Обработчики событий видео
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      onTimeUpdate?.(current, total);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    onEnded?.();
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSeek = (event: Event, newValue: number | number[]) => {
    const seekTime = Array.isArray(newValue) ? newValue[0] : newValue;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Автоскрытие контролов
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isPlaying && showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  // Обработка клика для показа/скрытия контролов
  const handleContainerClick = () => {
    setShowControls(!showControls);
  };

  // Если это YouTube видео, показываем iframe с fallback
  if (isYouTube) {
    return (
      <Paper 
        ref={containerRef}
        sx={{ 
          position: 'relative', 
          overflow: 'hidden',
          cursor: 'pointer'
        }}
        onClick={handleContainerClick}
      >
        <iframe
          width="100%"
          height="400"
          src={youtubeEmbedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: 'none' }}
        />
        
        {showControls && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              p: 2,
              color: 'white'
            }}
          >
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2">
              YouTube видео - используйте элементы управления YouTube
            </Typography>
          </Box>
        )}
      </Paper>
    );
  }

  return (
    <Paper 
      ref={containerRef}
      sx={{ 
        position: 'relative', 
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={handleContainerClick}
    >
      <video
        ref={videoRef}
        width="100%"
        height="400"
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={{ display: 'block' }}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>

      {/* Overlay контролов */}
      {showControls && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            p: 2,
            color: 'white'
          }}
        >
          {/* Прогресс бар */}
          <Slider
            value={currentTime}
            max={duration}
            onChange={handleSeek}
            sx={{
              color: 'white',
              '& .MuiSlider-thumb': {
                color: 'white',
              },
              '& .MuiSlider-track': {
                color: 'white',
              },
              '& .MuiSlider-rail': {
                color: 'rgba(255,255,255,0.3)',
              },
            }}
          />

          {/* Контролы */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton 
              onClick={isPlaying ? handlePause : handlePlay}
              sx={{ color: 'white' }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            <Typography variant="body2" sx={{ minWidth: 100 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>

            <IconButton onClick={handleMuteToggle} sx={{ color: 'white' }}>
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>

            <Slider
              value={isMuted ? 0 : volume}
              max={1}
              step={0.1}
              onChange={handleVolumeChange}
              sx={{
                width: 100,
                color: 'white',
                '& .MuiSlider-thumb': {
                  color: 'white',
                },
                '& .MuiSlider-track': {
                  color: 'white',
                },
                '& .MuiSlider-rail': {
                  color: 'rgba(255,255,255,0.3)',
                },
              }}
            />

            <IconButton onClick={handleFullscreenToggle} sx={{ color: 'white' }}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Stack>

          <Typography variant="h6" sx={{ mt: 1 }}>
            {title}
          </Typography>
        </Box>
      )}

      {/* Центральная кнопка воспроизведения */}
      {!isPlaying && !showControls && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.7)',
            borderRadius: '50%',
            p: 2,
            cursor: 'pointer'
          }}
          onClick={handlePlay}
        >
          <PlayArrow sx={{ fontSize: 48, color: 'white' }} />
        </Box>
      )}
    </Paper>
  );
};

export default CustomVideoPlayer; 