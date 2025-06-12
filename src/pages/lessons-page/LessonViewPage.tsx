import React, { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { getLessons } from 'api';

interface Lesson {
  id: number;
  title: string;
  content: string;
}

interface LessonViewPageProps {
  courseId?: number;
  moduleId?: number;
  lessonId?: number;
  onLessonChange?: (courseId: number, moduleId: number, lessonId: number) => void;
}

const LessonViewPage: React.FC<LessonViewPageProps> = ({ 
  courseId, 
  moduleId, 
  lessonId, 
  onLessonChange 
}) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!moduleId) return;
    (async () => {
      const allLessons = await getLessons(Number(moduleId));
      setLessons(allLessons);
    })();
  }, [moduleId]);

  useEffect(() => {
    if (!lessonId) return;
    const current = lessons.find((l) => l.id === Number(lessonId));
    if (current) {
      setLesson(current);
    }
  }, [lessonId, lessons]);

  if (!lesson) {
    return (
      <div>
        <Typography variant="h6" color="text.secondary">
          Выберите урок для просмотра
        </Typography>
      </div>
    );
  }

  const index = lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessons[index - 1];
  const nextLesson = lessons[index + 1];

  const handlePrevLesson = () => {
    if (prevLesson && courseId && moduleId && onLessonChange) {
      onLessonChange(courseId, moduleId, prevLesson.id);
    }
  };

  const handleNextLesson = () => {
    if (nextLesson && courseId && moduleId && onLessonChange) {
      onLessonChange(courseId, moduleId, nextLesson.id);
    }
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {lesson.title}
      </Typography>
      <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
        <Button
          disabled={!prevLesson}
          onClick={handlePrevLesson}
        >
          Предыдущий
        </Button>
        <Button
          disabled={!nextLesson}
          onClick={handleNextLesson}
        >
          Следующий
        </Button>
      </Stack>
    </div>
  );
};

export default LessonViewPage;
