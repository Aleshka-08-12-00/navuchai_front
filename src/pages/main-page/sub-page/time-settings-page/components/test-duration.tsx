import React, { useState } from 'react';
import { Radio, RadioGroup, FormControlLabel, Slider, Box, Typography, Tooltip, IconButton, Fade } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MainCard from '../../../../../components/MainCard';

interface TestDurationProps {
    hours: number;
    minutes: number;
    setHours: (value: number) => void;
    setMinutes: (value: number) => void;
    selectedOption: string;
    setSelectedOption: (value: string) => void;
}

const digitalFont = `'Roboto Mono', 'Menlo', 'Monaco', 'Consolas', monospace`;

const TestDuration: React.FC<TestDurationProps> = ({
    hours,
    minutes,
    setHours,
    setMinutes,
    selectedOption,
    setSelectedOption
}) => {
    const [resetAnim, setResetAnim] = useState(false);
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };
    const handleHoursChange = (_event: Event, newValue: number | number[]) => {
        setHours(newValue as number);
    };
    const handleMinutesChange = (_event: Event, newValue: number | number[]) => {
        setMinutes(newValue as number);
    };
    const handleReset = () => {
        setResetAnim(true);
        setTimeout(() => setResetAnim(false), 600);
        setHours(0);
        setMinutes(0);
    };

    return (
        <MainCard
          
        >
            {/* SVG декор */}
            <Box sx={{
                position: 'absolute',
                top: -40,
                right: -40,
                opacity: 0.18,
                zIndex: 0
            }}>
            </Box>
            <Fade in={selectedOption === 'complete'} timeout={600}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center', zIndex: 1, position: 'relative' }}>
                        <Tooltip title="Общее время на тест" arrow>
                            <AccessTimeIcon sx={{ fontSize: 38, color: '#6366f1', mr: 1, filter: 'drop-shadow(0 2px 6px #818cf8aa)' }} />
                        </Tooltip>
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: digitalFont,
                                fontWeight: 900,
                                color: '#222',
                                letterSpacing: 2,
                                textShadow: '0 2px 12px #818cf8cc',
                                borderRadius: 2,
                                px: 2,
                                py: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: { xs: 16, sm: 20, md:24 }
                            }}
                        >
                            {/* <span style={{ fontSize: 32, marginRight: 8 }}>⏰</span> */}
                            {hours.toString().padStart(2, '0')}
                            <span style={{ fontSize: 16, color: '#6366f1', margin: '0 2px' }}>ч</span>
                            {minutes.toString().padStart(2, '0')}
                            <span style={{ fontSize: 16, color: '#6366f1', marginLeft: 2 }}>м</span>
                        </Typography>
                        <Tooltip title="Сбросить время" arrow>
                            <IconButton
                                onClick={handleReset}
                                sx={{
                                    ml: 2,
                                    transition: 'transform 0.5s',
                                    transform: resetAnim ? 'rotate(-360deg)' : 'none',
                                    color: '#818cf8',
                                    background: 'rgba(129,140,248,0.08)',
                                    '&:hover': { background: 'rgba(129,140,248,0.18)' }
                                }}
                            >
                                <RestartAltIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ mb: 2, zIndex: 1, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#555' }}>Часы</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Выберите количество часов" arrow>
                                <Slider
                                    value={hours}
                                    onChange={handleHoursChange}
                                    aria-labelledby="hours-slider"
                                    min={0}
                                    max={24}
                                    valueLabelDisplay="auto"
                                    sx={{
                                        color: '#6366f1',
                                        flex: 1,
                                        mr: 2,
                                        zIndex: 1
                                    }}
                                />
                            </Tooltip>
                            <Typography sx={{ minWidth: 32, textAlign: 'center', color: '#222', fontWeight: 500, fontFamily: digitalFont }}>{hours}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mb: 2, zIndex: 1, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#555' }}>Минуты</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Выберите количество минут" arrow>
                                <Slider
                                    value={minutes}
                                    onChange={handleMinutesChange}
                                    aria-labelledby="minutes-slider"
                                    min={0}
                                    max={59}
                                    valueLabelDisplay="auto"
                                    sx={{
                                        color: '#a21caf',
                                        flex: 1,
                                        mr: 2,
                                        zIndex: 1
                                    }}
                                />
                            </Tooltip>
                            <Typography sx={{ minWidth: 32, textAlign: 'center', color: '#222', fontWeight: 500, fontFamily: digitalFont }}>{minutes}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </MainCard>
    );
};

export default TestDuration;
