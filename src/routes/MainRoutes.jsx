import Dashboard from 'layout/Dashboard';
import MainPage from 'pages/main-page/main-page';
import ResultsPage from 'pages/results-page/results-page';
import RespondentsPage from 'pages/respondents-page/respondents-page';
import SettingsPage from 'pages/settings-page/settings-page';
import NewTestPage from 'pages/new-test-page/new-test-page';
import TestQuestionListPage from 'pages/test-question-list-page/test-question-list-page';
import TestPage from 'pages/TestPage/TestPage';
import CoursesPage from 'pages/courses-page/CoursesPage';
import ModulesPage from 'pages/modules-page/ModulesPage';
import LessonsPage from 'pages/lessons-page/LessonsPage';
import LessonViewPage from 'pages/lessons-page/LessonViewPage';
import CourseEditorPage from 'pages/course-editor-page/CourseEditorPage';
import TestUserResult from 'components/testUserResult/TestUserResult';
import CreateRespondentsPage from 'pages/respondents-page/create-respondents-list';
import AdminPage from 'pages/admin-page/AdminPage';
import CourseAccessAdminPage from 'pages/course-access-admin/CourseAccessAdminPage';
import AnalyticsPage from 'pages/analytics-page/AnalyticsPage';

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      children: [
        {
          path: '',
          element: <MainPage />
        },
        {
          path: '/main-page',
          element: <MainPage />
        },
        {
          path: '/main-page/test/:id',
          element: <TestQuestionListPage />
        },
        {
          path: '/main-page/test/:id/question/:questionId',
          element: <NewTestPage />
        },
        {
          path: '/main-page/new-test',
          element: <NewTestPage />
        },
        {
          path: '/main-page/new-test/:id',
          element: <NewTestPage />
        },
        {
          path: '/main-page/edit/:id',
          element: <NewTestPage />
        },
        {
          path: '/results',
          element: <ResultsPage />
        },
        {
          path: '/results/:resultId',
          element: <TestUserResult />
        },
        {
          path: '/respondents',
          element: <RespondentsPage />
        },
        {
          path: '/respondents/:id',
          element: <CreateRespondentsPage />
        },
        {
          path: '/settings',
          element: <SettingsPage />
        },
        {
          path: '/start_test/:testId', // динамический параметр testId
          element: <TestPage />
        },
        {
          path: '/admin',
          element: <AdminPage />
        },
        {
          path: '/admin/course-access',
          element: <CourseAccessAdminPage />
        },
        {
          path: '/courses',
          element: <CoursesPage />
        },
        {
          path: '/courses/new',
          element: <CourseEditorPage />
        },
        {
          path: '/courses/:courseId/edit',
          element: <CourseEditorPage />
        },
        {
          path: '/courses/:courseId/modules',
          element: <ModulesPage />
        },
        {
          path: '/courses/:courseId/modules/:moduleId/lessons',
          element: <LessonsPage />
        },
        {
          path: '/courses/:courseId/modules/:moduleId/lessons/:lessonId',
          element: <LessonViewPage />
        },
        {
          path: '/analytics',
          element: <AnalyticsPage />
        }
      ]
    }
  ]
};

export default MainRoutes;
