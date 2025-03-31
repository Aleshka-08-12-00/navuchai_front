import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DomainIcon from '@mui/icons-material/Domain';
import ImageIcon from '@mui/icons-material/Image';
import LanguageIcon from '@mui/icons-material/Language';


// icons
const icons = {
  ManageAccountsIcon,
  SyncAltIcon,
  CreditCardIcon,
  DomainIcon,
  ImageIcon,
  LanguageIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const settingsMenu = {
  id: 'group-dashboard',
  title: 'Настройки профиля',
  type: 'group',
  children: [
    {
      id: '41',
      title: 'Основная информация',
      type: 'item',
      url: '/settings',
      icon: icons.ManageAccountsIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '42',
      title: 'Ваш пакет',
      type: 'item',
      // url: '/settings',
      icon: icons.SyncAltIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '43',
      title: 'Выставление счетов',
      type: 'item',
      // url: '/settings',
      icon: icons.CreditCardIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '44',
      title: 'Поддомен',
      type: 'item',
      // url: '/settings',
      icon: icons.DomainIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '45',
      title: 'Логотип',
      type: 'item',
      // url: '/settings',
      icon: icons.ImageIcon,
      breadcrumbs: false,
      code: 'anyCode'
    },
    {
      id: '46',
      title: 'Язык и регион',
      type: 'item',
      // url: '/settings',
      icon: icons.LanguageIcon,
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
