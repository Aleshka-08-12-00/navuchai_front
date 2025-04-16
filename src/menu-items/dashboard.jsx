
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

// icons
const icons = {
  HomeIcon,
  AppsIcon,
  PeopleAltIcon,
  BarChartIcon,
  SettingsIcon
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
      breadcrumbs: true,
      code: 'anyCode'
    },
    {
      id: '2',
      title: 'Участники',
      type: 'item',
      url: '/respondents',
      icon: icons.PeopleAltIcon,
      breadcrumbs: true,
      code: 'anyCode'
    },
    {
      id: '3',
      title: 'Результаты тестов',
      type: 'item',
      url: '/results',
      icon: icons.BarChartIcon,
      breadcrumbs: true,
      code: 'anyCode'
    },
    {
      id: '4',
      title: 'Личный кабинет',
      type: 'item',
      url: '/settings',
      icon: icons.SettingsIcon,
      breadcrumbs: true,
      code: 'anyCode'
    },
    {
      id: '3',
      title: 'Результаты тестов',
      type: 'item',
      url: '/results',
      icon: icons.PeopleAltIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
 
  ]
};

export default dashboard;
