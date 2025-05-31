
import Dashboard from 'layout/Dashboard';
import MainPage from 'pages/main-page/main-page';
import ResultsUserPage from 'pages/results-page/result-user-page/result-user-page';
import ResultsPage from 'pages/results-page/results-page';
import RespondentsPage from 'pages/respondents-page/respondents-page';
import SettingsPage from 'pages/settings-page/settings-page';
import NewTestPage from 'pages/new-test-page/new-test-page';
import TestQuestionListPage from 'pages/test-question-list-page/test-question-list-page';
import TestPage from 'pages/TestPage/TestPage';


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
      ]
    },
  ]
};

export default MainRoutes;
