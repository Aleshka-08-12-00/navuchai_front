import { RouterProvider } from 'react-router-dom';
import router from 'routes';
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import { observer } from "mobx-react-lite";
import './index.css';
import TestPage from './pages/TestPage/TestPage';

const App = () => {
  const currentUrl = window.location.href; // Получить текущий URL

  if (currentUrl.includes("start_test")) {
    return (
      <ThemeCustomization>
        <TestPage />
      </ThemeCustomization>
    );
  } else {
    return (
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </ThemeCustomization>
    );
  }
};

export default observer(App);
