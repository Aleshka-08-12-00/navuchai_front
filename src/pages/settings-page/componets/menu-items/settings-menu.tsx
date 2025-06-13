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
      code: 'anyCode',
      allowedRoles: ['admin', 'user', 'guest', 'moderator']
    },
    {
      id: '42',
      title: 'Ваш пакет',
      type: 'item',
      icon: icons.SyncAltIcon,
      breadcrumbs: false,
      code: 'anyCode',
      allowedRoles: ['admin', 'moderator']
    },
    {
      id: '43',
      title: 'Выставление счетов',
      type: 'item',
      icon: icons.CreditCardIcon,
      breadcrumbs: false,
      code: 'anyCode',
      allowedRoles: ['admin', 'moderator']
    },
    {
      id: '44',
      title: 'Поддомен',
      type: 'item',
      icon: icons.DomainIcon,
      breadcrumbs: false,
      code: 'anyCode',
      allowedRoles: ['admin', 'moderator']
    },
    {
      id: '45',
      title: 'Логотип',
      type: 'item',
      icon: icons.ImageIcon,
      breadcrumbs: false,
      code: 'anyCode',
      allowedRoles: ['admin', 'moderator']
    },
    {
      id: '46',
      title: 'Язык и регион',
      type: 'item',
      icon: icons.LanguageIcon,
      breadcrumbs: false,
      code: 'anyCode',
      allowedRoles: ['admin', 'moderator']
    },
 
  ]
};

export default settingsMenu;
