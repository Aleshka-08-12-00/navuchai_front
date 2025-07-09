import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from '@mui/material';
import JoditEditor from 'jodit-react';

export interface LessonFormData {
  id?: number;
  title: string;
  content?: string;
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
  const editor = useRef<any>(null);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setContent(lesson.content || '');
    } else if (open) {
      setTitle('');
      setContent('');
    }
  }, [lesson, open]);


  const handleSave = () => {
    onSave({ id: lesson?.id, title, content });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{lesson ? 'Редактировать урок' : 'Новый урок'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField fullWidth label="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
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
