
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

// icons
const icons = {
  HomeIcon,
  AppsIcon,
  PeopleAltIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Навигация',
  type: 'group',
  children: [
    {
      id: '1',
      title: 'Мои тесты',
      type: 'item',
      url: '/',
      icon: icons.AppsIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '2',
      title: 'Участники',
      type: 'item',
      url: '/respondents',
      icon: icons.PeopleAltIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
 
  ]
};

export default dashboard;
