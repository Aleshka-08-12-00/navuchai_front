import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { getModules, getLessons } from 'api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface Lesson {
  id: number;
  title: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

const ModulesPage = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        const m = await getModules(Number(courseId));
        const withLessons = await Promise.all(
          m.map(async (mod: any) => {
            try {
              const lessons = await getLessons(mod.id);
              return { ...mod, lessons };
            } catch (e) {
              console.error(e);
              return { ...mod, lessons: [] };
            }
          })
        );
        setModules(withLessons);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-4 hover:bg-white/50" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Назад
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Модули курса</h1>
        <div className="space-y-4">
          {modules.map((m) => (
            <Card key={m.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Модуль {m.id}: {m.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {m.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <span className="text-gray-800">{lesson.title}</span>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => navigate(`/courses/${courseId}/modules/${m.id}/lessons/${lesson.id}`)}
                    >
                      <Play className="h-4 w-4 mr-1" /> Начать
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;
