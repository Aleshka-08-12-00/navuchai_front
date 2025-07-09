import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { getLessons, postLesson, putLesson, deleteLesson } from 'api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Context } from '../..';
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Typography,
  Box,
  Stack,
  Button as MuiButton,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LessonFormDialog, { LessonFormData } from '../../components/LessonFormDialog';

interface Lesson {
  id: number;
  title: string;
  image?: string;
  completed?: boolean;
}

const LessonsPage = () => {
  const { moduleId, courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { authStore } = useContext(Context);
  const { roleCode } = authStore;
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonFormData | undefined>(undefined);

  const loadLessons = async () => {
    if (!moduleId) return;
    try {
      const data = await getLessons(Number(moduleId));
      setLessons(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadLessons();
  }, [moduleId]);

  const handleAddLesson = async () => {
    if (!moduleId) return;
    const title = window.prompt('Название урока');
    if (!title) return;
    try {
      await postLesson(Number(moduleId), { title });
      await loadLessons();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson({ id: lesson.id, title: lesson.title, content: (lesson as any).content || '' });
    setOpenLessonDialog(true);
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (!window.confirm('Удалить урок?')) return;
    try {
      await deleteLesson(lessonId);
      await loadLessons();
    } catch (e) {
      console.error(e);
    }
  };

  const saveLesson = async (data: LessonFormData) => {
    if (!moduleId) return;
    try {
      const payload = { title: data.title, content: data.content };
      if (data.id) {
        await putLesson(data.id, payload);
      } else {
        await postLesson(Number(moduleId), payload);
      }
      setOpenLessonDialog(false);
      setEditingLesson(undefined);
      await loadLessons();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <MuiCard sx={{ mb: 3, background: '#667eea', color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <MuiCardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button variant="ghost" size="sm" className="hover:bg-white/50" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Назад
                  </Button>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>Уроки</Typography>
                </Box>
                {roleCode === 'admin' && (
                  <Stack direction="row" spacing={2}>
                    <MuiButton
                      variant="contained"
                      sx={{
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #4caf50, #45a049)',
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #45a049, #4caf50)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                        }
                      }}
                      startIcon={<AddIcon />}
                      onClick={handleAddLesson}
                    >
                      Новый урок
                    </MuiButton>
                  </Stack>
                )}
              </Box>
            </MuiCardContent>
          </MuiCard>
        </Box>
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold text-gray-800">{lesson.title}</CardTitle>
                {roleCode === 'admin' && (
                  <div className="flex gap-1">
                    <IconButton size="small" onClick={() => handleEditLesson(lesson)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteLesson(lesson.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant={lesson.completed ? 'outline' : 'default'}
                  onClick={() =>
                    navigate(
                      `/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`
                    )
                  }
                >
                  <Play className="h-4 w-4 mr-2" /> {lesson.completed ? 'Повторить' : 'Начать'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <LessonFormDialog
        open={openLessonDialog}
        onClose={() => setOpenLessonDialog(false)}
        onSave={saveLesson}
        lesson={editingLesson}
      />
    </div>
  );
};

export default LessonsPage;
