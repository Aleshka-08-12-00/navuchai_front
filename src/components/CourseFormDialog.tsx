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
import EditIcon from '@mui/icons-material/Edit';
import LessonFormDialog, { LessonFormData } from './LessonFormDialog';
import { postData } from '../api';

interface LessonForm {
  id?: number;
  title: string;
  content?: string;
  video?: string;
  image?: string;
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
  imageId?: number;
  image?: string;
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
  const [courseImage, setCourseImage] = useState<string>('');
  const [courseImageFile, setCourseImageFile] = useState<File | null>(null);
  const [courseImageId, setCourseImageId] = useState<number | null>(null);
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number | null>(null);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<LessonFormData | undefined>(undefined);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description || '');
      setAccessType(course.accessType);
      setAccessId(course.accessId || '');
      setModules(course.modules.length ? course.modules : [emptyModule()]);
      if (course.image) {
        const img = typeof course.image === 'string' ? course.image : (course.image as any).path;
        setCourseImage(img || '');
      } else if (course.imageId) {
        setCourseImage('');
      } else {
        setCourseImage('');
      }
      setCourseImageId(course.imageId || null);
    } else if (open) {
      setTitle('');
      setDescription('');
      setAccessType('public');
      setAccessId('');
      setModules([emptyModule()]);
      setCourseImage('');
      setCourseImageId(null);
    }
  }, [course, open]);

  const handleModuleChange = (index: number, field: keyof ModuleForm, value: string) => {
    setModules((prev) => {
      const updated = [...prev];
      (updated[index] as any)[field] = value;
      return updated;
    });
  };

  const addModule = () => setModules((prev) => [...prev, emptyModule()]);
  const removeModule = (index: number) => setModules((prev) => prev.filter((_, i) => i !== index));

  const addLesson = (moduleIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setEditingLessonIndex(null);
    setEditingLesson(undefined);
    setOpenLessonDialog(true);
  };

  const editLesson = (moduleIndex: number, lessonIndex: number) => {
    const l = modules[moduleIndex].lessons[lessonIndex];
    setCurrentModuleIndex(moduleIndex);
    setEditingLessonIndex(lessonIndex);
    setEditingLesson(l);
    setOpenLessonDialog(true);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    setModules((prev) => {
      const updated = [...prev];
      updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
      return updated;
    });
  };

  const saveLesson = (data: LessonFormData) => {
    if (currentModuleIndex === null) return;
    setModules((prev) => {
      const updated = [...prev];
      const lessons = [...updated[currentModuleIndex].lessons];
      if (editingLessonIndex !== null) {
        lessons[editingLessonIndex] = { ...lessons[editingLessonIndex], ...data };
      } else {
        lessons.push(data as LessonForm);
      }
      updated[currentModuleIndex] = { ...updated[currentModuleIndex], lessons };
      return updated;
    });
    setOpenLessonDialog(false);
    setEditingLesson(undefined);
    setEditingLessonIndex(null);
    setCurrentModuleIndex(null);
  };

  const handleSave = () => {
    onSave({
      title,
      description,
      accessType,
      accessId,
      image: courseImage,
      imageId: courseImageId ?? undefined,
      modules
    });
  };

  return (
    <>
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
            <Stack direction="row" spacing={2} alignItems="center">
              <Button variant="outlined" component="label">
                Загрузить изображение
                <input type="file" hidden accept="image/*" onChange={(e) => setCourseImageFile(e.target.files?.[0] || null)} />
              </Button>
              {courseImageFile && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    if (!courseImageFile) return;
                    const formData = new FormData();
                    formData.append('file', courseImageFile);
                    try {
                      const res = await postData('uploadLogo', formData);
                      if (res && res.url) {
                        setCourseImage(res.url);
                        if (res.id) setCourseImageId(res.id);
                        setCourseImageFile(null);
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  Сохранить
                </Button>
              )}
              {courseImage && <img src={courseImage} alt="course" style={{ height: 40 }} />}
            </Stack>
            <FormControl>
              <InputLabel id="access-label">Права доступа</InputLabel>
              <Select
                labelId="access-label"
                value={accessType}
                label="Права доступа"
                onChange={(e) => setAccessType(e.target.value as any)}
              >
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
                    <Typography sx={{ flexGrow: 1 }}>{les.title || `Урок ${lesIndex + 1}`}</Typography>
                    <IconButton onClick={() => editLesson(modIndex, lesIndex)}>
                      <EditIcon />
                    </IconButton>
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
      <LessonFormDialog open={openLessonDialog} onClose={() => setOpenLessonDialog(false)} onSave={saveLesson} lesson={editingLesson} />
    </>
  );
};

export default CourseFormDialog;
