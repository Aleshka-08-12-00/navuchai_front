import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import JoditEditor from 'jodit-react';
import { useParams } from 'react-router-dom';
import { getLessons, postLesson, putLesson, deleteLesson } from 'api';

interface Lesson {
  id: number;
  title: string;
  content: string;
}

const LessonsPage = () => {
  const { moduleId, courseId } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const load = async () => {
    if (!moduleId) return;
    const data = await getLessons(Number(moduleId));
    setLessons(data);
  };

  useEffect(() => {
    load();
  }, [moduleId]);

  const handleSave = async () => {
    if (!moduleId) return;
    try {
      if (editId) {
        await putLesson(editId, { title, content, module_id: Number(moduleId) });
      } else {
        await postLesson(Number(moduleId), { title, content });
      }
      setOpen(false);
      setTitle('');
      setContent('');
      setEditId(null);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditId(lesson.id);
    setTitle(lesson.title);
    setContent(lesson.content);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteLesson(id);
    load();
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Уроки
      </Typography>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" color="success" onClick={() => setOpen(true)}>
          Добавить урок
        </Button>
      </Stack>
      <List>
        {lessons.map((lesson) => (
          <ListItem
            key={lesson.id}
            secondaryAction={
              <>
                <Button onClick={() => handleEdit(lesson)}>Редактировать</Button>
                <Button color="error" onClick={() => handleDelete(lesson.id)}>
                  Удалить
                </Button>
              </>
            }
          >
            <ListItemText
              primary={lesson.title}
              onClick={() => window.location.assign(`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`)}
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editId ? 'Редактировать урок' : 'Новый урок'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <JoditEditor ref={editor} value={content} onBlur={setContent} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained" color="success">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LessonsPage;
