import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Context } from '../../..';
import MainCard from '../../../components/MainCard';

const RespondentListMembers: React.FC = observer(() => {
  const { respondentsStore } = React.useContext(Context);
  const { respondentListInfo, usersArray, deleteUsersFromList } = respondentsStore;

  const handleDeleteUser = async (userId: number) => {
    if (respondentListInfo) {
      try {
        await deleteUsersFromList(respondentListInfo.id, userId);
      } catch (error) {
        console.error('Failed to remove user from list:', error);
      }
    }
  };

  if (!respondentListInfo) {
    return (
      <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Нет данных о списке респондентов
        </Typography>
      </MainCard>
    );
  }

  // Get full user information for each member
  const membersWithUserInfo = respondentListInfo.members.map(member => {
    const userInfo = usersArray.find(user => user.id === member.user_id);
    return {
      ...member,
      user: userInfo
    };
  });

  return (
    <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">
          Участники списка ({membersWithUserInfo.length})
        </Typography>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Дата добавления</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {membersWithUserInfo.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.user?.name || 'Неизвестно'}</TableCell>
                <TableCell>{member.user?.email || 'Неизвестно'}</TableCell>
                <TableCell>{member.user?.role?.name || 'Неизвестно'}</TableCell>
                <TableCell>
                  {new Date(member.created_at).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteUser(member.user_id)}
                    color="error"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {membersWithUserInfo.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Нет участников в списке
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
});

export default RespondentListMembers; 