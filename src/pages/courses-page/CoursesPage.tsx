import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, ArrowLeft, Play } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { getCourses } from '../../api';

interface Course {
  id: number;
  title: string;
  description: string;
  image?: string;
  duration?: string;
  students?: number;
  rating?: number;
  lessons?: number;
  category?: string;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const categories = ['Все'];
  const levels = ['Все уровни'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-4 hover:bg-white/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Курсы
            </h1>
            <p className="text-gray-600 mt-2">Выберите курс и начните обучение</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Категории</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Badge key={c} variant="secondary" className="cursor-pointer hover:bg-purple-100 transition-colors">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Уровень сложности</h3>
              <div className="flex flex-wrap gap-2">
                {levels.map((l) => (
                  <Badge key={l} variant="outline" className="cursor-pointer hover:bg-purple-50 transition-colors">
                    {l}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card
              key={course.id}
              className="flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <img src={course.image || 'https://via.placeholder.com/400x200'} alt={course.title} className="w-full h-48 object-cover" />
                {course.category && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">{course.category}</Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="text-gray-600 line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration || '-'}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.lessons ? `${course.lessons} уроков` : '-'}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students ?? 0} студентов
                  </div>
                  <div className="flex items-center text-yellow-600">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {course.rating ?? 0}
                  </div>
                </div>
                <Button
                  className="mt-auto w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate(`/courses/${course.id}/modules`)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Начать курс
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
