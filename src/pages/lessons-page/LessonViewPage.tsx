import React, { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getLessons, getLesson } from 'api';

interface Lesson {
  id: number;
  title: string;
  content: string;
}

const LessonViewPage = () => {
  const { lessonId, moduleId, courseId } = useParams();
  const navigate = useNavigate();
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
    (async () => {
      const data = await getLesson(Number(lessonId));
      setLesson(data);
    })();
  }, [lessonId]);

  if (!lesson) return null;

  const index = lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessons[index - 1];
  const nextLesson = lessons[index + 1];

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {lesson.title}
      </Typography>
      <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
        <Button
          disabled={!prevLesson}
          onClick={() =>
            prevLesson &&
            navigate(
              `/courses/${courseId}/modules/${moduleId}/lessons/${prevLesson.id}`
            )
          }
        >
          Предыдущий
        </Button>
        <Button
          disabled={!nextLesson}
          onClick={() =>
            nextLesson &&
            navigate(
              `/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}`
            )
          }
        >
          Следующий
        </Button>
      </Stack>
    </div>
  );
};

export default LessonViewPage;
