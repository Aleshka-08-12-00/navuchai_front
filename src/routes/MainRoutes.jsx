
import Dashboard from 'layout/Dashboard';
import MainPage from 'pages/main-page/main-page';

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
      ]
    },
  ]
};

export default MainRoutes;
