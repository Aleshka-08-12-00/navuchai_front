
import Dashboard from 'layout/Dashboard';
import MainPage from 'pages/main-page/main-page';
import ResultsUserPage from 'pages/results-page/result-user-page/result-user-page';
import ResultsPage from 'pages/results-page/results-page';
import RespondentsPage from 'pages/respondents-page/respondents-page';
import SettingsPage from 'pages/settings-page/settings-page';
import NewTestPage from 'pages/new-test-page/new-test-page';
import TestQuestionListPage from 'pages/test-question-list-page/test-question-list-page';
import TestQuestionOnePage from 'pages/test-question-one-page/test-question-one-page';


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
          element: <TestQuestionOnePage />
        },
        {
          path: '/main-page/new-test',
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
      ]
    },
  ]
};

export default MainRoutes;
