import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../..';
import MainCard from '../../../../components/MainCard';
import {
    Button,
    Modal,
    TextField,
    Typography,
    Box,
    Alert,
    Snackbar
} from '@mui/material';
import { Stack } from '@mui/system';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const GeneralInformationPage = observer(() => {
    const { profileStore } = React.useContext(Context);
    const [openModal, setOpenModal] = React.useState(false);
    const [openPasswordModal, setOpenPasswordModal] = React.useState(false);
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    React.useEffect(() => {
        if (!profileStore.profile) {
            profileStore.getProfile();
        }
    }, [profileStore]);

    const profile = profileStore.profile;

    const [formData, setFormData] = React.useState({
        name: '',
        username: '',
        email: ''
    });

    const [passwordData, setPasswordData] = React.useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    React.useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name,
                username: profile.username,
                email: profile.email
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        if (formData.username !== formData.email) {
            showAlert('Username должен совпадать с email', 'error');
            return;
        }

        const success = await profileStore.putProfile(formData);
        if (success) {
            setOpenModal(false);
            showAlert('Профиль успешно обновлен', 'success');
        }
    };

    const handlePasswordSave = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwordData;

        if (!newPassword || !confirmPassword) {
            showAlert('Пожалуйста, заполните все поля', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert('Пароли не совпадают', 'error');
            return;
        }

        const success = await profileStore.changePassword(oldPassword, newPassword);
        if (success) {
            setOpenPasswordModal(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            showAlert('Пароль успешно изменен', 'success');
        }
    };

    return (
        <>
            <Typography variant="h6" color="textSecondary">
                Основная информация
            </Typography>

            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <Typography variant="h5">Ваш аккаунт</Typography>

                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h6">Имя пользователя: <strong>{profile?.name}</strong></Typography>
                    <Typography variant="h6">Email: <strong>{profile?.email}</strong></Typography>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button variant="outlined" onClick={() => setOpenModal(true)}>Редактировать профиль</Button>
                        <Button variant="outlined" onClick={() => setOpenPasswordModal(true)}>Сменить пароль</Button>
                    </Box>
                </Box>

                <hr />

                <Box sx={{ p: 2, opacity: 0.1 }}>
                    <Typography variant="h6">План: <strong style={{ color: 'green' }}>MAX (пробная версия)</strong></Typography>
                    <Typography variant="h6">Дата окончания пробного периода: <strong>2025-04-08 14:11</strong></Typography>
                    <Typography variant="h6">Осталось дней пробного периода: <strong>8</strong></Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Все пробные подписки ограничивают количество собираемых результатов.
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                        Использовано результатов: <strong>4/15</strong>
                    </Typography>
                    <Button disabled variant="contained" color="success" size="small" sx={{ mt: 1 }}>
                        Обновить
                    </Button>
                </Box>

                <hr />
                <Box sx={{ p: 2, opacity: 0.1 }}>
                    <Stack sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="h5" sx={{ pb: 1 }}>Статистика</Typography>

                        <Typography variant="body1">Создано тестов: <strong>5</strong></Typography>
                        <Typography variant="body1">Пройдено тестов за последние 30 дней: <strong>4</strong></Typography>
                        <Typography variant="body1">Всего пройдено тестов: <strong>4</strong></Typography>
                        <Typography variant="body1">Пройдено тренировочных тестов за последние 30 дней: <strong>0</strong></Typography>
                        <Typography variant="body1">Всего пройдено тренировочных тестов: <strong>0</strong></Typography>
                    </Stack>
                </Box>


            </MainCard>

            {/* Модалка редактирования профиля */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Редактирование профиля</Typography>
                    <TextField
                        label="Имя пользователя"
                        name="name"
                        fullWidth
                        margin="normal"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Username (должен совпадать с email)"
                        name="username"
                        fullWidth
                        margin="normal"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        margin="normal"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button variant="contained" onClick={handleSave}>Сохранить</Button>
                        <Button variant="outlined" onClick={() => setOpenModal(false)}>Отмена</Button>
                    </Box>
                </Box>
            </Modal>

            {/* Модалка смены пароля */}
            <Modal open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Сменить пароль</Typography>
                    <TextField
                        label="Старый пароль"
                        name="oldPassword"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        label="Новый пароль"
                        name="newPassword"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        label="Подтвердите пароль"
                        name="confirmPassword"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button variant="contained" onClick={handlePasswordSave}>Сохранить</Button>
                        <Button variant="outlined" onClick={() => setOpenPasswordModal(false)}>Отмена</Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
});

export default GeneralInformationPage;
