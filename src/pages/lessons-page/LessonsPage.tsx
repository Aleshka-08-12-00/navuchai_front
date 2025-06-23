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
import { useParams, useNavigate } from 'react-router-dom';
import { getLessons, postLesson, putLesson, deleteLesson } from 'api';

interface Lesson {
  id: number;
  title: string;
  content: string;
  video?: string;
}

const LessonsPage = () => {
  const { moduleId, courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [video, setVideo] = useState('');

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
      const payload = { title, content, video };
      if (editId) {
        await putLesson(editId, payload);
      } else {
        await postLesson(Number(moduleId), payload);
      }
      setOpen(false);
      setTitle('');
      setContent('');
      setVideo('');
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
    setVideo(lesson.video || '');
    setOpen(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setTitle('');
    setContent('');
    setVideo('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setTitle('');
    setContent('');
    setVideo('');
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
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>Назад</Button>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" color="success" onClick={handleAdd}>
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editId ? 'Редактировать урок' : 'Новый урок'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Ссылка на видео"
              value={video}
              onChange={(e) => setVideo(e.target.value)}
            />
            <JoditEditor ref={editor} value={content} onBlur={setContent} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSave} variant="contained" color="success">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LessonsPage;
