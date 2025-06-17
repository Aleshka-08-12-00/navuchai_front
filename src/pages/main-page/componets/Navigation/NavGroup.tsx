import React from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
// material-ui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import { Button, Alert, Snackbar, CircularProgress, Stack } from '@mui/material';

import NavItem from './NavItem';
import { useGetMenuMaster } from '../../api/menu';
import { Context } from '../../../..';

const NavGroup = observer(({ item }: any) => {
  const { settingsNewTestStore } = React.useContext(Context);
  const { id } = useParams<{ id: string }>();
  const { menuMaster } = useGetMenuMaster();
  //@ts-ignore
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = React.useState(false);

  // Загружаем информацию о тесте при изменении ID
  React.useEffect(() => {
    if (id) {
      settingsNewTestStore.getTestById(Number(id));
    }
  }, [id, settingsNewTestStore]);

  const updateTestStatus = async (newStatusId: number, statusName: string, statusNameRu: string, statusColor: string) => {
    if (!id) {
      setAlertMessage('ID теста не найден');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      // Получаем текущую информацию о тесте
      const currentTest = settingsNewTestStore.testMainInfo;
      
      if (!currentTest || Object.keys(currentTest).length === 0) {
        setAlertMessage('Информация о тесте не загружена');
        setAlertSeverity('error');
        setAlertOpen(true);
        return;
      }

      // Обновляем статус теста
      const updatedTestData = {
        ...currentTest,
        status_id: newStatusId,
        access_status_code: getStatusCode(newStatusId),
        access_status_name: statusNameRu,
        access_status_color: statusColor
      };

      const result = await settingsNewTestStore.updateTestStatus(updatedTestData, Number(id));
      
      if (result) {
        // Обновляем локальную информацию о тесте
        settingsNewTestStore.setTestById(updatedTestData);
        
        setAlertMessage(`Тест успешно ${getStatusActionText(newStatusId)}!`);
        setAlertSeverity('success');
        setAlertOpen(true);
      } else {
        setAlertMessage(`Ошибка при ${getStatusActionText(newStatusId)} теста`);
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса теста:', error);
      setAlertMessage(`Ошибка при ${getStatusActionText(newStatusId)} теста`);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusCode = (statusId: number): string => {
    switch (statusId) {
      case 1: return 'READY';
      case 2: return 'COMPLETED';
      case 3: return 'FAILED';
      case 4: return 'RETAKE_AVAILABLE';
      default: return 'UNKNOWN';
    }
  };

  const getStatusActionText = (statusId: number): string => {
    switch (statusId) {
      case 1: return 'активирован';
      case 2: return 'деактивирован';
      case 3: return 'окончен';
      default: return 'обновлен';
    }
  };

  const handleActivateTest = () => {
    updateTestStatus(1, 'Active', 'Активный', '#58d68d');
  };

  const handleDeactivateTest = () => {
    updateTestStatus(2, 'Setup in progress', 'Настройка в процессе', '#a569bd');
  };

  const handleEndTest = () => {
    updateTestStatus(3, 'Ended', 'Окончен', '#cacfd2');
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const navCollapse = item.children?.map((menuItem: any) => {
    switch (menuItem.type) {
      case 'collapse':
        return (
          <Typography key={menuItem.id} variant="caption" color="error" sx={{ p: 2.5 }}>
            collapse - only available in paid version
          </Typography>
        );
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  // Проверяем текущий статус теста
  const currentStatusId = settingsNewTestStore.testMainInfo?.status_id;
  const testStatus = settingsNewTestStore.testMainInfo?.access_status_name || 'Неизвестно';
  const isTestLoaded = settingsNewTestStore.testMainInfo && Object.keys(settingsNewTestStore.testMainInfo).length > 0;

  // Определяем, какие кнопки показывать в зависимости от текущего статуса
  const getActionButtons = () => {
    if (!id || !isTestLoaded) return null;

    switch (currentStatusId) {
      case 1: // Активный - можно деактивировать или окончить
        return (
          <Stack spacing={1} sx={{ width: '100%' }}>
            <Button
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PauseIcon />}
              style={{ width: '100%', textTransform: 'none' }} 
              variant="contained"
              color="warning"
              disabled={isLoading}
              onClick={handleDeactivateTest}
            >
              {isLoading ? 'Деактивация...' : 'Деактивировать тест'}
            </Button>
            <Button
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <StopIcon />}
              style={{ width: '100%', textTransform: 'none' }} 
              variant="contained"
              color="error"
              disabled={isLoading}
              onClick={handleEndTest}
            >
              {isLoading ? 'Завершение...' : 'Окончить тест'}
            </Button>
          </Stack>
        );
      
      case 2: // Настройка в процессе - можно активировать
        return (
          <Button
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            style={{ width: '100%', textTransform: 'none' }} 
            variant="contained"
            color="success"
            disabled={isLoading}
            onClick={handleActivateTest}
          >
            {isLoading ? 'Активация...' : 'Активировать тест'}
          </Button>
        );
      
      case 3: // Окончен - можно снова активировать
        return (
          <Button
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            style={{ width: '100%', textTransform: 'none' }} 
            variant="contained"
            color="success"
            disabled={isLoading}
            onClick={handleActivateTest}
          >
            {isLoading ? 'Активация...' : 'Активировать тест'}
          </Button>
        );
      
      default: // Неизвестный статус
        return (
          <Button
            style={{ width: '100%', textTransform: 'none' }} 
            variant="outlined"
            color="inherit"
            disabled={true}
          >
            Неизвестный статус
          </Button>
        );
    }
  };

  return (
    <>
      <List
        subheader={
          item.title &&
          drawerOpen && (
            <Box sx={{ pl: 3, mb: 1.5 }}>
              <Typography
                variant="h5"
              >
                {item.title}
              </Typography>
            </Box>
          )
        }
        sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
      >
        {navCollapse}
      </List>
      
      {/* Информация о статусе теста */}
      {id && isTestLoaded && (
        <Box sx={{ 
          p: 2, 
          mb: 2, 
          bgcolor: 'background.paper', 
          borderRadius: 1,
          border: `2px solid ${settingsNewTestStore.testMainInfo?.access_status_color || '#ccc'}`
        }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Статус теста: <strong>{testStatus}</strong>
          </Typography>
          <Typography variant="caption" color="textSecondary">
            ID статуса: {currentStatusId}
          </Typography>
          <Box sx={{ 
            mt: 1, 
            width: '100%', 
            height: 4, 
            bgcolor: settingsNewTestStore.testMainInfo?.access_status_color || '#ccc',
            borderRadius: 2
          }} />
        </Box>
      )}
      
      {/* Кнопки действий */}
      {getActionButtons()}

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
});

export default NavGroup;
