import React, { useEffect, useState } from 'react';
import { Button, Stack, Typography, Box } from '@mui/material';
import { getLessons, getCourse } from 'api';

interface Lesson {
  id: number;
  title: string;
  content: string;
  video?: string;
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
  const [courseInfo, setCourseInfo] = useState<{title: string; description?: string} | null>(null);

  useEffect(() => {
    if (!moduleId) return;
    (async () => {
      const allLessons = await getLessons(Number(moduleId));
      setLessons(allLessons);
    })();
  }, [moduleId]);

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        const data = await getCourse(courseId);
        setCourseInfo({ title: data.title, description: data.description });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [courseId]);

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
        {courseInfo && (
          <>
            <Typography variant="h4" sx={{ mb: 2 }}>{courseInfo.title}</Typography>
            {courseInfo.description && (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{courseInfo.description}</Typography>
            )}
          </>
        )}
        {!courseInfo && (
          <Typography variant="h6" color="text.secondary">Выберите урок для просмотра</Typography>
        )}
      </div>
    );
  }

  const index = lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessons[index - 1];
  const nextLesson = lessons[index + 1];
  const progress = lessons.length ? Math.round(((index + 1) / lessons.length) * 100) : 0;

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

  const getEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:.*v=|embed\/)|youtu\.be\/)([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {lesson.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Прогресс: {progress}%
      </Typography>
      {lesson.video && (
        <Box sx={{ mb: 2 }}>
          <iframe
            width="100%"
            height="400"
            src={getEmbedUrl(lesson.video)}
            title="Видео урока"
            allowFullScreen
          />
        </Box>
      )}
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
