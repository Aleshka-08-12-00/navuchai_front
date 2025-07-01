import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { getLessons, completeLesson } from '../../api';
import VideoPlayer from '../../components/VideoPlayer';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface Lesson {
  id: number;
  title: string;
  content: string;
  video?: string;
  image?: string;
}

const LessonViewPage = () => {
  const { lessonId, moduleId, courseId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!lessonId) return;
    (async () => {
      try {
        await completeLesson(Number(lessonId));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [lessonId]);

  useEffect(() => {
    if (!moduleId) return;
    (async () => {
      try {
        const all = await getLessons(Number(moduleId));
        setLessons(all);
      } catch (e) {
        console.error(e);
      }
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
    return null;
  }

  const index = lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessons[index - 1];
  const nextLesson = lessons[index + 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 hover:bg-white/50"
          onClick={() =>
            navigate(`/courses/${courseId}/modules/${moduleId}/lessons`)
          }
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> К урокам
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{lesson.title}</h1>
        {lesson.image && <img src={lesson.image} alt={lesson.title} className="mb-4 w-full max-h-96 object-cover" />}
        {lesson.video && <VideoPlayer videoUrl={lesson.video} title={lesson.title} />}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Материалы урока</CardTitle>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </CardContent>
        </Card>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            disabled={!prevLesson}
            onClick={() => prevLesson && navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${prevLesson.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Предыдущий
          </Button>
          <Button
            variant="outline"
            disabled={!nextLesson}
            onClick={() => nextLesson && navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}`)}
          >
            Следующий <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="mt-6 text-right">
          <Button variant="default" onClick={() => navigate(-1)}>
            <CheckCircle className="h-4 w-4 mr-2" /> Завершить урок
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewPage;
