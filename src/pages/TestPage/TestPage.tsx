import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import TestStartPage from './components/test-start-page';
import TestSingleChoiceCard from './components/test-single-choice-card';

const TestPage = observer(() => {
    const { settingsStore } = React.useContext(Context);
    const [start, setStart] = React.useState(false)

    React.useEffect(() => {

    }, []);

    return (
        <>
            {start ?
                <TestSingleChoiceCard />
                :
                <TestStartPage setStart={setStart} start={start} />}
        </>
    );
})

export default TestPage;

