import React, { useEffect, useState, useRef } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Grid,
  Box,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useNavigate } from 'react-router-dom';
import {
  getCourses,
  getModules,
  getLessons,
  postCourse,
  putCourse,
  deleteCourse,
  postModule,
  putModule,
  deleteModule,
  postLesson,
  putLesson,
  deleteLesson,
  enrollCourse,
  getUserCourses,
  getCourseProgress,
  getCourseTests,
  getModuleProgress,
  getModuleTests,
  getLesson,

} from 'api';
import JoditEditor from 'jodit-react';
import MainCard from '../../components/MainCard';
import LessonsPage from '../lessons-page/LessonsPage';
import LessonViewPage from '../lessons-page/LessonViewPage';
import { Context } from '../..';
import CourseFormDialog, { CourseFormData } from '../../components/CourseFormDialog';

interface Lesson {
  id: number;
  title: string;
  content?: string;
  video?: string;
}

interface Module {
  id: number;
  title: string;
  description?: string;
  lessons?: Lesson[];
  open?: boolean;
  progress?: number;
  tests?: any[];
}

interface Course {
  id: number;
  title: string;
  description?: string;
  modules?: Module[];
  open?: boolean;
  hasAccess?: boolean;
  progress?: number;
  tests?: any[];
}

const CoursesPage = () => {
  const { authStore } = React.useContext(Context);
  const { roleCode, userId } = authStore;
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [courseFormData, setCourseFormData] = useState<CourseFormData | undefined>(undefined);

  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [moduleCourseId, setModuleCourseId] = useState<number | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');

  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [lessonCourseId, setLessonCourseId] = useState<number | null>(null);
  const [lessonModuleId, setLessonModuleId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonVideo, setLessonVideo] = useState('');
  const editor = useRef(null);

  const handleCreateTestForCourse = (courseId: number) => {
    navigate(`/main-page/new-test?course=${courseId}`);
  };

  const handleCreateTestForModule = (courseId: number, moduleId: number) => {
    navigate(`/main-page/new-test?course=${courseId}&module=${moduleId}`);
  };

  // Состояние для выбранного урока
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(undefined);
  const [selectedModuleId, setSelectedModuleId] = useState<number | undefined>(undefined);
  const [selectedLessonId, setSelectedLessonId] = useState<number | undefined>(undefined);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      let userCourses: number[] = [];
      if (userId) {
        try {
          const ucs = await getUserCourses(userId);
          userCourses = ucs.map((uc: any) => uc.course_id);
        } catch (e) {
          console.error(e);
        }
      }
      const coursesWithAccess = await Promise.all(
        data.map(async (c: Course) => {
          const hasAccess = userCourses.includes(c.id);
          let progress = 0;
          let tests: any[] = [];
          if (hasAccess) {
            try {
              const p = await getCourseProgress(c.id);
              progress = p.percent;
              tests = await getCourseTests(c.id);
            } catch (e) {
              console.error(e);
            }
          }
          return { ...c, hasAccess, progress, tests };
        })
      );
      setCourses(coursesWithAccess);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const toggleCourse = async (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;
    if (roleCode !== 'admin' && !course.hasAccess) {
      setSelectedCourseId(courseId);
      setSelectedModuleId(undefined);
      setSelectedLessonId(undefined);
      return;
    }
    if (!course.modules) {
      try {
        const modulesData = await getModules(courseId);
        const modulesWithInfo = await Promise.all(
          modulesData.map(async (m: Module) => {
            let progress = 0;
            let tests: any[] = [];
            if (course.hasAccess) {
              try {
                const mp = await getModuleProgress(m.id);
                progress = mp.percent;
                tests = await getModuleTests(m.id);
              } catch (e) {
                console.error(e);
              }
            }
            return { ...m, progress, tests };
          })
        );
        setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, modules: modulesWithInfo, open: !c.open } : c)));
      } catch (e) {
        console.error(e);
      }
    } else {
      setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, open: !c.open } : c)));
    }

    setSelectedCourseId(courseId);
    setSelectedModuleId(undefined);
    setSelectedLessonId(undefined);
  };

  const toggleModule = async (courseId: number, moduleId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course || !course.modules) return;
    const mod = course.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    if (!mod.lessons) {
      try {
        const lessonsData = await getLessons(moduleId);
        let progress = 0;
        let tests: any[] = [];
        if (course.hasAccess) {
          try {
            const p = await getModuleProgress(moduleId);
            progress = p.percent;
            tests = await getModuleTests(moduleId);
          } catch (e) {
            console.error(e);
          }
        }
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  modules: c.modules?.map((m) => (m.id === moduleId ? { ...m, lessons: lessonsData, progress, tests, open: !m.open } : m))
                }
              : c
          )
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      if (mod.progress === undefined || mod.tests === undefined) {
        try {
          let progress = 0;
          let tests: any[] = [];
          if (course.hasAccess) {
            const p = await getModuleProgress(moduleId);
            progress = p.percent;
            tests = await getModuleTests(moduleId);
          }
          setCourses((prev) =>
            prev.map((c) =>
              c.id === courseId
                ? {
                    ...c,
                    modules: c.modules?.map((m) => (m.id === moduleId ? { ...m, progress, tests, open: !m.open } : m))
                  }
                : c
            )
          );
        } catch (e) {
          console.error(e);
        }
      } else {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  modules: c.modules?.map((m) => (m.id === moduleId ? { ...m, open: !m.open } : m))
                }
              : c
          )
        );
      }
    }

    setSelectedCourseId(courseId);
    setSelectedModuleId(moduleId);
    setSelectedLessonId(undefined);
  };

  const handleAddCourse = () => {
    setEditingCourseId(null);
    setCourseFormData(undefined);
    setOpenCourseDialog(true);
  };

  const handleEditCourse = async (course: Course) => {
    setEditingCourseId(course.id);
    try {
      const modulesData = await getModules(course.id);
      const modulesWithLessons = await Promise.all(
        modulesData.map(async (m: Module) => {
          const lessonsData = await getLessons(m.id);
          return { ...m, lessons: lessonsData };
        })
      );
      const formData: CourseFormData = {
        title: course.title,
        description: course.description || '',
        accessType: 'public',
        modules: modulesWithLessons.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description || '',
          lessons: m.lessons?.map((l) => ({ id: l.id, title: l.title, content: l.content || '', video: l.video || '' })) || []
        }))
      };
      setCourseFormData(formData);
    } catch (e) {
      console.error(e);
      setCourseFormData({ title: course.title, description: course.description || '', accessType: 'public', modules: [] });
    }
    setOpenCourseDialog(true);
  };

  const saveCourse = async (data: CourseFormData) => {
    try {
      let id = editingCourseId;
      if (editingCourseId) {
        await putCourse(editingCourseId, { title: data.title, description: data.description });
      } else {
        const res = await postCourse({ title: data.title, description: data.description });
        id = res?.id;
      }
      if (!id) return;
      for (const mod of data.modules) {
        let modId = mod.id;
        if (modId) {
          await putModule(modId, { title: mod.title, description: mod.description });
        } else {
          const m = await postModule(id, { title: mod.title, description: mod.description });
          modId = m?.id;
        }
        if (!modId) continue;
        for (const les of mod.lessons) {
          if (les.id) {
            await putLesson(les.id, { title: les.title, content: les.content, video: les.video });
          } else {
            await postLesson(modId, { title: les.title, content: les.content, video: les.video });
          }
        }
      }
      setOpenCourseDialog(false);
      setEditingCourseId(null);
      setCourseFormData(undefined);
      await loadCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm('Удалить курс?')) return;
    try {
      await deleteCourse(id);
      await loadCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnrollCourse = async (id: number) => {
    try {
      await enrollCourse(id);
      await loadCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddModule = (courseId: number) => {
    setModuleCourseId(courseId);
    setEditingModuleId(null);
    setModuleTitle('');
    setModuleDescription('');
    setOpenModuleDialog(true);
  };

  const handleEditModule = (courseId: number, module: Module) => {
    setModuleCourseId(courseId);
    setEditingModuleId(module.id);
    setModuleTitle(module.title);
    setModuleDescription(module.description || '');
    setOpenModuleDialog(true);
  };

  const saveModule = async () => {
    if (!moduleCourseId) return;
    try {
      if (editingModuleId) {
        await putModule(editingModuleId, { title: moduleTitle, description: moduleDescription });
      } else {
        await postModule(moduleCourseId, { title: moduleTitle, description: moduleDescription });
      }
      setOpenModuleDialog(false);
      setModuleDescription('');
      const modulesData = await getModules(moduleCourseId);
      setCourses((prev) => prev.map((c) => (c.id === moduleCourseId ? { ...c, modules: modulesData } : c)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteModule = async (courseId: number, id: number) => {
    if (!window.confirm('Удалить модуль?')) return;
    try {
      await deleteModule(id);
      const modulesData = await getModules(courseId);
      setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, modules: modulesData } : c)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddLesson = (courseId: number, moduleId: number) => {
    setLessonCourseId(courseId);
    setLessonModuleId(moduleId);
    setEditingLessonId(null);
    setLessonTitle('');
    setLessonContent('');
    setLessonVideo('');
    setOpenLessonDialog(true);
  };

  const handleEditLesson = (courseId: number, moduleId: number, lesson: Lesson) => {
    setLessonCourseId(courseId);
    setLessonModuleId(moduleId);
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonContent(lesson.content || '');
    setLessonVideo(lesson.video || '');
    setOpenLessonDialog(true);
  };

  const handleLessonDialogClose = () => {
    setOpenLessonDialog(false);
    setEditingLessonId(null);
    setLessonTitle('');
    setLessonContent('');
    setLessonVideo('');
  };

  const saveLesson = async () => {
    if (!lessonModuleId) return;
    try {
      const payload = { title: lessonTitle, content: lessonContent, video: lessonVideo };
      if (editingLessonId) {
        await putLesson(editingLessonId, payload);
      } else {
        await postLesson(lessonModuleId, payload);
      }
      setOpenLessonDialog(false);
      setLessonVideo('');
      const lessonsData = await getLessons(lessonModuleId);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === lessonCourseId
            ? {
                ...c,
                modules: c.modules?.map((m) => (m.id === lessonModuleId ? { ...m, lessons: lessonsData } : m))
              }
            : c
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLesson = async (courseId: number, moduleId: number, id: number) => {
    if (!window.confirm('Удалить урок?')) return;
    try {
      await deleteLesson(id);
      const lessonsData = await getLessons(moduleId);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? {
                ...c,
                modules: c.modules?.map((m) => (m.id === moduleId ? { ...m, lessons: lessonsData } : m))
              }
            : c
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleLessonClick = (courseId: number, moduleId: number, lessonId: number) => {
    setSelectedCourseId(courseId);
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
  };

  const handleLessonChange = (courseId: number, moduleId: number, lessonId: number) => {
    setSelectedCourseId(courseId);
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
  };

  const handleLessonComplete = async (lessonId: number, courseId: number) => {
    try {
      await getLesson(lessonId);
      if (courseId === selectedCourseId) {
        await loadCourses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const selectedModule = selectedCourse?.modules?.find((m) => m.id === selectedModuleId);

  return (
    <Box
      sx={{
        flexGrow: 1,
        background: '#edf7ff',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Card
          sx={{
            mb: 3,
            background: ' #667eea',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Курсы
                </Typography>
                <Chip label={`${courses.length} курсов`} sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
              </Box>
              <Box sx={roleCode !== 'admin' ? { display: 'none' } : {}}>
                <Stack direction="row" spacing={2}>
                  <Button
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
                    onClick={handleAddCourse}
                  >
                    Новый курс
                  </Button>
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={5}>
            <MainCard>
              <List>
                {courses.map((course) => (
                  <React.Fragment key={course.id}>
                    <ListItem
                      secondaryAction={
                        roleCode === 'admin' && (
                          <>
                            <IconButton edge="end" color="success" onClick={() => handleAddModule(course.id)}>
                              <AddIcon style={{ width: 15, height: 15 }} />
                            </IconButton>
                            <IconButton edge="end" color="primary" onClick={() => handleCreateTestForCourse(course.id)}>
                              <LibraryBooksIcon style={{ width: 15, height: 15 }} />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleEditCourse(course)}>
                              <EditIcon style={{ width: 15, height: 15 }} />
                            </IconButton>
                            <IconButton edge="end" color="error" onClick={() => handleDeleteCourse(course.id)}>
                              <DeleteIcon style={{ width: 15, height: 15 }} />
                            </IconButton>
                          </>
                        )
                      }
                      disablePadding
                    >
                      <ListItemButton onClick={() => toggleCourse(course.id)} sx={{ py: 2 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>{course.open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
                        <ListItemText primary={course.title} />
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={course.open && (roleCode === 'admin' || course.hasAccess)} timeout="auto" unmountOnExit>
                      {roleCode !== 'admin' && !course.hasAccess ? (
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2">Доступ к курсу закрыт</Typography>
                        </Box>
                      ) : (
                        <List component="div" disablePadding sx={{ pl: 4 }}>
                          {course.modules?.map((mod) => (
                            <React.Fragment key={mod.id}>
                              <ListItem
                                secondaryAction={
                                  roleCode === 'admin' && (
                                    <>
                                      <IconButton edge="end" color="success" onClick={() => handleAddLesson(course.id, mod.id)}>
                                        <AddIcon style={{ width: 15, height: 15 }} />
                                      </IconButton>
                                      <IconButton edge="end" color="primary" onClick={() => handleCreateTestForModule(course.id, mod.id)}>
                                        <LibraryBooksIcon style={{ width: 15, height: 15 }} />
                                      </IconButton>
                                      <IconButton edge="end" onClick={() => handleEditModule(course.id, mod)}>
                                        <EditIcon style={{ width: 15, height: 15 }} />
                                      </IconButton>
                                      <IconButton edge="end" color="error" onClick={() => handleDeleteModule(course.id, mod.id)}>
                                        <DeleteIcon style={{ width: 15, height: 15 }} />
                                      </IconButton>
                                    </>
                                  )
                                }
                                disablePadding
                              >
                                <ListItemButton onClick={() => toggleModule(course.id, mod.id)} sx={{ pl: 2 }}>
                                  <ListItemIcon sx={{ minWidth: 28 }}>{mod.open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
                                  <ListItemText
                                    primary={mod.title}
                                    secondary={course.hasAccess ? `Прогресс: ${mod.progress ?? 0}%` : undefined}
                                  />
                                </ListItemButton>
                              </ListItem>
                              <Collapse in={mod.open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding sx={{ pl: 4 }}>
                                  {mod.lessons?.map((lesson) => (
                                    <ListItem
                                      key={lesson.id}
                                      secondaryAction={
                                        roleCode === 'admin' && (
                                          <>
                                            <IconButton edge="end" onClick={() => handleEditLesson(course.id, mod.id, lesson)}>
                                              <EditIcon style={{ width: 15, height: 15 }} />
                                            </IconButton>
                                            <IconButton
                                              edge="end"
                                              color="error"
                                              onClick={() => handleDeleteLesson(course.id, mod.id, lesson.id)}
                                            >
                                              <DeleteIcon style={{ width: 15, height: 15 }} />
                                            </IconButton>
                                          </>
                                        )
                                      }
                                      disablePadding
                                    >
                                      <ListItemButton sx={{ pl: 4 }} onClick={() => handleLessonClick(course.id, mod.id, lesson.id)}>
                                        <ListItemText primary={lesson.title} />
                                      </ListItemButton>
                                    </ListItem>
                                  ))}
                                </List>
                              </Collapse>
                            </React.Fragment>
                          ))}
                        </List>
                      )}
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>
            </MainCard>
          </Grid>
          <Grid item xs={7}>
            <MainCard>
              {selectedLessonId ? (
                <LessonViewPage
                  courseId={selectedCourseId}
                  moduleId={selectedModuleId}
                  lessonId={selectedLessonId}
                  onLessonChange={handleLessonChange}
                  onLessonComplete={handleLessonComplete}
                />
              ) : selectedModuleId ? (
                <Box>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    {selectedModule?.title}
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-line' }}>{selectedModule?.description}</Typography>
                  {selectedCourse?.hasAccess && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">Прогресс модуля: {selectedModule?.progress ?? 0}%</Typography>
                      {roleCode !== 'admin' &&
                        selectedModule?.progress === 100 &&
                        selectedModule?.tests &&
                        selectedModule.tests.length > 0 && (
                          <Button
                            variant="contained"
                            sx={{ mt: 1 }}
                            onClick={() => navigate(`/start_test/${selectedModule!.tests![0].id}`)}
                          >
                            Пройти тест
                          </Button>
                        )}
                    </Box>
                  )}
                </Box>
              ) : selectedCourseId ? (
                <Box>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    {selectedCourse?.title}
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-line', mb: 1 }}>{selectedCourse?.description}</Typography>
                  {roleCode !== 'admin' && !selectedCourse?.hasAccess && (
                    <Button variant="contained" onClick={() => handleEnrollCourse(selectedCourseId!)}>
                      Записаться
                    </Button>
                  )}
                  {selectedCourse?.hasAccess && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">Прогресс: {selectedCourse?.progress ?? 0}%</Typography>
                      {roleCode !== 'admin' && selectedCourse?.progress === 100 && (
                        <Button variant="contained" sx={{ mt: 1 }} onClick={() => navigate(`/start_test/${selectedCourse?.id}`)}>
                          Пройти тест
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="h6" color="text.secondary">
                  Выберите элемент
                </Typography>
              )}
            </MainCard>
          </Grid>
        </Grid>

        <CourseFormDialog open={openCourseDialog} onClose={() => setOpenCourseDialog(false)} onSave={saveCourse} course={courseFormData} />
        <Dialog open={openModuleDialog} onClose={() => setOpenModuleDialog(false)}>
          <DialogTitle>{editingModuleId ? 'Редактировать модуль' : 'Новый модуль'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField fullWidth label="Название" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
              <TextField
                fullWidth
                label="Описание"
                multiline
                minRows={3}
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModuleDialog(false)}>Отмена</Button>
            <Button onClick={saveModule} variant="contained" color="success">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openLessonDialog} onClose={handleLessonDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>{editingLessonId ? 'Редактировать урок' : 'Новый урок'}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField label="Название" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
              <JoditEditor ref={editor} value={lessonContent} onBlur={setLessonContent} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLessonDialogClose}>Отмена</Button>
            <Button onClick={saveLesson} variant="contained" color="success">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CoursesPage;
