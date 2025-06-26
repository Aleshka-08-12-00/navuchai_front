import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import JoditEditor from 'jodit-react';
import { postData } from '../api';

export interface LessonFormData {
  id?: number;
  title: string;
  content?: string;
  video?: string;
  image?: string;
  imageId?: number;
}

interface LessonFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: LessonFormData) => void;
  lesson?: LessonFormData;
}

const LessonFormDialog: React.FC<LessonFormDialogProps> = ({ open, onClose, onSave, lesson }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [video, setVideo] = useState('');
  const [image, setImage] = useState<string>('');
  const [imageId, setImageId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const editor = useRef<any>(null);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setContent(lesson.content || '');
      setVideo(lesson.video || '');
      setImage(lesson.image || '');
      setImageId(lesson.imageId ?? null);
    } else if (open) {
      setTitle('');
      setContent('');
      setVideo('');
      setImage('');
      setImageId(null);
      setImageFile(null);
    }
  }, [lesson, open]);

  const handleUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('file', imageFile);
    try {
      const res = await postData('uploadLogo', formData);
      if (res && res.url) {
        setImage(res.url);
        if (res.id) setImageId(res.id);
        setImageFile(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = () => {
    onSave({ id: lesson?.id, title, content, video, image, imageId: imageId ?? undefined });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{lesson ? 'Редактировать урок' : 'Новый урок'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField fullWidth label="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField fullWidth label="Ссылка на видео" value={video} onChange={(e) => setVideo(e.target.value)} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="outlined" component="label" size="small">
              Картинка
              <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </Button>
            {imageFile && (
              <Button variant="contained" color="primary" onClick={handleUpload}>
                Загрузить
              </Button>
            )}
            {image && <img src={image} alt="lesson" style={{ height: 40 }} />}
            {image && (
              <IconButton onClick={() => setImage('')} size="small">
                <DeleteIcon />
              </IconButton>
            )}
          </Stack>
          <JoditEditor ref={editor} value={content} onBlur={(newContent) => setContent(newContent)} />
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

export default LessonFormDialog;
