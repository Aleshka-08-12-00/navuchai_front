import React, { useEffect, useState, useRef } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
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
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
} from 'api';
import JoditEditor from 'jodit-react';

interface Lesson {
  id: number;
  title: string;
  content?: string;
}

interface Module {
  id: number;
  title: string;
  lessons?: Lesson[];
  open?: boolean;
}

interface Course {
  id: number;
  title: string;
  modules?: Module[];
  open?: boolean;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [courseTitle, setCourseTitle] = useState('');

  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [moduleCourseId, setModuleCourseId] = useState<number | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');

  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [lessonCourseId, setLessonCourseId] = useState<number | null>(null);
  const [lessonModuleId, setLessonModuleId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const editor = useRef(null);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
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

    if (!course.modules) {
      try {
        const modulesData = await getModules(courseId);
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId ? { ...c, modules: modulesData, open: !c.open } : c
          )
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, open: !c.open } : c
        )
      );
    }
  };

  const toggleModule = async (courseId: number, moduleId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course || !course.modules) return;

    const module = course.modules.find((m) => m.id === moduleId);
    if (!module) return;

    if (!module.lessons) {
      try {
        const lessonsData = await getLessons(moduleId);
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  modules: c.modules?.map((m) =>
                    m.id === moduleId ? { ...m, lessons: lessonsData, open: !m.open } : m
                  ),
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
                modules: c.modules?.map((m) =>
                  m.id === moduleId ? { ...m, open: !m.open } : m
                ),
              }
            : c
        )
      );
    }
  };

  const handleAddCourse = () => {
    setEditingCourseId(null);
    setCourseTitle('');
    setOpenCourseDialog(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setOpenCourseDialog(true);
  };

  const saveCourse = async () => {
    try {
      if (editingCourseId) {
        await putCourse(editingCourseId, { title: courseTitle });
      } else {
        await postCourse({ title: courseTitle });
      }
      setOpenCourseDialog(false);
      setCourseTitle('');
      setEditingCourseId(null);
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

  const handleAddModule = (courseId: number) => {
    setModuleCourseId(courseId);
    setEditingModuleId(null);
    setModuleTitle('');
    setOpenModuleDialog(true);
  };

  const handleEditModule = (courseId: number, module: Module) => {
    setModuleCourseId(courseId);
    setEditingModuleId(module.id);
    setModuleTitle(module.title);
    setOpenModuleDialog(true);
  };

  const saveModule = async () => {
    if (!moduleCourseId) return;
    try {
      if (editingModuleId) {
        await putModule(editingModuleId, { title: moduleTitle, course_id: moduleCourseId });
      } else {
        await postModule(moduleCourseId, { title: moduleTitle });
      }
      setOpenModuleDialog(false);
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
    setOpenLessonDialog(true);
  };

  const handleEditLesson = (courseId: number, moduleId: number, lesson: Lesson) => {
    setLessonCourseId(courseId);
    setLessonModuleId(moduleId);
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonContent(lesson.content || '');
    setOpenLessonDialog(true);
  };

  const saveLesson = async () => {
    if (!lessonModuleId) return;
    try {
      if (editingLessonId) {
        await putLesson(editingLessonId, { title: lessonTitle, content: lessonContent, module_id: lessonModuleId });
      } else {
        await postLesson(lessonModuleId, { title: lessonTitle, content: lessonContent });
      }
      setOpenLessonDialog(false);
      const lessonsData = await getLessons(lessonModuleId);
      setCourses((prev) =>
        prev.map((c) =>
          c.id === lessonCourseId
            ? {
                ...c,
                modules: c.modules?.map((m) => (m.id === lessonModuleId ? { ...m, lessons: lessonsData } : m)),
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
                modules: c.modules?.map((m) => (m.id === moduleId ? { ...m, lessons: lessonsData } : m)),
              }
            : c
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleLessonClick = (
    courseId: number,
    moduleId: number,
    lessonId: number
  ) => {
    navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Курсы
      </Typography>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAddCourse}>
          Добавить курс
        </Button>
      </Stack>
      <List>
        {courses.map((course) => (
          <React.Fragment key={course.id}>
            <ListItem
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => handleEditCourse(course)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" color="error" onClick={() => handleDeleteCourse(course.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
              disablePadding
            >
              <ListItemButton onClick={() => toggleCourse(course.id)}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {course.open ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>
                <ListItemText primary={course.title} />
              </ListItemButton>
            </ListItem>
            <Collapse in={course.open} timeout="auto" unmountOnExit>
              <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1, pl: 4 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  sx={{ textTransform: 'none' }}
                  onClick={() => handleAddModule(course.id)}
                >
                  Добавить модуль
                </Button>
              </Stack>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                {course.modules?.map((mod) => (
                  <React.Fragment key={mod.id}>
                    <ListItem
                      secondaryAction={
                        <>
                          <IconButton edge="end" onClick={() => handleEditModule(course.id, mod)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton edge="end" color="error" onClick={() => handleDeleteModule(course.id, mod.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      }
                      disablePadding
                    >
                      <ListItemButton onClick={() => toggleModule(course.id, mod.id)} sx={{ pl: 2 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          {mod.open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemIcon>
                        <ListItemText primary={mod.title} />
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={mod.open} timeout="auto" unmountOnExit>
                      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1, pl: 6 }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<AddIcon />}
                          sx={{ textTransform: 'none' }}
                          onClick={() => handleAddLesson(course.id, mod.id)}
                        >
                          Добавить урок
                        </Button>
                      </Stack>
                      <List component="div" disablePadding sx={{ pl: 4 }}>
                        {mod.lessons?.map((lesson) => (
                          <ListItem
                            key={lesson.id}
                            secondaryAction={
                              <>
                                <IconButton edge="end" onClick={() => handleEditLesson(course.id, mod.id, lesson)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton edge="end" color="error" onClick={() => handleDeleteLesson(course.id, mod.id, lesson.id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </>
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
            </Collapse>
          </React.Fragment>
        ))}
      </List>

      <Dialog open={openCourseDialog} onClose={() => setOpenCourseDialog(false)}>
        <DialogTitle>{editingCourseId ? 'Редактировать курс' : 'Новый курс'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Название" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCourseDialog(false)}>Отмена</Button>
          <Button onClick={saveCourse} variant="contained" color="success">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModuleDialog} onClose={() => setOpenModuleDialog(false)}>
        <DialogTitle>{editingModuleId ? 'Редактировать модуль' : 'Новый модуль'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Название" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModuleDialog(false)}>Отмена</Button>
          <Button onClick={saveModule} variant="contained" color="success">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openLessonDialog} onClose={() => setOpenLessonDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingLessonId ? 'Редактировать урок' : 'Новый урок'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Название" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
            <JoditEditor ref={editor} value={lessonContent} onBlur={setLessonContent} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLessonDialog(false)}>Отмена</Button>
          <Button onClick={saveLesson} variant="contained" color="success">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CoursesPage;
