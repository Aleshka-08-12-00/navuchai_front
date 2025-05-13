import * as React from 'react';
import { observer } from 'mobx-react-lite';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
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



const TestAccessPage = observer(() => {
    
     const { settingsStore } = React.useContext(Context);
    
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
                </>
            </MainCard>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }} sx={{ mt: 3 }}>
                <>
                    <Typography variant="h5">
                        Технология честного респондента
                    </Typography>
                    <FormControl sx={{ m: 1, minWidth: '80%' }} variant="standard"></FormControl>
                        <Typography variant="subtitle1" style={{fontSize: '16px', fontWeight:400, marginBottom: '10px'}}>
                            Чтобы повысить достоверность результатов теста, активируйте механизм, который контролирует движение вкладок в браузере. Если обнаружено какое-либо движение или переключение вкладок, механизм выдает предупреждения или блокирует тест, в соответствии с настройками вашего выбора.
                        </Typography>
                        <Typography variant="subtitle2" style={{marginBottom: '10px', backgroundColor: '#f1f5f8', border: '1px solid #f1f5f8', borderRadius: '8px', padding: '10px', color: '#505d6b',}}>
                            <div style={{color: '#0f2830', marginRight: '10px'}}>
                                <ErrorOutlinedIcon />
                            </div>
                            <div style={{width: '95%'}}>
                                
                                <Typography variant="h6" style={{color: '#0f2830'}}>
                                    Непреднамеренное закрытие вкладки
                                </Typography>  
                                <Typography variant="body2" gutterBottom>
                                    Если данная технологиия активирована, респонденты получают уведомление на стартовой странице теста. Им рекомендуется отключить системные уведомления, закрыть приложения, работающие в фоновом режиме, и сосредоточиться на прохождении теста.
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    Однако может случиться так, что респондент непреднамеренно покинет вкладку теста. Это может быть вызвано изменением громкости, щелчком за пределами вкладки теста или включением панели задач. Если тест проходится на мобильном устройстве, любые уведомления или звонки также могут вызвать предупреждение.
                                </Typography>
                            </div>
                        </Typography>
                        <RadioGroup value={selectedOption} onChange={handleOptionChange} style={{display: 'flex', flexDirection: 'row', border: "1px solid #e6ebf1", borderRadius: '8px', padding: '5px'}}>
                            <FormControlLabel value="disable" control={<Radio />} label="Отключить" />
                            <FormControlLabel value="warning" control={<Radio />} label="Включить предупреждение" />
                            <FormControlLabel value="block" control={<Radio />} label="Включить предупреждение и блокировку теста" />
                        </RadioGroup>
                    <FormControl />
                </>
            </MainCard>
            <Button
                variant='contained'
                color='success'
                style={{ textTransform: 'none', marginTop: 10 }}
            >
                сохранить
            </Button>
            <Button
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

