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

  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, { setSubmitting }) => {
          const loginData = {
            grant_type: 'password',
            username: values.email,
            password: values.password,
          };
          const result = await authStore.loginUser(loginData);
          if (result) {
            navigate('/main-page');
          }
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => {
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="email-login">Вход в систему</InputLabel>
                    <OutlinedInput
                      id="email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
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
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
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
                      type="submit"
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
