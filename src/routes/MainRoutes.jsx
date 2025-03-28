
import Dashboard from 'layout/Dashboard';
import MainPage from 'pages/main-page/main-page';
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
          path: '/respondents',
          element: <RespondentsPage />
        },
      ]
    },
  ]
};

export default MainRoutes;
