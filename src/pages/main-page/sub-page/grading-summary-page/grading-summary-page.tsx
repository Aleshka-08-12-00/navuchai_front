import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Typography } from '@mui/material';
import { Context } from '../../../..';
import TestEndMessageAndRedirection from './components/test-end-message-and-redirection';
import InformationRorRespondents from './components/information-for-respondents';
import MyFeedback from './components/my-feedback';
import settingsNewTestStore from '../../../../store/settingsNewTestStore';
import { useParams } from 'react-router-dom';



const GradingSummaryPage = observer(() => {
   

  
    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Оценка и резюме
            </Typography>
            <TestEndMessageAndRedirection/>
           
            <InformationRorRespondents/>
            <MyFeedback/>
           
        </div>
    );
})

export default GradingSummaryPage;

