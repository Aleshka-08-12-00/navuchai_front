import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, Play } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { getCourses, deleteCourse, getModules, getLessons, getUserCourses, getCourseProgress } from '../../api';
import { Context } from '../..';
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Typography,
  Chip,
  Box,
  Stack,
  Button as MuiButton,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  LinearProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

interface Course {
  id: number;
  title: string;
  description: string;
  image?: { path?: string } | string | null;
  img_id?: number;
  duration?: string;
  students?: number;
  rating?: number;
  lessons?: number;
  category?: string;
  progress?: number;
  enrolled?: boolean;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const navigate = useNavigate();
  const { authStore } = useContext(Context);
  const { roleCode } = authStore;
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuCourseId, setMenuCourseId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const loadCourses = async () => {
    try {
      const { courses: data, current } = await getCourses();
      let userCourses: number[] = [];
      if (authStore.userId) {
        try {
          const ucs = await getUserCourses(authStore.userId);
          userCourses = ucs.map((u: any) => u.course_id);
        } catch (e) {
          console.error(e);
        }
      }
      const formatted = await Promise.all(
        data.map(async (c: any) => {
          let progress = 0;
          if (userCourses.includes(c.id)) {
            try {
              const p = await getCourseProgress(c.id);
              progress = p.percent;
            } catch (e) {
              console.error(e);
            }
          }
          return {
            ...c,
            image: typeof c.image === 'string' ? c.image : c.image?.path || null,
            progress,
            enrolled: userCourses.includes(c.id)
          };
        })
      );
      setCourses(formatted);
      const last = current?.course
        ? formatted.find((c: any) => c.id === current.course.id) || null
        : null;
      setCurrentCourse(last);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchor(e.currentTarget);
    setMenuCourseId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuCourseId(null);
  };

  const handleAddCourse = () => {
    navigate('/courses/new');
  };

  const handleEditCourse = async (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;
    try {
      const modulesData = await getModules(courseId);
      const modulesWithLessons = await Promise.all(
        modulesData.map(async (m: any) => {
          const lessonsData = await getLessons(m.id);
          return { ...m, lessons: lessonsData };
        })
      );
      navigate(`/courses/${courseId}/edit`, {
        state: {
          course: {
            title: course.title,
            description: course.description || '',
            accessType: 'public',
            modules: modulesWithLessons.map((m: any) => ({
              id: m.id,
              title: m.title,
              description: m.description || '',
              lessons:
                m.lessons?.map((l: any) => ({
                  id: l.id,
                  title: l.title,
                  content: l.content || '',
                  video: l.video || '',
                  image: l.image || ''
                })) || []
            }))
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm('Удалить курс?')) return;
    try {
      await deleteCourse(id);
      await loadCourses();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const aAccess = roleCode === 'admin' || a.enrolled;
    const bAccess = roleCode === 'admin' || b.enrolled;
    return aAccess === bAccess ? 0 : aAccess ? -1 : 1;
  });
  const displayCourses = currentCourse
    ? [currentCourse, ...sortedCourses.filter((c) => c.id !== currentCourse.id)]
    : sortedCourses;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <MuiCard sx={{ mb: 3, background: '#667eea', color: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <MuiCardContent >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      Курсы
                    </Typography>
                    <Chip
                      label={`${courses.length} курсов`}
                      sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                    />
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
                      onClick={handleAddCourse}
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 250, background: '#fff', borderRadius: 1 }}
              InputProps={{
                endAdornment: (
                  <IconButton size="small">
                    <SearchIcon />
                  </IconButton>
                )
              }}
            />
          </Box>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course, index) => {
            const hasAccess = roleCode === 'admin' || course.enrolled;
            return (
            <Card
              key={course.id}
              className={`flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in overflow-hidden ${hasAccess ? '' : 'opacity-60'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <img
                  src={typeof course.image === 'string' ? course.image : course.image?.path || 'https://via.placeholder.com/400x200'}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.category && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">{course.category}</Badge>
                  </div>
                )}
                {currentCourse && course.id === currentCourse.id && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600 text-white">Продолжить</Badge>
                  </div>
                )}
              </div>
              <CardHeader className="relative">
                {roleCode === 'admin' && (
                  <IconButton size="small" className="absolute right-2 top-2" onClick={(e) => handleMenuOpen(e, course.id)}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                )}
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
                {roleCode !== 'admin' && course.enrolled && (
                  <div className="mb-4">
                    <LinearProgress variant="determinate" value={course.progress ?? 0} />
                    <div className="text-xs text-gray-600 mt-1">{course.progress ?? 0}% пройдено</div>
                  </div>
                )}
                <Button
                  className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate(`/courses/${course.id}/modules`, { state: { course } })}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Начать курс
                </Button>
              </CardContent>
            </Card>
          );
        })}
        </div>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              if (menuCourseId) handleEditCourse(menuCourseId);
              handleMenuClose();
            }}
          >
            Редактировать
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (menuCourseId) handleDeleteCourse(menuCourseId);
              handleMenuClose();
            }}
          >
            Удалить
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default CoursesPage;
