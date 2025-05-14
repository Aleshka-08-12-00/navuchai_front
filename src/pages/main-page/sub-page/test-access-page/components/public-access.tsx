import React, { useContext, useEffect, useState } from 'react';
import {
    Typography,
    Box,
    TextField,
    Button,
    Grid
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../../..';

const PublicAccess = observer(() => {

    const { settingsNewTestStore } = useContext(Context);

    useEffect(() => {
        if (!settingsNewTestStore.publicLink) {
            settingsNewTestStore.generatePublicLink();
        }
    }, [settingsNewTestStore]);
    

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(settingsNewTestStore.publicLink);
            alert('Ссылка скопирована!');
        } catch (err) {
            alert('Не удалось скопировать ссылку');
        }
    };

    return (
        <Box mt={2}>
            <Typography sx={{ mb: 1.5 }}>
                Любой, у кого есть ссылка, сможет пройти тест.
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
    );
});

export default PublicAccess;
