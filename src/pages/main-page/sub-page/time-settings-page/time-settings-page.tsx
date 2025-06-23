import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Typography, Snackbar, Alert, Box } from '@mui/material';
import { Context } from '../../../..';
import TestDuration from './components/test-duration';

const TimeSettingsPage = observer(() => {
    const { settingsNewTestStore } = React.useContext(Context);
    const [hours, setHours] = React.useState(0);
    const [minutes, setMinutes] = React.useState(0);
    const [selectedOption, setSelectedOption] = React.useState('complete');
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

    React.useEffect(() => {
        // Если есть данные о тесте, инициализируем значения времени
        if (settingsNewTestStore.testMainInfo && settingsNewTestStore.testMainInfo.time_limit) {
            const totalSeconds = settingsNewTestStore.testMainInfo.time_limit;
            setHours(Math.floor(totalSeconds / 3600));
            setMinutes(Math.floor((totalSeconds % 3600) / 60));
        }
    }, [settingsNewTestStore.testMainInfo]);

    const handleSave = async () => {
        if (!settingsNewTestStore.testMainInfo?.id) {
            setAlertMessage('Ошибка: не найден id теста');
            setAlertSeverity('error');
            setAlertOpen(true);
            return;
        }
        const time_limit = hours * 3600 + minutes * 60;
        const {
            title,
            description,
            category_id,
            creator_id,
            access_timestamp,
            status_id,
            status_name,
            status_name_ru,
            status_color,
            frozen,
            locale_id,
            img_id
        } = settingsNewTestStore.testMainInfo;
        const payload = {
            title,
            description,
            category_id,
            creator_id,
            access_timestamp,
            status: status_name,
            status_id,
            status_name,
            status_name_ru: status_name_ru || '',
            status_color: status_color || '',
            frozen,
            locale_id,
            time_limit,
            img_id: img_id || 0
        };
        try {
            await settingsNewTestStore.updateTest(payload, settingsNewTestStore.testMainInfo.id);
            setAlertMessage('Время теста успешно обновлено!');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (e) {
            setAlertMessage('Ошибка при сохранении времени');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const handleCloseAlert = () => setAlertOpen(false);

    return (
        <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4, mb: 4, p: 2 }}>
            <Typography variant="h6" color="textSecondary" sx={{ mb: 3, textAlign: 'center', }}>
                Настройка времени теста
            </Typography>
            <TestDuration
                hours={hours}
                minutes={minutes}
                setHours={setHours}
                setMinutes={setMinutes}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                    variant='contained'
                    color='success'
                    size='small'
                    onClick={handleSave}
                >
                    Сохранить
                </Button>
            </Box>
            <Snackbar open={alertOpen} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
});

export default TimeSettingsPage;

