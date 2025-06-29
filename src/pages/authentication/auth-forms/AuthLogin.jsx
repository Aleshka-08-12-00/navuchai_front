import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, Typography, Alert, Snackbar } from '@mui/material';

import { Formik } from 'formik';

import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = observer(() => {
  const { authStore } = useContext(Context);
  const { error } = authStore;
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState('success');

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChangePassword = (value) => {
    setPassword(value);
  };

  const handleChangeEmail = (value) => {
    setEmail(value);
  };

  const onPressEnter = (value) => {
    if (value === 'Enter' && email.length > 0 && password.length > 0) {
      authStore.loginUser(email, password);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <Formik>
        {({ errors, handleBlur, isSubmitting, touched }) => {
          return (
            <form noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-login">Вход в систему</InputLabel>
                    <OutlinedInput
                      id="email-login"
                      type="email"
                      value={email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={(e) => handleChangeEmail(e.target.value)}
                      placeholder="Введите логин"
                      fullWidth
                      error={Boolean(touched.email && errors.email)} />
                    {error && error.includes('Пользователя') && (
                      <FormHelperText error id="standard-weight-helper-text-email-login">
                        {error}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="password-login">Пароль</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="-password-login"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={(e) => handleChangePassword(e.target.value)}
                      onKeyPress={(e) => onPressEnter(e.code)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                          </IconButton>
                        </InputAdornment>
                      }
                      placeholder="Введите пароль" />
                    {error && error.includes('пароль') && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {error}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ mt: -1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography
                      component="button"
                      type="button"
                      variant="h6"
                      onClick={(e) => {
                        e.preventDefault();
                        showAlert('Пароль как в Битрикс', 'info');
                      }}
                      color="text.primary"
                      sx={{ 
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Забыли пароль?
                    </Typography>
                  </Stack>
                </Grid>
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button
                      onClick={
                        async () => {

                          const loginData = {
                            grant_type: 'password',
                            username: email,
                            password: password,
                          };
                          console.log(loginData);
                          const result = await authStore.loginUser(loginData);
                          console.log(result);
                          if (result) {
                            navigate('/main-page');
                          }
                        }
                      }
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      variant="contained"
                      color="primary"
                    >
                      Войти
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
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

export default AuthLogin;
