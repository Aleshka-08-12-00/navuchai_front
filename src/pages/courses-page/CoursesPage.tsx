import React, { useEffect, useState } from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCourses, getModules, getLessons } from 'api';

interface Lesson {
  id: number;
  title: string;
}
interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}
interface Course {
  id: number;
  title: string;
  modules: Module[];
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getCourses();
        const coursesWithModules: Course[] = await Promise.all(
          coursesData.map(async (course: any) => {
            const modulesData = await getModules(course.id);
            const modulesWithLessons: Module[] = await Promise.all(
              modulesData.map(async (mod: any) => ({
                ...mod,
                lessons: await getLessons(mod.id)
              }))
            );
            return { ...course, modules: modulesWithLessons };
          })
        );
        setCourses(coursesWithModules);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

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
      <TreeView>
        {courses.map((course) => (
          <TreeItem
            key={course.id}
            nodeId={`c-${course.id}`}
            label={course.title}
          >
            {course.modules.map((mod) => (
              <TreeItem
                key={mod.id}
                nodeId={`m-${mod.id}`}
                label={mod.title}
              >
                {mod.lessons.map((lesson) => (
                  <TreeItem
                    key={lesson.id}
                    nodeId={`l-${lesson.id}`}
                    label={lesson.title}
                    onClick={() =>
                      handleLessonClick(course.id, mod.id, lesson.id)
                    }
                  />
                ))}
              </TreeItem>
            ))}
          </TreeItem>
        ))}
      </TreeView>
    </div>
  );
};

export default CoursesPage;
