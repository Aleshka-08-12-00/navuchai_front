import React, { useEffect, useState, useRef } from 'react'
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
  Grid
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
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
  deleteLesson
} from 'api'
import JoditEditor from 'jodit-react'
import MainCard from '../../components/MainCard'
import LessonsPage from '../lessons-page/LessonsPage'
import LessonViewPage from '../lessons-page/LessonViewPage'

interface Lesson {
  id: number
  title: string
  content?: string
  video?: string
}

interface Module {
  id: number
  title: string
  lessons?: Lesson[]
  open?: boolean
}

interface Course {
  id: number
  title: string
  modules?: Module[]
  open?: boolean
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const navigate = useNavigate()
  const [openCourseDialog, setOpenCourseDialog] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null)
  const [courseTitle, setCourseTitle] = useState('')

  const [openModuleDialog, setOpenModuleDialog] = useState(false)
  const [moduleCourseId, setModuleCourseId] = useState<number | null>(null)
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null)
  const [moduleTitle, setModuleTitle] = useState('')

  const [openLessonDialog, setOpenLessonDialog] = useState(false)
  const [lessonCourseId, setLessonCourseId] = useState<number | null>(null)
  const [lessonModuleId, setLessonModuleId] = useState<number | null>(null)
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null)
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonContent, setLessonContent] = useState('')
  const [lessonVideo, setLessonVideo] = useState('')
  const editor = useRef(null)

  // Состояние для выбранного урока
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(undefined)
  const [selectedModuleId, setSelectedModuleId] = useState<number | undefined>(undefined)
  const [selectedLessonId, setSelectedLessonId] = useState<number | undefined>(undefined)

  const loadCourses = async () => {
    try {
      const data = await getCourses()
      setCourses(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const toggleCourse = async (courseId: number) => {
    const course = courses.find(c => c.id === courseId)
    if (!course) return
    if (!course.modules) {
      try {
        const modulesData = await getModules(courseId)
        setCourses(prev =>
          prev.map(c =>
            c.id === courseId ? { ...c, modules: modulesData, open: !c.open } : c
          )
        )
      } catch (e) {
        console.error(e)
      }
    } else {
      setCourses(prev =>
        prev.map(c =>
          c.id === courseId ? { ...c, open: !c.open } : c
        )
      )
    }
  }

  const toggleModule = async (courseId: number, moduleId: number) => {
    const course = courses.find(c => c.id === courseId)
    if (!course || !course.modules) return
    const mod = course.modules.find(m => m.id === moduleId)
    if (!mod) return
    if (!mod.lessons) {
      try {
        const lessonsData = await getLessons(moduleId)
        setCourses(prev =>
          prev.map(c =>
            c.id === courseId
              ? {
                ...c,
                modules: c.modules?.map(m =>
                  m.id === moduleId ? { ...m, lessons: lessonsData, open: !m.open } : m
                )
              }
              : c
          )
        )
      } catch (e) {
        console.error(e)
      }
    } else {
      setCourses(prev =>
        prev.map(c =>
          c.id === courseId
            ? {
              ...c,
              modules: c.modules?.map(m =>
                m.id === moduleId ? { ...m, open: !m.open } : m
              )
            }
            : c
        )
      )
    }
  }

  const handleAddCourse = () => {
    setEditingCourseId(null)
    setCourseTitle('')
    setOpenCourseDialog(true)
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourseId(course.id)
    setCourseTitle(course.title)
    setOpenCourseDialog(true)
  }

  const saveCourse = async () => {
    try {
      if (editingCourseId) {
        await putCourse(editingCourseId, { title: courseTitle })
      } else {
        await postCourse({ title: courseTitle })
      }
      setOpenCourseDialog(false)
      setCourseTitle('')
      setEditingCourseId(null)
      await loadCourses()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm('Удалить курс?')) return
    try {
      await deleteCourse(id)
      await loadCourses()
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddModule = (courseId: number) => {
    setModuleCourseId(courseId)
    setEditingModuleId(null)
    setModuleTitle('')
    setOpenModuleDialog(true)
  }

  const handleEditModule = (courseId: number, module: Module) => {
    setModuleCourseId(courseId)
    setEditingModuleId(module.id)
    setModuleTitle(module.title)
    setOpenModuleDialog(true)
  }

  const saveModule = async () => {
    if (!moduleCourseId) return
    try {
      if (editingModuleId) {
        await putModule(editingModuleId, { title: moduleTitle, course_id: moduleCourseId })
      } else {
        await postModule(moduleCourseId, { title: moduleTitle })
      }
      setOpenModuleDialog(false)
      const modulesData = await getModules(moduleCourseId)
      setCourses(prev =>
        prev.map(c => (c.id === moduleCourseId ? { ...c, modules: modulesData } : c))
      )
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteModule = async (courseId: number, id: number) => {
    if (!window.confirm('Удалить модуль?')) return
    try {
      await deleteModule(id)
      const modulesData = await getModules(courseId)
      setCourses(prev =>
        prev.map(c => (c.id === courseId ? { ...c, modules: modulesData } : c))
      )
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddLesson = (courseId: number, moduleId: number) => {
    setLessonCourseId(courseId)
    setLessonModuleId(moduleId)
    setEditingLessonId(null)
    setLessonTitle('')
    setLessonContent('')
    setLessonVideo('')
    setOpenLessonDialog(true)
  }

  const handleEditLesson = (courseId: number, moduleId: number, lesson: Lesson) => {
    setLessonCourseId(courseId)
    setLessonModuleId(moduleId)
    setEditingLessonId(lesson.id)
    setLessonTitle(lesson.title)
    setLessonContent(lesson.content || '')
    setLessonVideo(lesson.video || '')
    setOpenLessonDialog(true)
  }

  const handleLessonDialogClose = () => {
    setOpenLessonDialog(false)
    setEditingLessonId(null)
    setLessonTitle('')
    setLessonContent('')
    setLessonVideo('')
  }

  const saveLesson = async () => {
    if (!lessonModuleId) return
    try {
      const payload = { title: lessonTitle, content: lessonContent, video: lessonVideo, module_id: lessonModuleId }
      if (editingLessonId) {
        await putLesson(editingLessonId, payload)
      } else {
        await postLesson(lessonModuleId, payload)
      }
      setOpenLessonDialog(false)
      setLessonVideo('')
      const lessonsData = await getLessons(lessonModuleId)
      setCourses(prev =>
        prev.map(c =>
          c.id === lessonCourseId
            ? {
              ...c,
              modules: c.modules?.map(m =>
                m.id === lessonModuleId ? { ...m, lessons: lessonsData } : m
              )
            }
            : c
        )
      )
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteLesson = async (courseId: number, moduleId: number, id: number) => {
    if (!window.confirm('Удалить урок?')) return
    try {
      await deleteLesson(id)
      const lessonsData = await getLessons(moduleId)
      setCourses(prev =>
        prev.map(c =>
          c.id === courseId
            ? {
              ...c,
              modules: c.modules?.map(m =>
                m.id === moduleId ? { ...m, lessons: lessonsData } : m
              )
            }
            : c
        )
      )
    } catch (e) {
      console.error(e)
    }
  }

  const handleLessonClick = (courseId: number, moduleId: number, lessonId: number) => {
    setSelectedCourseId(courseId)
    setSelectedModuleId(moduleId)
    setSelectedLessonId(lessonId)
  }

  const handleLessonChange = (courseId: number, moduleId: number, lessonId: number) => {
    setSelectedCourseId(courseId)
    setSelectedModuleId(moduleId)
    setSelectedLessonId(lessonId)
  }

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>Курсы</Typography>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant='outlined' color="success" startIcon={<AddIcon />} onClick={handleAddCourse}>Добавить курс</Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <MainCard>
            <List>
              {courses.map(course => (
                <React.Fragment key={course.id}>
                  <ListItem
                    secondaryAction={
                      <>
                        <IconButton edge="end" color="success" onClick={() => handleAddModule(course.id)}><AddIcon style={{ width: 15, height: 15}} /></IconButton>
                        <IconButton edge="end" onClick={() => handleEditCourse(course)}><EditIcon style={{ width: 15, height: 15}} /></IconButton>
                        <IconButton edge="end" color="error" onClick={() => handleDeleteCourse(course.id)}><DeleteIcon style={{ width: 15, height: 15}} /></IconButton>
                      </>
                    }
                    disablePadding
                  >
                    <ListItemButton onClick={() => toggleCourse(course.id)}>
                      <ListItemIcon sx={{ minWidth: 28 }}>{course.open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
                      <ListItemText primary={course.title} />
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={course.open} timeout="auto" unmountOnExit>

                    <List component="div" disablePadding sx={{ pl: 4 }}>
                      {course.modules?.map(mod => (
                        <React.Fragment key={mod.id}>
                          <ListItem
                            secondaryAction={
                              <>
                              <IconButton edge="end" color="success" onClick={() => handleAddLesson(course.id, mod.id)}><AddIcon style={{ width: 15, height: 15}} /></IconButton>
                              <IconButton edge="end" onClick={() => handleEditModule(course.id, mod)}><EditIcon style={{ width: 15, height: 15}} /></IconButton>
                              <IconButton edge="end" color="error" onClick={() => handleDeleteModule(course.id, mod.id)}><DeleteIcon style={{ width: 15, height: 15}} /></IconButton>
                                
                              </>
                            }
                            disablePadding
                          >
                            <ListItemButton onClick={() => toggleModule(course.id, mod.id)} sx={{ pl: 2 }}>
                              <ListItemIcon sx={{ minWidth: 28 }}>{mod.open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
                              <ListItemText primary={mod.title} />
                            </ListItemButton>
                          </ListItem>
                          <Collapse in={mod.open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                              {mod.lessons?.map(lesson => (
                                <ListItem
                                  key={lesson.id}
                                  secondaryAction={
                                    <>
                                      <IconButton edge="end" onClick={() => handleEditLesson(course.id, mod.id, lesson)}><EditIcon style={{ width: 15, height: 15}} /></IconButton>
                                      <IconButton edge="end" color="error" onClick={() => handleDeleteLesson(course.id, mod.id, lesson.id)}><DeleteIcon style={{ width: 15, height: 15}} /></IconButton>
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
          </MainCard>
        </Grid>
        <Grid item xs={8}>
          <MainCard>
            <LessonViewPage 
              courseId={selectedCourseId}
              moduleId={selectedModuleId}
              lessonId={selectedLessonId}
              onLessonChange={handleLessonChange}
            />
          </MainCard>
        </Grid>
      </Grid>

      <Dialog open={openCourseDialog} onClose={() => setOpenCourseDialog(false)}>
        <DialogTitle>{editingCourseId ? 'Редактировать курс' : 'Новый курс'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Название" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCourseDialog(false)}>Отмена</Button>
          <Button onClick={saveCourse} variant="contained" color="success">Сохранить</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openModuleDialog} onClose={() => setOpenModuleDialog(false)}>
        <DialogTitle>{editingModuleId ? 'Редактировать модуль' : 'Новый модуль'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Название" value={moduleTitle} onChange={e => setModuleTitle(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModuleDialog(false)}>Отмена</Button>
          <Button onClick={saveModule} variant="contained" color="success">Сохранить</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openLessonDialog} onClose={handleLessonDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingLessonId ? 'Редактировать урок' : 'Новый урок'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Название" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} />
            <TextField label="Ссылка на видео" value={lessonVideo} onChange={e => setLessonVideo(e.target.value)} />
            <JoditEditor ref={editor} value={lessonContent} onBlur={setLessonContent} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLessonDialogClose}>Отмена</Button>
          <Button onClick={saveLesson} variant="contained" color="success">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CoursesPage
