import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../..';
import MainCard from '../../../../components/MainCard';
import { Button, IconButton, Typography } from '@mui/material';
import { minWidth, Stack } from '@mui/system';

const GeneralInformationPage = observer(() => {
    const { settingsStore } = React.useContext(Context);



    React.useEffect(() => {

    }, []);

    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Основная информация
            </Typography>
            <MainCard contentSX={{ p: 2.25, pt: 3.3, width: '65vw' }}>
                <>
                    <Typography variant="h5"  >
                        Ваш аккаунт
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>


                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                            Имя пользователя:
                        </Typography>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                            test@gmail.com
                        </Typography>

                        <Button
                            variant="outlined"
                            //   color={item.statusColor}
                            style={{ textTransform: 'none' }}
                            size="small"
                        >
                            Выйти
                        </Button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                            План:
                        </Typography>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10, color: 'green' }} >
                            MAX
                        </Typography>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10, color: 'green' }} >
                            (trial)
                        </Typography>
                    </div>
                    <hr></hr>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>


                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                            Trial expiry date:
                        </Typography>
                        <Typography variant="h6" style={{ marginRight: 10 }} >
                            2025-04-08 14:11
                        </Typography>

                        <Button
                            variant='contained'
                            color='success'
                            style={{ textTransform: 'none' }}
                            size="small"
                        >
                            Обновить
                        </Button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                            Trial days left:
                        </Typography>
                        <Typography variant="h6" style={{ marginRight: 10 }} >
                            8
                        </Typography>
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
                    <hr></hr>
                    <Stack sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="h5" style={{paddingBottom: 10}}  >
                            Статистика
                        </Typography>
                        <div style={{ paddingLeft: 20, paddingBottom: 5, display: 'flex', }}>
                            <Typography variant="h6" color="textSecondary" style={{ marginRight: 10}} >
                                tests created:
                            </Typography>
                            <Typography variant="h6" style={{ marginRight: 10 }} >
                                5
                            </Typography>
                        </div>
                        <div style={{ paddingLeft: 20, paddingBottom: 5, display: 'flex', }}>
                            <Typography variant="h6" color="textSecondary" style={{ marginRight: 10}} >
                                tests completed in the last 30 days:
                            </Typography>
                            <Typography variant="h6" style={{ marginRight: 10,}} >
                                4
                            </Typography>
                        </div>
                        <div style={{paddingLeft: 20, paddingBottom: 5, display: 'flex', }}>
                            <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                                tests completed in total:
                            </Typography>
                            <Typography variant="h6" style={{ marginRight: 10,  }} >
                                4
                            </Typography>
                        </div>
                        <div style={{ paddingLeft: 20, paddingBottom: 5, display: 'flex', }}>
                            <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                                training tests completed in the last 30 days:
                            </Typography>
                            <Typography variant="h6" style={{ marginRight: 10,  }} >
                                0
                            </Typography>
                        </div>
                        <div style={{paddingLeft: 20, paddingBottom: 5, display: 'flex', }}>
                            <Typography variant="h6" color="textSecondary" style={{ marginRight: 10  }} >
                                training tests completed in total:
                            </Typography>
                            <Typography variant="h6" style={{ marginRight: 10 }} >
                                0
                            </Typography>
                        </div>
                    </Stack>


                </>
            </MainCard>
        </div>
    );
})

export default GeneralInformationPage;

