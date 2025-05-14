import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import SubdomainPage from '../../../../settings-page/componets/sub-page/subdomain-page';

const DomainAccess = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/settings');
    };

    return (
        <Box mt={2}>
            <Typography sx={{ mb: 2 }}>
                Предоставлять доступ тесту только членам группы вашего домена
            </Typography>
            <Button variant="outlined" onClick={handleNavigate}>
                Настроить доступ по домену
            </Button>
        </Box>
    );
};

export default DomainAccess;
