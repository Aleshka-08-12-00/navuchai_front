import { Box, Button, IconButton, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import MainCard from "../../components/MainCard";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from "react-router";
import React, { useState } from "react";
import { Context } from "../..";
import { IRespondentLists } from "../../interface/interfaceStore";
import moment from 'moment'
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';

// Функция для склонения слова "участник"
function pluralizeParticipants(count: number) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 'участник';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'участника';
    return 'участников';
}

const RespondentsPage = observer(() => {

  const navigate = useNavigate();

  const { respondentsStore } = React.useContext(Context);

  const { 
    respondentListsArray,
    getRespondentLists,
    deleteUserGroupsById,
  } = respondentsStore

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  React.useEffect(() => {
    getRespondentLists()
  }, []);

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedItemId) {
      try {
        await deleteUserGroupsById(selectedItemId);
        setDeleteDialogOpen(false);
        setSelectedItemId(null);
        showAlert('Список участников успешно удален', 'success');
      } catch (error) {
        showAlert('Ошибка при удалении списка участников', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedItemId(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>
            <Typography variant="h5">Список участников ({respondentListsArray.length})</Typography>
            <div >
              <Button
                variant="contained"
                color="success"
                style={{ textTransform: "none", backgroundColor: '#0bc279' }}
                size="large"
                onClick={() => navigate(`/respondents/new`)}
                startIcon={<AddBoxIcon />}
              >
                Новый список
              </Button>
            </div>
          </div>
        </Grid>
        <Grid container spacing={2}>
          {respondentListsArray && respondentListsArray.map((item: IRespondentLists, index: number) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
              <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <div onClick={() => navigate(`/respondents/${item.id}`)} style={{cursor: 'pointer'}}>
                  <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="textSecondary" >
                      создан: {moment(item.created_at).format('DD.MM.YYYY HH:mm')} 
                    </Typography>
                    <span>
                      <IconButton 
                        color='error'
                        aria-label="delete" 
                        onClick={(e) => handleDeleteClick(e, item.id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </span>
                  </div>
                  <Stack sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="h4"  >
                      {item.name}
                    </Typography>
                  </Stack>
                  <Stack sx={{ mb: 2 }}>
                    <Typography variant="h6" color="textSecondary" >
                      ({item.description})
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PeopleIcon color="action" fontSize="small"  />
                      <Typography variant="h6" color="textSecondary">
                        {item.members?.length ?? 0} {pluralizeParticipants(item.members?.length ?? 0)}
                      </Typography>
                    </Stack>
                    <Button
                      color='inherit'
                      variant="outlined"
                      startIcon={<SettingsIcon />} 
                      onClick={(e) => { e.stopPropagation(); navigate(`/respondents/${item.id}`); }}
                      size="small"
                    >
                      Управление
                    </Button>
                  </Stack>
                </div>
              </MainCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить этот список участников?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant='outlined' color='inherit'>
            Отмена
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant='outlined'>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

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
  )
});
export default RespondentsPage;


