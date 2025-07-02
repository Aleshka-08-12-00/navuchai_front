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
  welcomeMessage?: string;
  timeLimit?: number;
}

const TestStartPage: React.FC<TestStartPageProps> = observer(({ setStart, start, questionsLength, testTitle, testLogo, welcomeMessage, timeLimit }) => {
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

  // Helper to format time limit with declension
  const declOfNum = (n: number, forms: [string, string, string]) => {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
  };

  const formatTimeLimit = (seconds?: number) => {
    if (!seconds || seconds === 0) return 'Время на решение теста не ограничено';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    let result = 'Время на решение теста — ';
    if (hours > 0) {
      result += `${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])}`;
      if (minutes > 0) {
        result += ` ${minutes} ${declOfNum(minutes, ['минута', 'минуты', 'минут'])}`;
      }
    } else {
      result += `${minutes} ${declOfNum(minutes, ['минута', 'минуты', 'минут'])}`;
    }
    result += '.';
    return result;
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
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
            {welcomeMessage ? (
              /<[a-z][\s\S]*>/i.test(welcomeMessage) ? (
                <div style={{ marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: welcomeMessage }} />
              ) : (
                <Typography variant="body1" color="textSecondary" paragraph>
                  {welcomeMessage}
                </Typography>
              )
            ) : (
              <Typography variant="body1" color="textSecondary" paragraph>
                Этот тест состоит из {questionsLength} вопросов. {formatTimeLimit(timeLimit)} Убедитесь, что у вас
                достаточно времени, а затем приступайте к тесту. Удачи!
              </Typography>
            )}

            <Divider sx={{ marginY: 2 }} />

            {/* <Box sx={{ display: 'flex', alignItems: 'flex-start', background: '#e3e3e3', padding: 2, borderRadius: 2 }}>
              <InfoIcon sx={{ marginRight: 1 }} />
              <Typography variant="body2">
                <b>Сосредоточьтесь на тесте!</b> Тест защищен технологией Honest Respondent Technology. Не переключайтесь между вкладками, так как любое движение будет зарегистрировано. Рекомендуем отключить фоновые программы и уведомления.
              </Typography>
            </Box> */}

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
                label="Фамилия"
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
                label="Имя"
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
