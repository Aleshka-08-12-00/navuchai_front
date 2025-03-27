import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';
import TestUserResult from '../../../components/testUserResult/TestUserResult';


const ResultsUserPage = observer(() => {
    const { authStore } = React.useContext(Context);

  React.useEffect(() => {

}, []);

  return (
    <>
      <TestUserResult />
    </>
  );
})

export default ResultsUserPage;

