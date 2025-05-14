import React from 'react';
import { Typography, Box, Switch, FormControlLabel } from '@mui/material';

const PrivateAccess = () => {
    const [requireCode, setRequireCode] = React.useState(false);

    return (
        <Box mt={2}>
            <Typography>
                Требуется приватный код доступа для прохождения теста.
            </Typography>
            <FormControlLabel
                control={
                    <Switch
                        checked={requireCode}
                        onChange={(e) => setRequireCode(e.target.checked)}
                    />
                }
                label="Запрашивать код доступа перед началом теста"
                sx={{ mt: 2 }}
            />
            {requireCode && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Перед началом теста респонденту потребуется ввести свой адрес электронной почты, 
                    на который будет отправлен код доступа.
                </Typography>
            )}
        </Box>
    );
};

export default PrivateAccess;
