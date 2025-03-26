
import HomeIcon from '@mui/icons-material/Home';

// icons
const icons = {
  HomeIcon,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Навигация',
  type: 'group',
  children: [
    {
      id: '1',
      title: 'Кабинет заказчика',
      type: 'item',
      url: '/',
      icon: icons.HomeIcon,
      breadcrumbs: false,
      code: 'page_customer_office'
    },
    {
      id: '2',
      title: 'Кабинет HRD',
      type: 'item',
      url: '/',
      icon: icons.HomeIcon,
      breadcrumbs: false,
      code: 'page_hrd_office'
    },
    {
      id: '3',
      title: 'Кабинет HR',
      type: 'item',
      url: '/',
      icon: icons.HomeIcon,
      breadcrumbs: false,
      code: 'page_hr_office'
    },
  ]
};

export default dashboard;
