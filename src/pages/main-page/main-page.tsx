// import {
//   Box,
//   Button,
//   IconButton,
//   Stack,
//   Typography,
//   FormControl,
//   Select,
//   MenuItem,
//   TextField,
//   SelectChangeEvent,
//   Alert,
//   Snackbar,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from "@mui/material";
// import { observer } from "mobx-react-lite";
// import { Grid } from "@mui/material";
// import AddBoxIcon from '@mui/icons-material/AddBox';
// import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
// import SearchIcon from '@mui/icons-material/Search';
// import MainCard from "../../components/MainCard";

// import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
// import DonutLargeIcon from '@mui/icons-material/DonutLarge';

// import SvgIcon from '@mui/material/SvgIcon';
// import React, { useState } from "react";
// import { Context } from "../..";
// import { useNavigate } from "react-router";
// import { Menu } from '@mui/material';
// import { InterfaceTests } from "../../interface/interfaceStore";
// import moment from "moment";
// import { node } from "prop-types";
// import { gold } from "@ant-design/colors";


// type FontAwesomeSvgIconProps = {
//   icon: any;
// };

// const FontAwesomeSvgIcon = React.forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>(
//   (props, ref) => {
//     const { icon } = props;

//     const {
//       icon: [width, height, , , svgPathData],
//     } = icon;

//     return (
//       <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
//         {typeof svgPathData === 'string' ? (
//           <path d={svgPathData} />
//         ) : (
//           svgPathData.map((d: string, i: number) => (
//             <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
//           ))
//         )}
//       </SvgIcon>
//     );
//   },
// );



// const MainPage = observer(() => {

//   const { mainPageStore, authStore } = React.useContext(Context);


//   const {
//     getTests,
//     testsArray,
//     getCategories,
//     categoriesArray,
//     getTestStatuses,
//     testStatusesArray,
//     deleteTestById,
//     putTestById,
//   } = mainPageStore

//   const {
//     authMe,
//     roleCode,
//   } = authStore

//   const [category, setCategory] = useState<string>('all');
//   const [status, setStatus] = useState<string>('all');
//   const [search, setSearch] = useState('');
//   const [alertOpen, setAlertOpen] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [testToDelete, setTestToDelete] = useState<number | null>(null);

//   React.useEffect(() => {
//     getTests();
//     getCategories();
//     getTestStatuses();
//     authMe();
//   }, []);

//   const navigate = useNavigate();


//   const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});

//   const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: number) => {
//     setMenuAnchorEl(prev => ({
//       ...prev,
//       [id]: event.currentTarget
//     }));
//   };

//   const handleCloseMenu = (id: number) => {
//     setMenuAnchorEl(prev => ({
//       ...prev,
//       [id]: null
//     }));
//   };

//   const handleCopy = (id: number) => {
//     handleCloseMenu(id);
//   };

//   const handleDeleteTestById = (id: number) => {
//     setTestToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const showAlert = (message: string, severity: 'success' | 'error') => {
//     setAlertMessage(message);
//     setAlertSeverity(severity);
//     setAlertOpen(true);
//   };

//   const handleCloseAlert = () => {
//     setAlertOpen(false);
//   };

//   const handleConfirmDelete = () => {
//     if (testToDelete) {
//       deleteTestById(testToDelete);
//       handleCloseMenu(testToDelete);
//       setDeleteDialogOpen(false);
//       setTestToDelete(null);
//       showAlert('Тест успешно удален', 'success');
//     }
//   };

//   const handleCancelDelete = () => {
//     setDeleteDialogOpen(false);
//     setTestToDelete(null);
//   };

//   const handleDuplicate = (id: number) => {
//     showAlert("Дублировать выбрано", "success");
//     handleCloseMenu(id);
//   };

//   const handleEditTest = (id: number) => {
//     putTestById(id);
//   }

//   const handleCategoryChange = (event: SelectChangeEvent) => {
//     setCategory(event.target.value);
//   };
//   const handleStatusChange = (event: SelectChangeEvent) => {
//     setStatus(event.target.value);
//   };
//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearch(event.target.value);
//   };

//   // Фильтрация по поиску, статусу и категории
//   const filteredTests = testsArray.filter((item: InterfaceTests) => {
//     const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
//     const matchesStatus = status === 'all' || item.status_id === Number(status);
//     const matchesCategory = category === 'all' || item.category_id === Number(category);

//     return matchesSearch && matchesStatus && matchesCategory;
//   });

//   return (
//     <>
//       <Box sx={{ flexGrow: 1 }}>

//         <>
//           <Grid item xs={12} sx={{ mb: 2 }}>
//             <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>
//               <Typography variant="h5">Мои тесты ({testsArray.length})</Typography>
//               <div style={roleCode === 'admin' ? {display: 'none'} : {}}>
//                 <Button
//                   color="success"
//                   style={{ textTransform: "none", marginRight: 10, backgroundColor: '#8772c1' }}
//                   variant="contained"
//                   startIcon={<AutoFixHighIcon />}
//                   size="large"
//                   disabled
//                 >
//                   Генерация тестов
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   style={{ textTransform: "none", backgroundColor: '#0bc279' }}
//                   size="large"
//                   startIcon={<AddBoxIcon />}
//                   onClick={() => navigate(`/main-page/new-test`)}
//                 >
//                   Новый тест
//                 </Button>
//               </div>
//             </div>
//           </Grid>
//           <Grid item xs={12} sx={{ mb: 2 }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'white', borderRadius: 8, padding: '12px 20px', minHeight: 56 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <Typography variant="body1" color="textSecondary" sx={{ mr: 1 }}>Фильтр по категории</Typography>
//                 <FormControl size="small" sx={{ minWidth: 140 }}>
//                   <Select
//                     value={category}
//                     onChange={handleCategoryChange}
//                     displayEmpty
//                   >
//                     <MenuItem value="all">Все категории</MenuItem>
//                     {categoriesArray.map((cat) => (
//                       <MenuItem key={cat.id} value={cat.id.toString()}>
//                         {cat.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Box>
//               <Box sx={{ flexGrow: 1 }} />
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <Typography variant="body1" color="textSecondary" sx={{ mr: 1 }}>Фильтр по статусам</Typography>
//                 <FormControl size="small" sx={{ minWidth: 100 }}>
//                   <Select
//                     value={status}
//                     onChange={handleStatusChange}
//                     displayEmpty
//                   >
//                     <MenuItem value="all">Все статусы</MenuItem>
//                     {testStatusesArray.map((statusItem) => (
//                       <MenuItem key={statusItem.id} value={statusItem.id.toString()}>
//                         {statusItem.name_ru}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Box>
//               <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
//                 <TextField
//                   size="small"
//                   variant="outlined"
//                   placeholder="Поиск по словам..."
//                   value={search}
//                   onChange={handleSearchChange}
//                   sx={{ minWidth: 200, background: '#fff', borderRadius: 1 }}
//                   InputProps={{
//                     endAdornment: (
//                       <IconButton size="small">
//                         <SearchIcon />
//                       </IconButton>
//                     )
//                   }}
//                 />
//               </Box>
//             </div>
//           </Grid>

//           <Grid container spacing={2}>
//             {filteredTests && filteredTests.map((item: InterfaceTests, index: number) => (
//               <Grid item xs={12} sm={6} md={6} lg={6}
//                 key={index}
//               >
//                 <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
//                   <>
//                     <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>

//                       <Button
//                         variant="outlined"
//                         style={{
//                           textTransform: 'none',
//                           color: item.status_color,
//                           borderColor: item.status_color
//                         }}
//                         onClick={() => window.open(`/main-page/test/${item.id}`, '_blank')}
//                         size="small"
//                       >
//                         {item.status_name_ru}
//                       </Button>
//                       <Typography variant="h6" color="textSecondary" >
//                         доступен с : {moment(item.access_timestamp).format('HH:MM DD-MM-YYYY')}
//                       </Typography>
//                       <Button
//                         variant="outlined"
//                         size="small"
//                         color="secondary"
//                         style={{
//                           textTransform: 'none',
//                           marginRight: 10
//                         }}
//                         onClick={() => window.open(`/start_test/${item.id}`, '_blank')}>
//                         Начать тест
//                       </Button>
//                       <Box sx={roleCode === 'admin' ? {display: 'none'} : {}}>
//                         <IconButton aria-label="Example" onClick={(e) => handleOpenMenu(e, item.id)}>
//                           <FontAwesomeSvgIcon icon={faEllipsisV} />
//                         </IconButton>
//                         <Menu
//                           anchorEl={menuAnchorEl[item.id]}
//                           open={Boolean(menuAnchorEl[item.id])}
//                           onClose={() => handleCloseMenu(item.id)}
//                           PaperProps={{
//                             style: {
//                               border: '1px solid gray',
//                               borderRadius: '8px',
//                               padding: '5px',
//                             },
//                           }}
//                         >
//                           <MenuItem onClick={() => handleDeleteTestById(item.id)}>Удалить</MenuItem>
//                           <MenuItem onClick={() => window.open(`/start_test/${item.id}`, '_blank')}>Начать тест</MenuItem>
//                           {/* <MenuItem onClick={() => handleDuplicate(item.id)}>Дублировать</MenuItem> */}
//                           <MenuItem onClick={() => window.open(`/main-page/test/${item.id}`, '_blank')}>Редактировать</MenuItem>
//                         </Menu>
//                       </Box>
//                     </div>
//                     <Stack sx={{ mt: 2, mb: 2 }} style={{ cursor: 'pointer' }} onClick={() => window.open(`/main-page/test/${item.id}`, '_blank')}>
//                       <Typography variant="h4"  >
//                         {item.title}
//                       </Typography>
//                     </Stack>
//                     <Stack sx={{ mb: 2 }} style={{ cursor: 'pointer' }} onClick={() => window.open(`/main-page/test/${item.id}`, '_blank')}>
//                       <Typography variant="h6" color="textSecondary" >
//                         ({item.description})
//                       </Typography>
//                     </Stack>
//                     <div
//                       style={ {
//                         display: "flex",
//                         margin: "auto",
//                         justifyContent: "space-between",
//                         alignItems: "center", // на случай, если нужно выровнять вертикально
//                       }}
//                     >
//                       <div style={ roleCode === 'admin' ? { 
//                         display: 'none'
//                             } : { display: "flex",
//                          flexDirection: "row", 
//                          justifyContent: "flex-start",
//                           alignItems: "center",
//                            textAlign: "left",
//                             gap: "10px" }}>
//                         <Typography variant="h6" color="textSecondary">
//                           <DonutLargeIcon color={
//                             (Number(item.percent) || 0) <= 20 ? 'error' :
//                               (Number(item.percent) || 0) <= 50 ? 'warning' :
//                                 'success'
//                           } />
//                         </Typography>
//                         <Typography variant="h6" >
//                           {item.percent}%
//                         </Typography>
//                         <Typography variant="h6" color="textSecondary">
//                           средний результат
//                         </Typography>
//                         <Typography variant="h6" color="textSecondary">
//                           |
//                         </Typography>
//                         <Typography variant="h6" color="textSecondary">
//                           Пройдено ({item.completed})
//                         </Typography>
//                       </div>
//                         <div style={ roleCode === 'admin' ? { 
//                           display: "flex",
//                          flexDirection: "row", 
//                          justifyContent: "flex-start",
//                           alignItems: "center",
//                            textAlign: "left",
//                             gap: "10px"
//                             } : { display: "none" }}>
                      
//                         <Typography variant="h6" color='green' >
//                           тест пройден 
//                         </Typography>
//                       </div>

//                       <div style={{ flex: "1", textAlign: "right" }}>
//                         <Typography variant="h6">
//                           <Typography variant="h6" color="textSecondary" component="span">
//                             категория:
//                           </Typography> {item.category_name}
//                         </Typography>
//                       </div>
//                     </div>
//                   </>
//                 </MainCard>
//               </Grid>
//             ))}
//           </Grid>
//         </>
//       </Box>
//       <Snackbar
//         open={alertOpen}
//         autoHideDuration={6000}
//         onClose={handleCloseAlert}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
//           {alertMessage}
//         </Alert>
//       </Snackbar>
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={handleCancelDelete}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           Подтверждение удаления
//         </DialogTitle>
//         <DialogContent>
//           <Typography>
//             Вы уверены, что хотите удалить этот тест?
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancelDelete} variant='outlined' color='inherit'>
//             Отмена
//           </Button>
//           <Button onClick={handleConfirmDelete} color="error" variant='outlined'>
//             Удалить
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   )
// });
// export default MainPage;




import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Tooltip,
  Fade
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SearchIcon from '@mui/icons-material/Search';
import MainCard from "../../components/MainCard";

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';

import SvgIcon from '@mui/material/SvgIcon';
import React, { useState } from "react";
import { Context } from "../..";
import { useNavigate } from "react-router";
import { Menu } from '@mui/material';
import { InterfaceTests } from "../../interface/interfaceStore";
import moment from "moment";
import { node } from "prop-types";
import { gold } from "@ant-design/colors";


type FontAwesomeSvgIconProps = {
  icon: any;
};

const FontAwesomeSvgIcon = React.forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>(
  (props, ref) => {
    const { icon } = props;

    const {
      icon: [width, height, , , svgPathData],
    } = icon;

    return (
      <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
        {typeof svgPathData === 'string' ? (
          <path d={svgPathData} />
        ) : (
          svgPathData.map((d: string, i: number) => (
            <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
          ))
        )}
      </SvgIcon>
    );
  },
);



const MainPage = observer(() => {

  const { mainPageStore, authStore } = React.useContext(Context);


  const {
    getTests,
    testsArray,
    getCategories,
    categoriesArray,
    getTestStatuses,
    testStatusesArray,
    deleteTestById,
    putTestById,
  } = mainPageStore

  const {
    authMe,
    roleCode,
    roleName
  } = authStore

  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<number | null>(null);

  React.useEffect(() => {
    getTests();
    getCategories();
    getTestStatuses();
    authMe();
  }, []);

  const navigate = useNavigate();


  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({});

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchorEl(prev => ({
      ...prev,
      [id]: event.currentTarget
    }));
  };

  const handleCloseMenu = (id: number) => {
    setMenuAnchorEl(prev => ({
      ...prev,
      [id]: null
    }));
  };

  const handleCopy = (id: number) => {
    handleCloseMenu(id);
  };

  const handleDeleteTestById = (id: number) => {
    setTestToDelete(id);
    setDeleteDialogOpen(true);
  };

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleConfirmDelete = () => {
    if (testToDelete) {
      deleteTestById(testToDelete);
      handleCloseMenu(testToDelete);
      setDeleteDialogOpen(false);
      setTestToDelete(null);
      showAlert('Тест успешно удален', 'success');
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTestToDelete(null);
  };

  const handleDuplicate = (id: number) => {
    showAlert("Дублировать выбрано", "success");
    handleCloseMenu(id);
  };

  const handleEditTest = (id: number) => {
    putTestById(id);
  }

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // Фильтрация по поиску, статусу и категории
  const filteredTests = testsArray.filter((item: InterfaceTests) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || item.status_id === Number(status);
    const matchesCategory = category === 'all' || item.category_id === Number(category);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (statusColor: string | undefined) => {
    return statusColor || '#1976d2';
  };

  const getProgressColor = (percent: number) => {
    if (percent <= 20) return '#f44336';
    if (percent <= 50) return '#ff9800';
    return '#4caf50';
  };

  // Система цветов для разных ролей
  const getRoleColors = (roleCode: string) => {
    switch (roleCode) {
      case 'admin':
        return {
          primary: '#d32f2f', // Красный для администратора
          secondary: '#ffcdd2',
          gradient: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          light: 'rgba(211, 47, 47, 0.1)',
          chip: '#d32f2f',
          name: 'Администратор'
        };
      case 'moderator':
        return {
          primary: '#f57c00', // Оранжевый для модератора
          secondary: '#ffe0b2',
          gradient: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
          light: 'rgba(245, 124, 0, 0.1)',
          chip: '#f57c00',
          name: 'Модератор'
        };
      case 'user':
        return {
          primary: '#1976d2', // Синий для пользователя
          secondary: '#bbdefb',
          gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          light: 'rgba(25, 118, 210, 0.1)',
          chip: '#1976d2',
          name: 'Пользователь'
        };
      case 'guest':
        return {
          primary: '#757575', // Серый для гостя
          secondary: '#eeeeee',
          gradient: 'linear-gradient(135deg, #757575 0%, #616161 100%)',
          light: 'rgba(117, 117, 117, 0.1)',
          chip: '#757575',
          name: 'Гость'
        };
      default:
        return {
          primary: '#9e9e9e', // Светло-серый по умолчанию
          secondary: '#f5f5f5',
          gradient: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
          light: 'rgba(158, 158, 158, 0.1)',
          chip: '#9e9e9e',
          name: 'Неизвестная роль'
        };
    }
  };

  const roleColors = getRoleColors(roleCode);

  return (
    <>
      <Box sx={{ 
        flexGrow: 1, 
        background: '#edf7ff',
        minHeight: '100vh',
        // p: 3
      }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          {/* Header Section */}
          <Card sx={{ 
            mb: 3, 
            // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            background: ' #667eea',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Мои тесты
                  </Typography>
                  <Chip 
                    label={`${testsArray.length} тестов`}
                    sx={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
                <Box sx={roleCode !== 'admin' ? {display: 'none'} : {}}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      color="inherit"
                      sx={{ 
                        textTransform: "none", 
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(255,255,255,0.3)',
                        }
                      }}
                      variant="contained"
                      startIcon={<AutoFixHighIcon />}
                      size="large"
                      disabled
                    >
                      Генерация тестов
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ 
                        textTransform: "none", 
                        background: 'linear-gradient(45deg, #4caf50, #45a049)',
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #45a049, #4caf50)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                        }
                      }}
                      size="large"
                      startIcon={<AddBoxIcon />}
                      onClick={() => navigate(`/main-page/new-test`)}
                    >
                      Новый тест
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Filters Section */}
          <Card sx={{ 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 3, 
                flexWrap: 'wrap'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CategoryIcon color="primary" />
                  <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Категория
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <Select
                      value={category}
                      onChange={handleCategoryChange}
                      displayEmpty
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">Все категории</MenuItem>
                      {categoriesArray.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingUpIcon color="primary" />
                  <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 600 }}>
                    Статус
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select
                      value={status}
                      onChange={handleStatusChange}
                      displayEmpty
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="all">Все статусы</MenuItem>
                      {testStatusesArray.map((statusItem) => (
                        <MenuItem key={statusItem.id} value={statusItem.id.toString()}>
                          {statusItem.name_ru}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                  <SearchIcon color="primary" />
                  <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Поиск по названию..."
                    value={search}
                    onChange={handleSearchChange}
                    sx={{ 
                      minWidth: 250, 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.8)'
                      }
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Tests Grid */}
          <Grid container spacing={3}>
            {filteredTests && filteredTests.map((item: InterfaceTests, index: number) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Fade in timeout={300 + index * 100}>
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    }
                  }}>
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mb: 2
                      }}>
                        <Chip
                          label={item.status_name_ru}
                          sx={{
                            background: getStatusColor(item.status_color),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}
                        />
                        <Box sx={roleCode !== 'admin' ? {display: 'none'} : {}}>
                          <Tooltip title="Действия">
                            <IconButton 
                              onClick={(e) => handleOpenMenu(e, item.id)}
                              sx={{ 
                                background: 'rgba(0,0,0,0.04)',
                                '&:hover': { background: 'rgba(0,0,0,0.08)' }
                              }}
                            >
                              <FontAwesomeSvgIcon icon={faEllipsisV} />
                            </IconButton>
                          </Tooltip>
                          <Menu
                            anchorEl={menuAnchorEl[item.id]}
                            open={Boolean(menuAnchorEl[item.id])}
                            onClose={() => handleCloseMenu(item.id)}
                            PaperProps={{
                              style: {
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                padding: '8px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                              },
                            }}
                          >
                            <MenuItem onClick={() => handleDeleteTestById(item.id)}>Удалить</MenuItem>
                            <MenuItem onClick={() => window.open(`/start_test/${item.id}`, '_blank')}>Начать тест</MenuItem>
                            <MenuItem onClick={() => window.open(`/main-page/test/${item.id}`, '_blank')}>Редактировать</MenuItem>
                          </Menu>
                        </Box>
                      </Box>

                      {/* Title */}
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 2, 
                          cursor: 'pointer',
                          '&:hover': { color: 'primary.main' }
                        }}
                        onClick={() => navigate(`/main-page/test/${item.id}`)}
                      >
                        {item.title}
                      </Typography>

                      {/* Description */}
                      <Typography 
                        variant="body2" 
                        color="textSecondary" 
                        sx={{ 
                          mb: 3, 
                          cursor: 'pointer',
                          lineHeight: 1.6
                        }}
                        onClick={() => navigate(`/main-page/test/${item.id}`)}
                      >
                        {item.description}
                      </Typography>

                      {/* Access Time */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        mb: 3,
                        p: 2,
                        background: 'rgba(0,0,0,0.02)',
                        borderRadius: 2
                      }}>
                        <AccessTimeIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="textSecondary">
                          Доступен с: {moment(item.access_timestamp).format('HH:mm DD.MM.YYYY')}
                        </Typography>
                      </Box>

                      {/* Progress Section */}
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                            Средний результат
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: getProgressColor(Number(item.percent) || 0) }}>
                            {item.percent}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={Number(item.percent) || 0}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getProgressColor(Number(item.percent) || 0),
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>

                      {/* Stats and Actions */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 'auto'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PeopleIcon color="action" fontSize="small" />
                            <Typography variant="body2" color="textSecondary">
                              {item.completed}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            |
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {item.category_name}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ 
                            textTransform: 'none',
                            // borderRadius: 2,
                            fontWeight: 600,
                            background: ' #21CBF3',
                            '&:hover': {
                              background: ' #2196F3',
                              transform: 'translateY(-1px)',
                            }
                          }}
                          onClick={() => window.open(`/start_test/${item.id}`, '_blank')}
                        >
                          Начать тест
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {/* Empty State */}
          {filteredTests.length === 0 && (
            <Card sx={{ 
              textAlign: 'center', 
              p: 8, 
              borderRadius: 3,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
                Тесты не найдены
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Попробуйте изменить параметры фильтрации
              </Typography>
            </Card>
          )}
        </Box>
      </Box>

     
      {/* {roleName.length && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          zIndex: 1000 
        }}>
          <Card sx={{ 
            background: roleColors.gradient,
            color: 'white',
            borderRadius: 3,
            boxShadow: `0 8px 32px ${roleColors.light}`,
            border: `1px solid ${roleColors.primary}`
          }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: 'white',
                  opacity: 0.8
                }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {roleColors.name}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )} */}

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertSeverity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700 }}>
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить этот тест?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCancelDelete} 
            variant='outlined' 
            color='inherit'
          >
            Отмена
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant='outlined'
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
});

export default MainPage;
