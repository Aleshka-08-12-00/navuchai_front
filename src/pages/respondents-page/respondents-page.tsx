import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';

const RespondentsPage = observer(() => {
  const { authStore } = React.useContext(Context);
 

  React.useEffect(() => {

}, []);

  return (
    <>
  Respondent
    </>
  );
})

export default RespondentsPage;

