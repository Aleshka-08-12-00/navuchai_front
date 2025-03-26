import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import ResultTable from '../../components/resultTable/ResultTable';

const ResultsPage = observer(() => {
    const { authStore } = React.useContext(Context);

  React.useEffect(() => {

}, []);

  return (
    <>
      <ResultTable />
    </>
  );
})

export default ResultsPage;

