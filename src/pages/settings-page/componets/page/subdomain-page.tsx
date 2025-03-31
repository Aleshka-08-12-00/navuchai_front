import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../..';
import MainCard from '../../../../components/MainCard';
import { Button, Input, TextField, Typography } from '@mui/material';

const SubdomainPage = observer(() => {
    const { settingsStore } = React.useContext(Context);



    React.useEffect(() => {

    }, []);

    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Поддомен
            </Typography>
            <MainCard contentSX={{ p: 2.25, pt: 3.3, width: '65vw' }}>
                <>
                    <Typography variant="h5"  >
                        Настройки поддомена
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                            Поддомен — это выделенный шлюз для ваших тестов. Его можно использовать как публичную
                            ссылку для обмена с вашими респондентами и как способ доступа
                            к вашим тестам через личный код доступа или групповой пароль.
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                            Он идентичен для всех ваших тестов и будет отображать ваш логотип по умолчанию.
                        </Typography>

                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between', padding: 20 }}>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10 }} >
                            Все пробные подписки ограничивают количество собираемых результатов.
                        </Typography>
                    </div>
                    <div style={{ display: 'flex', padding: 20 }}>
                        <TextField id="standard-basic" variant="standard" size="small" style={{ marginRight: 10 }} />
                        <Typography variant="h6" style={{ marginRight: 10 }} >
                            .navuchai.by
                        </Typography>
                    </div>
                </>
            </MainCard>
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
        </div>
    );
})

export default SubdomainPage;

