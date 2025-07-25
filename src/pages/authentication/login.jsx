// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';
import { useNavigate } from 'react-router';

// ================================|| LOGIN ||================================ //

export default function Login() {
   const navigate = useNavigate();
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Авторизация</Typography>
            <Typography onClick={() => navigate('/register')} variant="body1" sx={{ textDecoration: 'none', cursor: 'pointer' }} color="primary">
              У Вас отсутствует аккаунт?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
