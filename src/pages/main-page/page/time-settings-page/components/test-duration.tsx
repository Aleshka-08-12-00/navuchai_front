import React, { useState } from 'react';
import { Radio, RadioGroup, FormControlLabel, TextField, Button, Slider, Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MainCard from '../../../../../components/MainCard';

const TestDuration: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string>('complete');
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };

    const handleHoursChange = (event: Event, newValue: number | number[]) => {
        setHours(newValue as number);
    };

    const handleMinutesChange = (event: Event, newValue: number | number[]) => {
        setMinutes(newValue as number);
    };

    const handleSecondsChange = (event: Event, newValue: number | number[]) => {
        setSeconds(newValue as number);
    };

    const handleReset = () => {
        setHours(0);
        setMinutes(0);
        setSeconds(0);
    };

    const handleConfirmComplete = () => {
        alert(`Test duration set to ${hours} hours and ${minutes} minutes`);
    };

    const handleConfirmQuestion = () => {
        alert(`Time limit for each question set to ${minutes} minutes and ${seconds} seconds`);
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                    <FormControlLabel value="complete" control={<Radio />} label="Time to complete the test: (hh:mm)" />
                    <FormControlLabel value="question" control={<Radio />} label="Time limit for each test question (mm:ss)" />
                </RadioGroup>

                {/* Интерфейс для настройки времени завершения теста */}
                {selectedOption === 'complete' && (
                    <Box sx={{ marginTop: '20px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <AccessTimeIcon sx={{ marginRight: '10px' }} />
                            <TextField
                                label="Time to complete the test"
                                value={`${hours}:${minutes}`}
                                disabled
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>

                        <Typography variant="subtitle1">Hours</Typography>
                        <Slider
                            value={hours}
                            onChange={handleHoursChange}
                            aria-labelledby="hours-slider"
                            min={0}
                            max={24}
                            valueLabelDisplay="auto"
                            sx={{ marginBottom: '20px' }}
                        />

                        <Typography variant="subtitle1">Minutes</Typography>
                        <Slider
                            value={minutes}
                            onChange={handleMinutesChange}
                            aria-labelledby="minutes-slider"
                            min={0}
                            max={59}
                            valueLabelDisplay="auto"
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <Button onClick={handleReset} variant="outlined">
                                Reset
                            </Button>
                            <Button onClick={handleConfirmComplete} variant="contained" color="primary">
                                Confirm
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Интерфейс для настройки времени на каждый вопрос */}
                {selectedOption === 'question' && (
                    <Box sx={{ marginTop: '20px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <AccessTimeIcon sx={{ marginRight: '10px' }} />
                            <TextField
                                label="Time limit per question"
                                value={`${minutes}:${seconds}`}
                                disabled
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>

                        <Typography variant="subtitle1">Minutes</Typography>
                        <Slider
                            value={minutes}
                            onChange={handleMinutesChange}
                            aria-labelledby="minutes-slider"
                            min={0}
                            max={59}
                            valueLabelDisplay="auto"
                            sx={{ marginBottom: '20px' }}
                        />

                        <Typography variant="subtitle1">Seconds</Typography>
                        <Slider
                            value={seconds}
                            onChange={handleSecondsChange}
                            aria-labelledby="seconds-slider"
                            min={0}
                            max={59}
                            valueLabelDisplay="auto"
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <Button onClick={handleReset} variant="outlined">
                                Reset
                            </Button>
                            <Button onClick={handleConfirmQuestion} variant="contained" color="primary">
                                Confirm
                            </Button>
                        </Box>
                    </Box>
                )}
            </MainCard>
        </div>
    );
};

export default TestDuration;
