import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, ArrowLeft, Play } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  getCourses,
  postCourse,
  postModule,
  postLesson
} from '../../api';
import { Context } from '../..';
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Typography,
  Chip,
  Box,
  Stack,
  Button as MuiButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CourseFormDialog, { CourseFormData } from '../../components/CourseFormDialog';

interface Course {
  id: number;
  title: string;
  description: string;
  image?: string;
  img_id?: number;
  duration?: string;
  students?: number;
  rating?: number;
  lessons?: number;
  category?: string;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const { authStore } = useContext(Context);
  const { roleCode } = authStore;
  const [openCourseDialog, setOpenCourseDialog] = useState(false);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const saveCourse = async (data: CourseFormData) => {
    try {
      const res = await postCourse({
        title: data.title,
        description: data.description,
        accessType: data.accessType,
        accessId: data.accessId,
        img_id: data.imageId,
        image: data.image
      });
      const id = res?.id;
      if (id) {
        for (const mod of data.modules) {
          const m = await postModule(id, { title: mod.title, description: mod.description });
          const modId = m?.id;
          if (modId) {
            for (const les of mod.lessons) {
              await postLesson(modId, {
                title: les.title,
                content: les.content,
                video: les.video,
                image: les.image
              });
            }
          }
        }
      }
      setOpenCourseDialog(false);
      await loadCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['Все'];
  const levels = ['Все уровни'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <MuiCard sx={{ mb: 3, background: '#667eea', color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <MuiCardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Link to="/">
                    <Button variant="ghost" size="sm" className="hover:bg-white/50">
                      <ArrowLeft className="h-4 w-4 mr-2" /> Назад
                    </Button>
                  </Link>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Курсы</Typography>
                    <Chip label={`${courses.length} курсов`} sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
                  </Box>
                </Box>
                {roleCode === 'admin' && (
                  <Stack direction="row" spacing={2}>
                    <MuiButton
                      variant="contained"
                      sx={{
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #4caf50, #45a049)',
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #45a049, #4caf50)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
                        }
                      }}
                      startIcon={<AddIcon />}
                      onClick={() => setOpenCourseDialog(true)}
                    >
                      Новый курс
                    </MuiButton>
                  </Stack>
                )}
              </Box>
            </MuiCardContent>
          </MuiCard>
        </Box>
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
                <img
                  src={
                    course.img_id
                      ? `${import.meta.env.VITE_REACT_APP_API_URL}/api/files/${course.img_id}`
                      : course.image || 'https://via.placeholder.com/400x200'
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
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
                  className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate(`/courses/${course.id}/modules`)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Начать курс
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <CourseFormDialog
          open={openCourseDialog}
          onClose={() => setOpenCourseDialog(false)}
          onSave={saveCourse}
        />
      </div>
    </div>
  );
};

export default CoursesPage;
