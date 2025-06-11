import React, { useContext, useEffect, useState } from 'react';
import {
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Alert,
    Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Context } from '../../../../..';
import { observer } from 'mobx-react-lite';

const TrainingAccess = observer(() => {
    
    const { settingsNewTestStore } = useContext(Context);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    useEffect(() => {
        if (!settingsNewTestStore.publicLink) {
            settingsNewTestStore.generatePublicLink();
        }
    }, [settingsNewTestStore]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(settingsNewTestStore.publicLink);
            showAlert('Ссылка скопирована!', 'success');
        } catch (err) {
            showAlert('Не удалось скопировать ссылку', 'error');
        }
    };

    return (
        <>
            <Box mt={2}>
                <Typography sx={{ mb: 1.5 }}>
                    Любой, у кого есть ссылка, сможет пройти тренировочный тест.
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs style={{display:"flex", flexDirection: 'row'}}>
                        <TextField
                            fullWidth
                            value={settingsNewTestStore.publicLink}
                            InputProps={{
                                readOnly: true
                            }}
                            sx={{
                                marginRight: 2,
                                height: 56,
                                '& input': {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }
                            }}
                        />
                        <Button
                            onClick={handleCopy}
                            variant="contained"
                            sx={{
                                height: 40,
                                whiteSpace: 'nowrap',
                                textTransform: 'none',
                                fontWeight: 500,
                                minWidth: 120
                            }}
                            startIcon={<ContentCopyIcon />}
                        >
                            Скопировать ссылку
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar 
                open={alertOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
});

export default TrainingAccess;
