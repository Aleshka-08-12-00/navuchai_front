import * as React from 'react';
import { observer } from 'mobx-react-lite';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import MainCard from '../../../../components/MainCard';
import DialogPopup from '../../../../components/DialogPopup';
import { Context } from '../../../..';
import { useState } from 'react';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import PublicAccess from './components/public-access';
import PrivateAccess from './components/private-access';
import TrainingAccess from './components/training-access';
import DomainAccess from './components/domain-access';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';



const TestAccessPage = observer(() => {
    
     const { settingsStore } = React.useContext(Context);

     const accessOptions = [
        { disabled: true, value: 'public', label: 'Открытый доступ', icon: <LockOpenOutlinedIcon sx={{fontSize: 16,}}/>},
        { disabled: true, value: 'private', label: 'Закрытый доступ', icon: <LockOutlinedIcon sx={{fontSize: 16,}}/>},
        { disabled: false, value: 'group', label: 'Групповой доступ', icon: <PeopleOutlinedIcon sx={{fontSize: 16,}}/>},
        { disabled: true, value: 'training', label: 'Тренировка', icon: <TimerOutlinedIcon sx={{fontSize: 16,}}/>},
    ];
    
    const [selectedOption, setSelectedOption] = useState<string>('disable');
    
    
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };
    

    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Доступ к тесту
            </Typography>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <>
                    <Typography variant="h5"  >
                        Настройка доступа
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {accessOptions.map((option) => (
                            <Grid item key={option.value}>
                            <Button
                                variant={settingsStore.accessType === option.value ? 'contained' : 'outlined'}
                                onClick={() => settingsStore.setAccessType(option.value as any)}
                                startIcon= {option.icon}
                                disabled={option.disabled}
                                sx={{
                                    textTransform: 'none',
                                    border: '1px solid #f1f5f8',
                                    borderRadius: 2,
                                    paddingX: 2.5,
                                    paddingY: 1.5,
                                    minWidth: 180,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    backgroundColor:
                                        settingsStore.accessType === option.value ? '#505d6b' : '#f1f5f8',
                                    color:
                                        settingsStore.accessType === option.value ? '#f1f5f8' : '#505d6b',
                                    borderColor: '#f1f5f8',
                                    '&:hover': {
                                        backgroundColor:
                                            settingsStore.accessType === option.value ? '#505d6b' : 'rgb(228, 231, 235)',
                                    },
                                }}
                            >
                                {option.label}
                            </Button>
                        </Grid>
                     ))}
                </Grid>

                <Box mt={2}>
                    {settingsStore.accessType === 'public' && <PublicAccess />}
                    {settingsStore.accessType === 'private' && <PrivateAccess />}
                    {settingsStore.accessType === 'group' && <DomainAccess />}
                    {settingsStore.accessType === 'training' && <TrainingAccess />}
                </Box>
                </>
            </MainCard>

            <MainCard contentSX={{ p: 2.25, pt: 3.3 , opacity: 0.1}} sx={{ mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Технология честного респондента
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    Чтобы повысить достоверность результатов теста, активируйте механизм, который контролирует движение вкладок в браузере. Если обнаружено какое-либо движение или переключение вкладок, механизм выдает предупреждения или блокирует тест, в соответствии с настройками вашего выбора.
                </Typography>

                <Box
                    sx={{
                        backgroundColor: '#f1f5f8',
                        border: '1px solid #f1f5f8',
                        borderRadius: 2,
                        p: 2,
                        color: '#505d6b',
                        display: 'flex',
                        gap: 2,
                        mb: 2
                    }}
                >
                    <Box sx={{ color: '#0f2830', display: 'flex', alignItems: 'flex-start', mt: 0.5 }}>
                        <ErrorOutlinedIcon />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" sx={{ color: '#0f2830', fontWeight: 600, mb: 1 }}>
                            Непреднамеренное закрытие вкладки
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Если данная технология активирована, респонденты получают уведомление на стартовой странице теста. Им рекомендуется отключить системные уведомления, закрыть приложения, работающие в фоновом режиме, и сосредоточиться на прохождении теста.
                        </Typography>
                        <Typography variant="body2">
                            Однако может случиться так, что респондент непреднамеренно покинет вкладку теста. Это может быть вызвано изменением громкости, щелчком за пределами вкладки теста или включением панели задач. Если тест проходится на мобильном устройстве, любые уведомления или звонки также могут вызвать предупреждение.
                        </Typography>
                    </Box>
                </Box>

                <RadioGroup
                    value={selectedOption}
                    onChange={handleOptionChange}
                    row
                    sx={{
                        border: '1px solid #e6ebf1',
                        borderRadius: 2,
                        px: 2,
                        py: 1
                    }}
                >
                    <FormControlLabel disabled value="disable" control={<Radio />} label="Отключить" />
                    <FormControlLabel disabled value="warning" control={<Radio />} label="Включить предупреждение" />
                    <FormControlLabel disabled value="block" control={<Radio />} label="Включить предупреждение и блокировку теста" />
                </RadioGroup>
            </MainCard>

            <Button
                disabled
                variant='contained'
                color='success'
                style={{ textTransform: 'none', marginTop: 10 }}
            >
                сохранить
            </Button>
            <Button
                disabled
                variant='contained'
                color='inherit'
                style={{ textTransform: 'none', marginTop: 10, marginLeft: 15 }}
            >
                выйти
            </Button>
        </div>
    );
})

export default TestAccessPage;

