
import Dashboard from 'layout/Dashboard';
import MainPage from 'pages/main-page/main-page';
import ResultsUserPage from 'pages/results-page/result-user-page/result-user-page';
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
          path: '/results',
          element: <ResultsPage />,
        },
        {
          path: '/results/:id',
          element: <ResultsUserPage />,
        },
        {
          path: '/respondents',
          element: <RespondentsPage />
        },
        {
          path: '/settings',
          element: <SettingsPage />
        },
        {
          path: '/start_test/:testId',  // динамический параметр testId
          element: <TestPage />
        },
        {
          path: '/courses',
          element: <CoursesPage />
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
      ]
    },
  ]
};

export default MainRoutes;
