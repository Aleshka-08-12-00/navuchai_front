
import Dashboard from 'layout/Dashboard';
import MainPage from 'pages/main-page/main-page';
import ResultsUserPage from 'pages/results-page/result-user-page/result-user-page';
import ResultsPage from 'pages/results-page/results-page';


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
        }
      ]
    },
  ]
};

export default MainRoutes;
