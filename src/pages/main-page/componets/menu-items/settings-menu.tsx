import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import AppsIcon from '@mui/icons-material/Apps';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HomeIcon from '@mui/icons-material/Home';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';


// icons
const icons = {
  SettingsIcon,
  TuneIcon,
  AppsIcon,
  VpnKeyIcon,
  HomeIcon,
  StickyNote2Icon,
  ManageHistoryIcon,
  EmojiEventsIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const settingsMenu = {
  id: 'group-dashboard',
  title: 'Настройки теста',
  type: 'group',
  children: [
    {
      id: '51',
      title: 'Основная настройки',
      type: 'item',
      url: '/',
      icon: icons.SettingsIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '52',
      title: 'Настройка вопросов',
      type: 'item',
      // url: '/settings',
      icon: icons.TuneIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '53',
      title: 'Подача теста',
      type: 'item',
      // url: '/settings',
      icon: icons.AppsIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '54',
      title: 'Доступ к тесту',
      type: 'item',
      // url: '/settings',
      icon: icons.VpnKeyIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '55',
      title: 'Стартовая страница',
      type: 'item',
      // url: '/settings',
      icon: icons.HomeIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '56',
      title: 'Оценка и резюме',
      type: 'item',
      // url: '/settings',
      icon: icons.StickyNote2Icon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '57',
      title: 'Настройка времени',
      type: 'item',
      // url: '/settings',
      icon: icons.ManageHistoryIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '58',
      title: 'Шаблон сертификата',
      type: 'item',
      // url: '/settings',
      icon: icons.EmojiEventsIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    // {
    //   id: '44',
    //   title: 'Личный кабинет',
    //   type: 'item',
    //   url: '/settings',
    //   icon: icons.SettingsIcon,
    //   breadcrumbs: false,
    //   code: 'anyCode'
    // },
    // {
    //   id: '45',
    //   title: 'Личный кабинет',
    //   type: 'item',
    //   url: '/settings',
    //   icon: icons.SettingsIcon,
    //   breadcrumbs: false,
    //   code: 'anyCode'
    // },
    // {
    //   id: '46',
    //   title: 'Личный кабинет',
    //   type: 'item',
    //   url: '/settings',
    //   icon: icons.SettingsIcon,
    //   breadcrumbs: false,
    //   code: 'anyCode'
    // },
 
  ]
};

export default settingsMenu;
