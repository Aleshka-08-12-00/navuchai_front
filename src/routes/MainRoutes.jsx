
import Dashboard from 'layout/Dashboard';
import MainPage from 'pages/main-page/main-page';
import ResultsUserPage from 'pages/results-page/result-user-page/result-user-page';
import ResultsPage from 'pages/results-page/results-page';
import RespondentsPage from 'pages/respondents-page/respondents-page';
import SettingsPage from 'pages/settings-page/settings-page';


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
