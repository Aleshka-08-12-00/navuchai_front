import * as React from 'react';
import { observer } from 'mobx-react-lite';
import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography
} from '@mui/material';
import MainCard from '../../../../components/MainCard';
import { useState } from 'react';
import { Context } from '../../../..';





const TestSetsPage = observer(() => {

    const { settingsStore } = React.useContext(Context);

    const [selectedOption, setSelectedOption] = useState<string>('random');


       const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedOption(event.target.value);
        };
    

    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Подача теста
            </Typography>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <>
                    <Typography variant="h5"  >
                        Порядок вопросов
                    </Typography>
                    <FormControl sx={{ m: 1, minWidth: '80%' }} variant="standard">
                        <Typography variant="h6"  >
                            Выберите опцию:
                        </Typography>
                        <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                            <FormControlLabel value="classic" control={<Radio />} label="Оставить вопросы и ответы в заданном порядке" />
                            <FormControlLabel value="random" control={<Radio />} label="Поменять местами вопросы и ответы" />
                        </RadioGroup>
                    </FormControl>
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

export default TestSetsPage;

