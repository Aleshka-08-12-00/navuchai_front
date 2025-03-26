import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';

const MainPage = observer(() => {
  const { authStore } = React.useContext(Context);
 

  React.useEffect(() => {

}, []);

  return (
    <>
      Hello Niga
    </>
  );
})

export default MainPage;

