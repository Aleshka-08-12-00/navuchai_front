import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../..';
import MainCard from '../../../../components/MainCard';
import { Button, Typography } from '@mui/material';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

const YourTrialPage = observer(() => {
    const { settingsStore } = React.useContext(Context);



    React.useEffect(() => {

    }, []);

    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Ваш пакет
            </Typography>
            <MainCard contentSX={{ p: 2.25, pt: 3.3, opacity: 0.1 }}>
                <>
                    <Typography variant="h5"  >
                       Детали Вашего пакета
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                        You still have 8 days of trial.
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                        Your current trial subscription: MAX. You can change it to one of the following:
                        </Typography>
                    </div>
                    <div style={{  padding: 20 }}>
                        <Button
                            variant='contained'
                            color='inherit'
                            style={{ textTransform: 'none', marginRight: 20 }}
                            size="small"
                        >
                            Стандарт
                        </Button>
                        <Button
                            variant='contained'
                           color='inherit'
                            style={{ textTransform: 'none' }}
                            size="small"
                        >
                           PRO
                        </Button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                    <Button
                            color='success'
                            style={{ textTransform: 'none' }}
                            size="small"
                            startIcon={<SignalCellularAltIcon/>}
                        >
                            Compare plans
                        </Button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                        All trial subscriptions limit the number of collected results.
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                            Results limit used:
                        </Typography>
                        <Typography variant="h6" style={{ marginRight: 10 }} >
                            4/15
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                        <Button
                            variant='contained'
                            color='success'
                            style={{ textTransform: 'none' }}
                            size="small"
                        >
                            Обновить
                        </Button>
                    </div>
                </>
            </MainCard>
        </div>
    );
})

export default YourTrialPage;

