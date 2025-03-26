import { createBrowserRouter } from 'react-router-dom';
import MainRoutes from './MainRoutes';
let router = createBrowserRouter( [MainRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });


export default router;
