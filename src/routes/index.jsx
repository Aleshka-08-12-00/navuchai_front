import { createBrowserRouter } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

let router = createBrowserRouter(window.localStorage.getItem('tokenNavuchai') ? [MainRoutes, LoginRoutes] : [LoginRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });


if (!window.localStorage.getItem('tokenNavuchai') && ( window.location.pathname !== '/login' )) {
  window.location.replace('/login');
}

export default router;