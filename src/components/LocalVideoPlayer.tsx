import React, { useState, useRef } from 'react';
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
  FullscreenExit
} from '@mui/icons-material';

interface LocalVideoPlayerProps {
  videoUrl: string;
  title?: string;
  poster?: string;
}

const LocalVideoPlayer: React.FC<LocalVideoPlayerProps> = ({
  videoUrl,
  title = "Локальное видео",
  poster
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
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
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

  const handleContainerClick = () => {
    setShowControls(!showControls);
  };

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

export default LocalVideoPlayer; 