import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { getModules, postModule, postLesson, putLesson, getCourse } from 'api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Context } from '../..';
import { Card as MuiCard, CardContent as MuiCardContent, Typography, Box, Stack, Button as MuiButton, LinearProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LessonFormDialog, { LessonFormData } from '../../components/LessonFormDialog';

interface Lesson {
  id: number;
  title: string;
  content?: string;
  video?: string;
  image?: string;
  imageId?: number;
  completed?: boolean;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
  progress?: number;
  completedLessons?: any[];
}

interface Course {
  id: number;
  title: string;
  description?: string;
  image?: { path?: string } | string | null;
  progress?: number;
}

const ModulesPage = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { authStore } = useContext(Context);
  const { roleCode } = authStore;

  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<LessonFormData | undefined>(undefined);

  const loadModules = async () => {
    if (!courseId) return;
    try {
      const m = await getModules(Number(courseId));
      const modulesArray = Array.isArray(m) ? m : m.modules || m.items || [];
      const withLessons = modulesArray.map((mod: any) => {
        const lessonsRaw = Array.isArray(mod.lessons) ? mod.lessons : mod.lessons?.items || [];
        const lessonsArray = lessonsRaw.map((l: any) => ({
          ...l,
          imageId: l.img_id || null,
          image: typeof l.image === 'string' ? l.image : l.image?.path,
          completed: l.completed ?? l.done ?? l.is_completed ?? false
        }));
        let progress = 0;
        let completedLessons: any[] = [];
        if (roleCode !== 'admin') {
          completedLessons = lessonsArray.filter((l: any) => l.completed).map((l: any) => l.id);
          progress = lessonsArray.length > 0 ? Math.round((completedLessons.length / lessonsArray.length) * 100) : 0;
        }
        return { ...mod, lessons: lessonsArray, progress, completedLessons };
      });
      setModules(withLessons);
    } catch (e: any) {
      if (e?.response?.status === 403) {
        setAccessDenied(true);
      }
      console.error(e);
    }
  };

  const loadCourse = async () => {
    if (!courseId) return;
    try {
      const c = await getCourse(Number(courseId));
      const image = typeof c.image === 'string' ? c.image : c.image?.path || null;
      const progress = typeof c.progress === 'object' ? c.progress?.percent ?? 0 : c.progress ?? c.percent ?? 0;
      setCourse({ ...c, image, progress });
    } catch (e: any) {
      if (e?.response?.status === 403) {
        setAccessDenied(true);
      }
      console.error(e);
    }
  };

  useEffect(() => {
    if (location.state && (location.state as any).course) {
      setCourse((location.state as any).course);
    }
    loadCourse();
    loadModules();
  }, [courseId]);

  const handleAddModule = async () => {
    const title = window.prompt('Название модуля');
    if (!title || !courseId) return;
    try {
      await postModule(Number(courseId), { title });
      await loadModules();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddLesson = (moduleId: number) => {
    setCurrentModuleId(moduleId);
    setEditingLesson(undefined);
    setOpenLessonDialog(true);
  };

  const handleEditLesson = (moduleId: number, lesson: Lesson) => {
    setCurrentModuleId(moduleId);
    setEditingLesson({
      id: lesson.id,
      title: lesson.title,
      content: (lesson as any).content || '',
      video: (lesson as any).video || '',
      image: (lesson as any).image,
      imageId: (lesson as any).img_id || lesson.imageId
    });
    setOpenLessonDialog(true);
  };

  const saveLesson = async (data: LessonFormData) => {
    if (!currentModuleId) return;
    try {
      const payload = {
        title: data.title,
        content: data.content,
        video: data.video,
        imgId: data.imageId
      };
      if (data.id) {
        await putLesson(data.id, payload);
      } else {
        await postLesson(currentModuleId, payload);
      }
      setOpenLessonDialog(false);
      setEditingLesson(undefined);
      await loadModules();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            <MuiCard sx={{ mb: 3, background: '#667eea', color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <MuiCardContent sx={{ p: 4 }}>
                {course?.image && (
                  <img
                    src={course.image as string}
                    alt={course.title}
                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover', marginBottom: 16 }}
                  />
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link to="/courses">
                      <Button variant="ghost" size="sm" className="hover:bg-white/50">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Назад
                      </Button>
                    </Link>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {course?.title || 'Модули курса'}
                    </Typography>
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
                        onClick={handleAddModule}
                      >
                        Новый модуль
                      </MuiButton>
                    </Stack>
                  )}
                </Box>
                {roleCode !== 'admin' && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress variant="determinate" value={course?.progress ?? 0} />
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {course?.progress ?? 0}% пройдено
                    </Typography>
                  </Box>
                )}
              </MuiCardContent>
            </MuiCard>
          </Box>
          <div className="space-y-4">
            {accessDenied && (
              <Typography className="text-red-600">
                Нет доступа к курсу, запросите доступ у администратора
              </Typography>
            )}
            {modules.length === 0 && !accessDenied && (
              <Typography className="text-gray-600">Модули не найдены</Typography>
            )}
            {modules.map((m) => (
              <Card key={m.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">{m.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {m.lessons.map((lesson) => {
                    const completed = !!(lesson as any).completed;
                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        <span
                          className="text-gray-800"
                          onClick={() => roleCode === 'admin' && handleEditLesson(m.id, lesson)}
                          style={{ cursor: roleCode === 'admin' ? 'pointer' : 'default' }}
                        >
                          {lesson.title}
                        </span>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => navigate(`/courses/${courseId}/modules/${m.id}/lessons/${lesson.id}`)}
                        >
                          <Play className="h-4 w-4 mr-1" /> {completed ? 'Повторить' : 'Начать'}
                        </Button>
                      </div>
                    );
                  })}
                  {roleCode === 'admin' && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAddLesson(m.id)}>
                      <AddIcon className="h-4 w-4 mr-1" /> Добавить урок
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <LessonFormDialog open={openLessonDialog} onClose={() => setOpenLessonDialog(false)} onSave={saveLesson} lesson={editingLesson} />
    </>
  );
};

export default ModulesPage;
