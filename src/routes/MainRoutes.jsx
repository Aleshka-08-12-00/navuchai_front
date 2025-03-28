
import Dashboard from 'layout/Dashboard';
import MainPage from 'pages/main-page/main-page';
import ResultsUserPage from 'pages/results-page/result-user-page/result-user-page';
import ResultsPage from 'pages/results-page/results-page';
import RespondentsPage from 'pages/respondents-page/respondents-page';


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

          path: '/Results',
          element: <ResultsPage />,
        },
        {
          path: '/Results/:id',
          element: <ResultsUserPage />,
        },
        {
          path: '/respondents',
          element: <RespondentsPage />
        },
      ]
    },
  ]
};

export default MainRoutes;
