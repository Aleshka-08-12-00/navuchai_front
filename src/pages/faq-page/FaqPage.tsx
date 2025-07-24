import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MainCard from '../../components/MainCard';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { IFaqCategory } from '../../interface/interfaceStore';

const FaqPage = observer(() => {
  const { faqStore, authStore } = useContext(Context);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [editingCategory, setEditingCategory] = useState<IFaqCategory | null>(null);

  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuCategoryId, setMenuCategoryId] = useState<number | null>(null);

  useEffect(() => {
    faqStore.fetchCategories();
  }, [faqStore]);

  useEffect(() => {
    if (selectedCategory !== null) {
      faqStore.fetchFaqs(selectedCategory, true);
    }
  }, [selectedCategory, faqStore]);

  const handleOpenCategoryDialog = (cat?: IFaqCategory) => {
    setEditingCategory(cat || null);
    setCategoryTitle(cat?.title || '');
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (editingCategory) {
      await faqStore.updateCategory(editingCategory.id, { title: categoryTitle });
    } else {
      await faqStore.createCategory({ title: categoryTitle, user_group_id: null, express: false });
    }
    setCategoryDialogOpen(false);
    setCategoryTitle('');
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: number) => {
    await faqStore.removeCategory(id);
    if (selectedCategory === id) setSelectedCategory(null);
    setMenuAnchor(null);
  };

  const handleAskQuestion = async () => {
    if (selectedCategory !== null) {
      await faqStore.createFaq({ category_id: selectedCategory, question: questionText });
      setQuestionText('');
      setQuestionDialogOpen(false);
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
        <Box sx={{ minWidth: 250 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Категории</Typography>
            {authStore.roleCode === 'admin' && (
              <IconButton onClick={() => handleOpenCategoryDialog()} size="small">
                <AddIcon />
              </IconButton>
            )}
          </Stack>
          <List>
            {faqStore.categories.map((cat) => (
              <ListItem
                button
                key={cat.id}
                selected={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                secondaryAction={
                  authStore.roleCode === 'admin' && (
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        setMenuCategoryId(cat.id);
                        setMenuAnchor(e.currentTarget);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText primary={cat.title} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box flexGrow={1}>
          {selectedCategory !== null && (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Вопросы</Typography>
                <Button variant="outlined" onClick={() => setQuestionDialogOpen(true)}>
                  Задать вопрос
                </Button>
              </Stack>
              {faqStore.faqs.map((f) => (
                <Card key={f.id} sx={{ mb: 2 }}>
                  <CardHeader title={f.question} subheader={f.username} />
                  <CardContent>
                    {f.answer ? (
                      <Typography>{f.answer}</Typography>
                    ) : (
                      <Typography color="text.secondary">Нет ответа</Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </Box>
      </Stack>

      <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)}>
        <DialogTitle>{editingCategory ? 'Редактировать категорию' : 'Новая категория'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Название"
            fullWidth
            value={categoryTitle}
            onChange={(e) => setCategoryTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveCategory} variant="contained" color="success">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={questionDialogOpen} onClose={() => setQuestionDialogOpen(false)}>
        <DialogTitle>Задать вопрос</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Вопрос"
            fullWidth
            multiline
            minRows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAskQuestion} variant="contained" color="success">
            Отправить
          </Button>
        </DialogActions>
      </Dialog>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem
          onClick={() => {
            const cat = faqStore.categories.find((c) => c.id === menuCategoryId);
            if (cat) handleOpenCategoryDialog(cat);
            setMenuAnchor(null);
          }}
        >
          Редактировать
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuCategoryId) handleDeleteCategory(menuCategoryId);
          }}
        >
          Удалить
        </MenuItem>
      </Menu>
    </Box>
  );
});

export default FaqPage;
