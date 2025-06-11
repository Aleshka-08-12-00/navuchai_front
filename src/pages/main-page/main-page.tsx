import { Box, Button, IconButton, Stack, Typography, FormControl, Select, MenuItem, TextField, SelectChangeEvent, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SearchIcon from '@mui/icons-material/Search';
import MainCard from "../../components/MainCard";

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

import SvgIcon from '@mui/material/SvgIcon';
import React, { useState } from "react";
import { Context } from "../..";
import { useNavigate } from "react-router";
import { Menu } from '@mui/material';
import { InterfaceTests } from "../../interface/interfaceStore";
import moment from "moment";


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
    authStore.authMe();
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

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>

        <>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>
              <Typography variant="h5">Мои тесты ({testsArray.length})</Typography>
              <div >
                <Button
                  color="success"
                  style={{ textTransform: "none", marginRight: 10, backgroundColor: '#8772c1' }}
                  variant="contained"
                  startIcon={<AutoFixHighIcon />}
                  size="large"
                  disabled
                >
                  Генерация тестов
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  style={{ textTransform: "none", backgroundColor: '#0bc279' }}
                  size="large"
                  startIcon={<AddBoxIcon />}
                  onClick={() => navigate(`/main-page/new-test`)}
                >
                  Новый тест
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'white', borderRadius: 8, padding: '12px 20px', minHeight: 56 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" color="textSecondary" sx={{ mr: 1 }}>Фильтр по категории</Typography>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={category}
                    onChange={handleCategoryChange}
                    displayEmpty
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
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" color="textSecondary" sx={{ mr: 1 }}>Фильтр по статусам</Typography>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    displayEmpty
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
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Поиск по словам..."
                  value={search}
                  onChange={handleSearchChange}
                  sx={{ minWidth: 200, background: '#fff', borderRadius: 1 }}
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small">
                        <SearchIcon />
                      </IconButton>
                    )
                  }}
                />
              </Box>
            </div>
          </Grid>

          <Grid container spacing={2}>
            {filteredTests && filteredTests.map((item: InterfaceTests, index: number) => (
              <Grid item xs={12} sm={6} md={6} lg={6}
                key={index}
              >
                <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>

                      <Button
                        variant="outlined"
                        style={{
                          textTransform: 'none',
                          color: item.status_color,
                          borderColor: item.status_color
                        }}
                        onClick={() => window.open(`/main-page/test/${item.id}`, '_blank')}
                        size="small"
                      >
                        {item.status_name_ru}
                      </Button>
                      <Typography variant="h6" color="textSecondary" >
                        создан: {moment(item.access_timestamp).format('DD-MM-YYYY')}
                      </Typography>
                         <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          style={{
                            textTransform: 'none',
                            marginRight: 10
                          }}
                          onClick={() => window.open(`/start_test/${item.id}`, '_blank')}>
                          Начать тест
                        </Button>
                      <Box>
                        <IconButton aria-label="Example" onClick={(e) => handleOpenMenu(e, item.id)}>
                          <FontAwesomeSvgIcon icon={faEllipsisV} />
                        </IconButton>
                        <Menu
                          anchorEl={menuAnchorEl[item.id]}
                          open={Boolean(menuAnchorEl[item.id])}
                          onClose={() => handleCloseMenu(item.id)}
                          PaperProps={{
                            style: {
                              border: '1px solid gray',
                              borderRadius: '8px',
                              padding: '5px',
                            },
                          }}
                        >
                          <MenuItem onClick={() => handleDeleteTestById(item.id)}>Удалить</MenuItem>
                           <MenuItem onClick={() => window.open(`/start_test/${item.id}`, '_blank')}>Начать тест</MenuItem>
                          {/* <MenuItem onClick={() => handleDuplicate(item.id)}>Дублировать</MenuItem> */}
                          <MenuItem onClick={() => window.open(`/main-page/test/${item.id}`, '_blank')}>Редактировать</MenuItem>
                        </Menu>
                      </Box>
                    </div>
                    <Stack sx={{ mt: 2, mb: 2 }} style={{ cursor: 'pointer' }} onClick={() => window.open(`/main-page/test/${item.id}`, '_blank')}>
                      <Typography variant="h4"  >
                        {item.title}
                      </Typography>
                    </Stack>
                    <Stack sx={{ mb: 2 }} style={{ cursor: 'pointer' }} onClick={() => window.open(`/main-page/test/${item.id}`, '_blank')}>
                      <Typography variant="h6" color="textSecondary" >
                        ({item.description})
                      </Typography>
                    </Stack>
                    <div
                      style={{
                        display: "flex",
                        margin: "auto",
                        justifyContent: "space-between",
                        alignItems: "center", // на случай, если нужно выровнять вертикально
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", textAlign: "left", gap: "10px" }}>
                        <Typography variant="h6" color="textSecondary">
                          <DonutLargeIcon color={
                            (Number(item.percent) || 0) <= 20 ? 'error' : 
                            (Number(item.percent) || 0) <= 50 ? 'warning' : 
                            'success'
                          } />
                        </Typography>
                        <Typography variant="h6" >
                          {item.percent}%
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                          средний результат
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                          |
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                          Пройдено ({item.completed})
                        </Typography>
                      </div>

                      <div style={{ flex: "1", textAlign: "right" }}>
                        {/* <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          style={{
                            textTransform: 'uppercase',
                            marginRight: 10
                          }}
                          onClick={() => window.open(`/start_test/${item.id}`, '_blank')}>
                          начать тест
                        </Button> */}
                          <Typography variant="h6">
                         {item.category_name}
                        </Typography>
                        {/* <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          style={{
                            textTransform: 'uppercase'
                          }}>
                          {item.category_name}
                        </Button> */}

                      </div>
                    </div>
                  </>
                </MainCard>
              </Grid>
            ))}
          </Grid>
        </>
      </Box>
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
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить этот тест?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant='outlined' color='inherit'>
            Отмена
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant='outlined'>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
});
export default MainPage;
