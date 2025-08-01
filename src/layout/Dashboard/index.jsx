import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Loader from 'components/Loader';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const location = useLocation();

  useEffect(() => {
    handlerDrawerOpen(!downXL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  // Скрываем Drawer и Breadcrumbs на /start_test/
  const hideDrawer = location.pathname.startsWith('/start_test/');

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {!hideDrawer && <Header />}
      {!hideDrawer && <Drawer />}
      <Box component="main" sx={{ width: hideDrawer ? '100%' : 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar />
        {!hideDrawer && <Breadcrumbs navigation={navigation} title />}
        <Outlet />
      </Box>
    </Box>
  );
}
