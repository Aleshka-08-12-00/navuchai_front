import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Typography } from '@mui/material';
import { Context } from '../../../..';

import TestStartForm from './components/test-start-form';
import InstructionsForRespondents from './components/instructions-for-respondents';
import Consent from './components/consent';



const TestStartPage = observer(() => {

    const { settingsStore } = React.useContext(Context);

    React.useEffect(() => {

    }, []);

    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Стартовая страница теста
            </Typography>

            <InstructionsForRespondents />
            {/* <Button
                variant='contained'
                color='success'
                style={{ textTransform: 'none', marginBottom: 20 }}
            >
                сохранить
            </Button> */}

            <TestStartForm />

            <Consent />

           
        </div>
    );
})

export default TestStartPage;

