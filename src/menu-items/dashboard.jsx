import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import QueryStatsIcon from '@mui/icons-material/QueryStats';


// icons
const icons = {
  HomeIcon,
  AppsIcon,
  PeopleAltIcon,
  BarChartIcon,
  SettingsIcon,
  LibraryBooksIcon,
  AdminPanelSettingsIcon,
  QueryStatsIcon
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
      code: 'anyCode',
      allowedRoles: ['admin', 'user', 'guest', 'moderator']
    },
    {
      id: '2',
      title: 'Участники',
      type: 'item',
      url: '/respondents',
      icon: icons.PeopleAltIcon,
      breadcrumbs: true,
      code: 'anyCode',
      allowedRoles: ['admin']
    },
    {
      id: '3',
      title: 'Результаты тестов',
      type: 'item',
      url: '/results',
      icon: icons.BarChartIcon,
      breadcrumbs: true,
      code: 'anyCode',
      allowedRoles: ['admin', 'user', 'moderator']
    },
    {
      id: '8',
      title: 'Аналитика по тестам',
      type: 'item',
      url: '/analytics',
      icon: icons.QueryStatsIcon,
      breadcrumbs: true,
      code: 'anyCode',
      allowedRoles: ['admin', 'moderator']
    },
    {
      id: '4',
      title: 'Личный кабинет',
      type: 'item',
      url: '/settings',
      icon: icons.SettingsIcon,
      breadcrumbs: true,
      code: 'anyCode',
      allowedRoles: ['admin', 'user', 'guest', 'moderator']
    },
    {
      id: '5',
      title: 'Курсы',
      type: 'item',
      url: '/courses',
      icon: icons.LibraryBooksIcon,
      breadcrumbs: true,
      code: 'anyCode',
      allowedRoles: ['admin', 'user', 'guest', 'moderator']
    },
    {
      id: '6',
      title: 'Администрирование',
      type: 'item',
      url: '/admin',
      icon: icons.AdminPanelSettingsIcon,
      breadcrumbs: true,
      code: 'anyCode',
      allowedRoles: ['admin']
    },
    {
      id: '7',
      title: 'Доступ к курсам',
      type: 'item',
      url: '/admin/course-access',
      icon: icons.AdminPanelSettingsIcon,
      breadcrumbs: true,
      code: 'anyCode',
      allowedRoles: ['admin']
    },

  ]
};

export default dashboard;
