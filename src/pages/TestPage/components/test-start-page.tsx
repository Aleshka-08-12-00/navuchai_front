import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Card, CardContent, Typography, Button, TextField, Divider, Alert, Snackbar } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import authStore from '../../../store/authStore';

interface TestStartPageProps {
  setStart: (value: boolean) => void;
  start: boolean;
  questionsLength: number;
  testTitle?: string;
  testLogo?: string;
}

const TestStartPage: React.FC<TestStartPageProps> = observer(({ setStart, start, questionsLength, testTitle, testLogo }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const isAuthorized = authStore.isAuth;

  useEffect(() => {
    if (isAuthorized && authStore.name) {
      const [fname, ...rest] = authStore.name.split(' ');
      const lname = rest.join(' ');
      setFirstName(fname || '');
      setLastName(lname || '');
    }
  }, [isAuthorized]);

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleStartTest = () => {
    if (!isAuthorized && (!firstName.trim() || !lastName.trim())) {
      showAlert('Пожалуйста, введите имя и фамилию перед началом теста.', 'error');
      return;
    }

    showAlert(`Начинаем тест для: ${firstName} ${lastName}`, 'success');
    setStart(!start);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f9f9f9',
          padding: '20px',
        }}
      >
        <Card sx={{ maxWidth: 600, borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}>
          <CardContent>
            {testLogo && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img src={testLogo} alt="Test Logo" style={{ maxHeight: 80 }} />
              </Box>
            )}

            {testTitle && (
              <Typography variant="h5" align="center" gutterBottom>
                {testTitle}
              </Typography>
            )}

            <Typography variant="h5" align="center" gutterBottom>
              Здравствуйте!
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Этот тест состоит из {questionsLength} вопросов. Время на решение одного вопроса — 2 минуты. Убедитесь, что у вас
              достаточно времени, а затем приступайте к тесту. Удачи!
            </Typography>

            <Divider sx={{ marginY: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'flex-start', background: '#e3e3e3', padding: 2, borderRadius: 2 }}>
              <InfoIcon sx={{ marginRight: 1 }} />
              <Typography variant="body2">
                <b>Сосредоточьтесь на тесте!</b> Тест защищен технологией Honest Respondent Technology. Не переключайтесь между вкладками, так как любое движение будет зарегистрировано. Рекомендуем отключить фоновые программы и уведомления.
              </Typography>
            </Box>

            <Typography variant="h5" align="center" sx={{ marginTop: 3 }} gutterBottom>
              Начать тест
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" paragraph>
              {isAuthorized
                ? 'Вы вошли в систему. Данные подставлены автоматически.'
                : 'Пожалуйста, заполните форму перед началом теста.'}
            </Typography>

            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Имя"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                disabled={isAuthorized}
                sx={{
                  '& .MuiInputBase-input': {
                    color: isAuthorized ? '#000' : undefined,
                    fontWeight: '500',
                    fontSize: '1.1rem',
                  },
                }}
              />
              <TextField
                label="Фамилия"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                disabled={isAuthorized}
                sx={{
                  '& .MuiInputBase-input': {
                    color: isAuthorized ? '#000' : undefined,
                    fontWeight: '500',
                    fontSize: '1.1rem',
                  },
                }}
              />
              <Button variant="contained" color="success" size="large" onClick={handleStartTest} fullWidth>
                Начать тест
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
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

export default TestStartPage;
