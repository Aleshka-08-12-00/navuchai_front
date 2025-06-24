import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { getLessons } from 'api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface Lesson {
  id: number;
  title: string;
  image?: string;
}

const LessonsPage = () => {
  const { moduleId, courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!moduleId) return;
    (async () => {
      try {
        const data = await getLessons(Number(moduleId));
        setLessons(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [moduleId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-4 hover:bg-white/50" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Назад
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Уроки</h1>
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                {lesson.image && <img src={lesson.image} alt={lesson.title} className="w-full h-48 object-cover rounded-t" />}
                <CardTitle className="text-xl font-semibold text-gray-800">{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}`)}
                >
                  <Play className="h-4 w-4 mr-2" /> Начать урок
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;
