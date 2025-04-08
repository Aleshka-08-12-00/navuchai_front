import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Typography } from '@mui/material';
import { Context } from '../../../..';
import TestDuration from './components/test-duration';


const TimeSettingsPage = observer(() => {

    const { settingsStore } = React.useContext(Context);

    React.useEffect(() => {

    }, []);

    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Настройка времени
            </Typography>
            <TestDuration/>

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

export default TimeSettingsPage;

