import React, { useEffect, useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import { getCourses, getModules, getLessons } from 'api';

interface Lesson {
  id: number;
  title: string;
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

  useEffect(() => {
    (async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (e) {
        console.error(e);
      }
    })();
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
      <List>
        {courses.map((course) => (
          <React.Fragment key={course.id}>
            <ListItemButton onClick={() => toggleCourse(course.id)}>
              <ListItemText primary={course.title} />
              {course.open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={course.open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                {course.modules?.map((mod) => (
                  <React.Fragment key={mod.id}>
                    <ListItemButton onClick={() => toggleModule(course.id, mod.id)} sx={{ pl: 2 }}>
                      <ListItemText primary={mod.title} />
                      {mod.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={mod.open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ pl: 4 }}>
                        {mod.lessons?.map((lesson) => (
                          <ListItemButton
                            key={lesson.id}
                            sx={{ pl: 4 }}
                            onClick={() => handleLessonClick(course.id, mod.id, lesson.id)}
                          >
                            <ListItemText primary={lesson.title} />
                          </ListItemButton>
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
    </div>
  );
};

export default CoursesPage;
