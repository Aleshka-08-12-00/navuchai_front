import React, { useEffect, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getLessons } from '../../api';
import VideoPlayer from '../../components/VideoPlayer';

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
  onLessonComplete?: (lessonId: number, courseId: number) => void;
}

const LessonViewPage: React.FC<LessonViewPageProps> = ({
  courseId,
  moduleId,
  lessonId,
  onLessonChange,
  onLessonComplete
}) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const navigate = useNavigate();

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
      console.log('Текущий урок:', current);
      console.log('URL видео:', current.video);
      
      // Тестируем доступность YouTube
      const testIframe = document.createElement('iframe');
      testIframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      testIframe.style.display = 'none';
      document.body.appendChild(testIframe);
      
      setTimeout(() => {
        document.body.removeChild(testIframe);
        console.log('Тест iframe завершен');
      }, 1000);
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

  const handleComplete = () => {
    if (lesson && onLessonComplete && courseId) {
      onLessonComplete(lesson.id, courseId);
    }
  };

  return (
    <div>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>Назад</Button>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {lesson.title}
      </Typography>
      {lesson.video && (
        <VideoPlayer videoUrl={lesson.video} title={lesson.title} />
      )}
      <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      <Button variant="outlined" sx={{ mt: 2 }} onClick={handleComplete}>Отметить как пройдено</Button>
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
