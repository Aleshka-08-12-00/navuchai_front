import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthRegister from './auth-forms/AuthRegister';
import { useNavigate } from 'react-router';

// ================================|| REGISTER ||================================ //

export default function Register() {
  const navigate = useNavigate();
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            sx={{ mb: { xs: -0.5, sm: 0.5 } }}
          >
            <Typography variant="h3">Регистрация</Typography>
            <Typography
              onClick={() => navigate('/login')}
              variant="body1"
              sx={{ textDecoration: 'none', cursor: 'pointer' }}
              color="primary"
            >
              Уже есть аккаунт?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthRegister />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
