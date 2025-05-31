import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../..';
import MainCard from '../../../../components/MainCard';
import {
    Button,
    Modal,
    TextField,
    Typography,
    Box
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

    React.useEffect(() => {
        if (!profileStore.profile) {
            profileStore.getProfile();
        }
    }, [profileStore]);

    const profile = profileStore.profile;

    const [openModal, setOpenModal] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });

    React.useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name,
                username: profile.username,
                email: profile.email,
                password: ''
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        const success = await profileStore.putProfile(formData);
        if (success) {
            setOpenModal(false);
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
                    <Button
                        variant="outlined"
                        onClick={() => setOpenModal(true)}
                        sx={{ width: 'fit-content', mt: 2 }}
                    >
                        Редактировать профиль
                    </Button>
                </Box>

                <hr />

                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">План: <strong style={{ color: 'green' }}>MAX (trial)</strong></Typography>
                    <Typography variant="h6">Trial expiry date: <strong>2025-04-08 14:11</strong></Typography>
                    <Typography variant="h6">Trial days left: <strong>8</strong></Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        All trial subscriptions limit the number of collected results.
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                        Results limit used: <strong>4/15</strong>
                    </Typography>
                    <Button variant="contained" color="success" size="small" sx={{ mt: 1 }}>
                        Обновить
                    </Button>
                </Box>

                <hr />

                <Stack sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="h5" sx={{ pb: 1 }}>Статистика</Typography>

                    <Typography variant="body1">Tests created: <strong>5</strong></Typography>
                    <Typography variant="body1">Tests completed in the last 30 days: <strong>4</strong></Typography>
                    <Typography variant="body1">Tests completed in total: <strong>4</strong></Typography>
                    <Typography variant="body1">Training tests completed in the last 30 days: <strong>0</strong></Typography>
                    <Typography variant="body1">Training tests completed in total: <strong>0</strong></Typography>
                </Stack>
            </MainCard>

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
                        label="Username"
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
                    <TextField
                        label="Пароль (оставьте пустым, если не меняется)"
                        name="password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button variant="contained" onClick={handleSave}>Сохранить</Button>
                        <Button variant="outlined" onClick={() => setOpenModal(false)}>Отмена</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
});

export default GeneralInformationPage;
