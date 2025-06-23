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

const newTestMenu = {
  id: 'group-dashboard',
  title: 'Настройки теста',
  type: 'group',
  children: [
    {
      id: '51',
      title: 'Основная настройки',
      type: 'item',
      // url: '/main-page',
      icon: icons.SettingsIcon,
      breadcrumbs: true,
      code: 'anyCode',
      disabled: false
    },
    {
      id: '52',
      title: 'Настройка вопросов',
      type: 'item',
      // url: '/main-page/test/:id/question/:questionId',
      icon: icons.TuneIcon,
      breadcrumbs: true,
      code: 'anyCode',
      disabled: false
    },
    {
      id: '53',
      title: 'Подача теста',
      type: 'item',
      // url: '/main-page/test/:id',
      icon: icons.AppsIcon,
      breadcrumbs: true,
      code: 'anyCode',
      disabled: true
    },
    {
      id: '54',
      title: 'Доступ к тесту',
      type: 'item',
      // url: '/main-page/test/:id',
      icon: icons.VpnKeyIcon,
      breadcrumbs: true,
      code: 'anyCode',
      disabled: false
    },
    {
      id: '55',
      title: 'Стартовая страница',
      type: 'item',
      // url: '/main-page/test/:id',
      icon: icons.HomeIcon,
      breadcrumbs: true,
      code: 'anyCode',
      disabled: false
    },
    {
      id: '56',
      title: 'Оценка и резюме',
      type: 'item',
      // url: '/main-page/test/:id',
      icon: icons.StickyNote2Icon,
      breadcrumbs: true,
      code: 'anyCode',
      disabled: false
    },
    {
      id: '57',
      title: 'Настройка времени',
      type: 'item',
      // url: '/main-page/test/:id',
      icon: icons.ManageHistoryIcon,
      breadcrumbs: true,
      code: 'anyCode',
      disabled: false
    },
    {
      id: '58',
      title: 'Шаблон сертификата',
      type: 'item',
      // url: '/main-page/test/:id',
      icon: icons.EmojiEventsIcon,
      breadcrumbs: true,
      code: 'anyCode',
      disabled: true
    },
 
  ]
};

export default newTestMenu;
