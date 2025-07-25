import PropTypes from 'prop-types';
import React, { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project import
// import { handlerActiveItem, useGetMenuMaster } from 'api/menu';
import { observer } from 'mobx-react-lite';
import { handlerActiveItem, useGetMenuMaster } from '../../api/menu';
import { Context } from '../../../..';

// export default function NavItem({ item, level }) {
const NavItem = observer(({ item, level }: any) => {
   const { settingsStore } = React.useContext(Context);
   const { authStore } = React.useContext(Context);
   const {
     authMe,
   } = authStore
 
   // Все хуки должны быть в начале компонента
   React.useEffect(() => {
     authMe();
   }, [])
 

  const theme = useTheme();

  const { menuMaster } = useGetMenuMaster();
  //@ts-ignore
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  //@ts-ignore
  const openItem = menuMaster.openedItem;

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }
  let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;

  const { pathname } = useLocation();
  const isSelected = openItem === item.id;

  useEffect(() => {
    if (pathname === item.url) handlerActiveItem(item.id);
    
    // eslint-disable-next-line
  }, [pathname]);

    // Функция для проверки прав доступа
    const hasAccess = (item) => {
      // Если у элемента нет ограничений по ролям, показываем всем
      if (!item.allowedRoles) {
        return true;
      }
      
      // Получаем роль пользователя из authStore
      const userRole = authStore.roleCode;
      
      // Проверяем, есть ли роль пользователя в списке разрешенных
      return item.allowedRoles.includes(userRole);
    };
  
    // Если у пользователя нет доступа к этому элементу, не рендерим его
    if (!hasAccess(item)) {
      return null;
    }

  const textColor = 'text.secondary';
  const iconSelectedColor = 'primary.secondary';
 

  return (
    <>
      <ListItemButton
        {...listItemProps}
        disabled={item.disabled}
        onClick={() => (handlerActiveItem(item.id), settingsStore.setIdSettingsNumberNext(item.id))}
        selected={isSelected}
        sx={{
          mb: 1,
          borderRadius: 1,
          zIndex: 1201,
          // pl: drawerOpen ? `${level * 28}px` : 1.5,
          // py: !drawerOpen && level === 1 ? 1.25 : 1,
          pl: 1.5,
          py:  1,
          ...(drawerOpen && {
            '&:hover': {
              bgcolor: 'white'
            },
            '&.Mui-selected': {
              bgcolor: 'white',
              borderRight: `2px solid ${theme.palette.primary.main}`,
              color: iconSelectedColor,
              '&:hover': {
                color: iconSelectedColor,
                bgcolor: 'white'
              }
            }
          }),
          ...(!drawerOpen && {
            '&:hover': {
              bgcolor: 'white'
            },
            '&.Mui-selected': {
              '&:hover': {
                bgcolor: 'wite'
              },
              bgcolor: 'white'
            }
          })
        }}
      >
        {itemIcon && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: isSelected ? iconSelectedColor : textColor,
              ...(!drawerOpen && {
                borderRadius: 1.5,
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'secondary.lighter'
                }
              }),
              ...(!drawerOpen &&
                isSelected && {
                bgcolor: 'primary.lighter',
                '&:hover': {
                  bgcolor: 'primary.lighter'
                }
              })
            }}
          >
            {itemIcon}
          </ListItemIcon>
        )}
        {(!drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }} style={{marginLeft: 10}}>
                {item.title}
              </Typography>
            }
          />
        )}
           {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                {item.title}
              </Typography>
            }
          />
        )}
        {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
          <Chip
            color={item.chip.color}
            variant={item.chip.variant}
            size={item.chip.size}
            label={item.chip.label}
            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          />
        )}
      </ListItemButton>
    </>
  );
})

export default NavItem;

NavItem.propTypes = { item: PropTypes.object, level: PropTypes.number };
