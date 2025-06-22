import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface LessonForm {
  id?: number;
  title: string;
  content?: string;
  video?: string;
}

interface ModuleForm {
  id?: number;
  title: string;
  description?: string;
  lessons: LessonForm[];
}

export interface CourseFormData {
  title: string;
  description?: string;
  accessType: 'public' | 'group' | 'user';
  accessId?: string;
  modules: ModuleForm[];
}

interface CourseFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CourseFormData) => void;
  course?: CourseFormData;
}

const emptyLesson = (): LessonForm => ({ title: '', content: '', video: '' });
const emptyModule = (): ModuleForm => ({ title: '', description: '', lessons: [emptyLesson()] });

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({ open, onClose, onSave, course }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessType, setAccessType] = useState<'public' | 'group' | 'user'>('public');
  const [accessId, setAccessId] = useState('');
  const [modules, setModules] = useState<ModuleForm[]>([emptyModule()]);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description || '');
      setAccessType(course.accessType);
      setAccessId(course.accessId || '');
      setModules(course.modules.length ? course.modules : [emptyModule()]);
    } else if (open) {
      setTitle('');
      setDescription('');
      setAccessType('public');
      setAccessId('');
      setModules([emptyModule()]);
    }
  }, [course, open]);

  const handleModuleChange = (index: number, field: keyof ModuleForm, value: string) => {
    setModules((prev) => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: keyof LessonForm, value: string) => {
    setModules((prev) => {
      const updated = [...prev];
      (updated[moduleIndex].lessons[lessonIndex] as any)[field] = value;
      return updated;
    });
  };

  const addModule = () => setModules((prev) => [...prev, emptyModule()]);
  const removeModule = (index: number) => setModules((prev) => prev.filter((_, i) => i !== index));

  const addLesson = (moduleIndex: number) => {
    setModules((prev) => {
      const updated = [...prev];
      updated[moduleIndex].lessons.push(emptyLesson());
      return updated;
    });
  };
  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setModules((prev) => {
      const updated = [...prev];
      updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
      return updated;
    });
  };

  const handleSave = () => {
    onSave({ title, description, accessType, accessId, modules });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{course ? 'Редактировать курс' : 'Новый курс'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField fullWidth label="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField
            fullWidth
            label="Описание"
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl>
            <InputLabel id="access-label">Права доступа</InputLabel>
            <Select labelId="access-label" value={accessType} label="Права доступа" onChange={(e) => setAccessType(e.target.value as any)}>
              <MenuItem value="public">Общий</MenuItem>
              <MenuItem value="group">Для группы</MenuItem>
              <MenuItem value="user">Для пользователя</MenuItem>
            </Select>
          </FormControl>
          {(accessType === 'group' || accessType === 'user') && (
            <TextField
              label={accessType === 'group' ? 'ID группы' : 'ID пользователя'}
              value={accessId}
              onChange={(e) => setAccessId(e.target.value)}
            />
          )}
          <Typography variant="h6">Модули и уроки</Typography>
          {modules.map((mod, modIndex) => (
            <Stack key={modIndex} spacing={1} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TextField
                  label="Название модуля"
                  value={mod.title}
                  onChange={(e) => handleModuleChange(modIndex, 'title', e.target.value)}
                  fullWidth
                />
                <IconButton onClick={() => removeModule(modIndex)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
              <TextField
                label="Описание"
                multiline
                minRows={2}
                value={mod.description}
                onChange={(e) => handleModuleChange(modIndex, 'description', e.target.value)}
              />
              <Typography variant="subtitle1">Уроки</Typography>
              {mod.lessons.map((les, lesIndex) => (
                <Stack key={lesIndex} direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Название"
                    value={les.title}
                    onChange={(e) => handleLessonChange(modIndex, lesIndex, 'title', e.target.value)}
                    fullWidth
                  />
                  <IconButton onClick={() => removeLesson(modIndex, lesIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button startIcon={<AddIcon />} onClick={() => addLesson(modIndex)}>
                Добавить урок
              </Button>
            </Stack>
          ))}
          <Button startIcon={<AddIcon />} onClick={addModule}>
            Добавить модуль
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained" color="success">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseFormDialog;
