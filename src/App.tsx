import { RouterProvider } from 'react-router-dom';
import router from 'routes';
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import {observer} from "mobx-react-lite";
import './index.css'


const App = () => (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  
)

export default observer(App);

