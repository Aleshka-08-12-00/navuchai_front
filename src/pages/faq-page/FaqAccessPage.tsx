import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem
} from '@mui/material';
import MainCard from '../../components/MainCard';
import { Context } from '../..';

const FaqAccessPage = observer(() => {
  const { faqStore, respondentsStore } = React.useContext(Context);

  useEffect(() => {
    faqStore.fetchCategories();
    respondentsStore.getRespondentLists();
  }, [faqStore, respondentsStore]);

  const handleChange = (categoryId: number, groupId: string) => {
    const value = groupId === '' ? null : Number(groupId);
    faqStore.updateCategory(categoryId, { user_group_id: value });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Права доступа к категориям FAQ
      </Typography>
      <MainCard>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Категория</TableCell>
                <TableCell>Группа</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faqStore.categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.title}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={cat.user_group_id ?? ''}
                      onChange={(e) => handleChange(cat.id, e.target.value as string)}
                      displayEmpty
                    >
                      <MenuItem value="">Все</MenuItem>
                      {respondentsStore.respondentListsArray.map((g) => (
                        <MenuItem key={g.id} value={g.id.toString()}>
                          {g.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </Box>
  );
});

export default FaqAccessPage;
