// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';



import NavGroup from './NavGroup';
import menuItemsSettings from '../menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const navGroups = menuItemsSettings.items.map((item: any) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
