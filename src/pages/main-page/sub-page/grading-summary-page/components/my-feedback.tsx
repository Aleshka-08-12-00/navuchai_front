import React from 'react';
import { FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';
import MainCard from '../../../../../components/MainCard';

const MyFeedback: React.FC = () => {

    return (
        <div style={{ marginBottom: 20 }}>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 , opacity: 0.1}}>
                <Typography variant="h5" color="textSecondary" style={{ marginBottom: 10 }}>
                    Мой отзыв
                </Typography>
                <div style={{ marginTop: 20 }}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch />}
                            label="Отправьте результаты каждого респондента отдельным письмом (1 респондент = 1 сообщение)"
                        />
                        <FormControlLabel
                            control={<Switch />}
                            label="Отправить коллективные результаты после окончания теста (1 сообщение)"
                        />
                    </FormGroup>
                </div>
            </MainCard>
        </div>
    );
};

export default MyFeedback;
