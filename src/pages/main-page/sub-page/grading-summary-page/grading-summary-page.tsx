import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Typography } from '@mui/material';
import { Context } from '../../../..';
import TestEndMessageAndRedirection from './components/test-end-message-and-redirection';
import InformationRorRespondents from './components/information-for-respondents';
import MyFeedback from './components/my-feedback';



const GradingSummaryPage = observer(() => {

    const { settingsStore } = React.useContext(Context);

    React.useEffect(() => {

    }, []);

    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Оценка и резюме
            </Typography>
            <TestEndMessageAndRedirection/>
            <InformationRorRespondents/>
            <MyFeedback/>
            <Button
                variant='contained'
                color='success'
                style={{ textTransform: 'none', marginTop: 10 }}
            >
                сохранить
            </Button>
        </div>
    );
})

export default GradingSummaryPage;

