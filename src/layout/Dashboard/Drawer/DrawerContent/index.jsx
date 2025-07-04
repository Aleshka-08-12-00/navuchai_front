import { ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { LogoutOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {

  const logout = () => {
    window.localStorage.removeItem('tokenNavuchai');
    window.localStorage.removeItem('refreshTokenNavuchai');
    window.location.reload();
  };
  const theme = useTheme();
  const iconSelectedColor = 'primary.main';


  return (
    <>
      <SimpleBar sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
        <Navigation />
        <ListItemButton  
          onClick={() => logout()}
          sx={{
            zIndex: 1201,
            pl: 2.25,
            py: 1,
            '&:hover': {
              bgcolor: 'primary.lighter'
            },
            '&.Mui-selected': {
              bgcolor: 'primary.lighter',
              borderRight: `2px solid ${theme.palette.primary.main}`,
              color: iconSelectedColor,
              '&:hover': {
                color: iconSelectedColor,
                bgcolor: 'primary.lighter'
              }
            }
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: 'text.primary',

              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'secondary.lighter'
              }
            }}
          >
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Выйти
              </Typography>
            }
          />
        </ListItemButton>
      </SimpleBar>
    </>
  );
}
