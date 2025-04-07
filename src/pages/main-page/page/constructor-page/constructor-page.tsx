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
import { Context } from '../../../..';
import MainCard from '../../../../components/MainCard';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import JoditEditor from "jodit-react";
import SingleChoice from './components/single-choice';
import Descriptive from './components/descriptive';
import TrueFalse from './components/true-false';
import SurveyAnswers from './components/survey';

const ConstructorPage = observer(() => {
    const { settingsStore } = React.useContext(Context);
    const editor = React.useRef(null);
    const [content, setContent] = React.useState("");

    const [age, setAge] = React.useState('');
    const [answerType, setAnswerType] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };
    const handleChangeAnswerType = (event: SelectChangeEvent) => {
        setAnswerType(event.target.value);
    };



    React.useEffect(() => {

    }, []);

    function newContent2(props: any) {
        setContent(props)
    }

    return (
        <div >

            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <>
                    <div style={{ padding: 5 }}>
                        <Typography variant="h6" color="textSecondary" >
                            Текст вопроса:
                        </Typography>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            // config={config}
                            onBlur={(newContent) => newContent2(newContent)}
                        />
                    </div>


                    <FormControl variant="standard" sx={{ m: 1, minWidth: '62%', mt: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">Категория</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={age}
                            onChange={handleChange}
                            label="Age"
                        >
                            <MenuItem value="">
                                <em>Нет категории</em>
                            </MenuItem>
                            <MenuItem value={10}>Тест по ОТ</MenuItem>
                            <MenuItem value={20}>Тест по ОЗ</MenuItem>
                            <MenuItem value={30}>Тест по ГП</MenuItem>
                        </Select>

                    </FormControl>


                    <Button
                        variant="outlined"
                        color='success'
                        startIcon={<AddIcon />}
                        //   color={item.statusColor}
                        style={{ textTransform: 'none', marginTop: 15 }}

                    >
                        Создать категорию
                    </Button>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: '80%', mt: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">Тип ответа</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={answerType}
                            onChange={handleChangeAnswerType}
                            label="Age"
                        >
                            {/* <MenuItem value="">
                                                    <em>Нет категории</em>
                                                </MenuItem> */}
                            <MenuItem value={'short_answer'}>Короткий ответ</MenuItem>
                            <MenuItem value={'true_false'}>ДА / НЕТ</MenuItem>
                            <MenuItem value={'single_choice'}>Одиночный выбор</MenuItem>
                            <MenuItem value={'multiple_choice'}>Множественный выбор</MenuItem>
                            <MenuItem value={'descriptive'}>Описательный</MenuItem>
                            <MenuItem value={'survey'}>Опрос</MenuItem>
                        </Select>

                    </FormControl>

                  
                    {answerType === 'single_choice' && <SingleChoice />}
                    {answerType === 'descriptive' && <Descriptive />}
                    {answerType === 'true_false' && <TrueFalse />}
                    {answerType === 'survey' && <SurveyAnswers />}

                 
                    {/* <FormControl sx={{ m: 1, minWidth: '80%' }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Название теста</InputLabel>
                        <Input
                            id="standard-adornment-amount"
                            startAdornment={<InputAdornment position="start">Новое название</InputAdornment>}
                        />
                    </FormControl> */}

                    {/* <FormControl variant="standard" sx={{ m: 1, minWidth: '80%', mt: 1 }}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Добавьте описание теста для идентификации. Оно будет видно только вам."
                            multiline
                            rows={4}
                            defaultValue="Описание теста"
                        />

                    </FormControl> */}

                </>
            </MainCard>
            {/* <MainCard contentSX={{ p: 2.25, pt: 3.3 }} sx={{ mt: 3 }}>
                <>
                    <Typography variant="h5"  >
                        Логотип
                    </Typography>
                    <div style={{ background: '#e3e3e3', width: '81%', borderRadius: 10, marginLeft: 5, padding: 20, marginTop: 20 }}>
                        <div style={{ display: 'flex' }}>
                            <InfoIcon />
                            <Typography variant="h6" color="textSecondary" style={{ marginLeft: 5, marginBottom: 5 }}  >
                                Видимость логотипа
                            </Typography>
                        </div>

                        <Typography variant="h6" color="textSecondary" >
                            Логотип виден в онлайн- и печатной версии теста.
                        </Typography>
                    </div>
                    <FormControl style={{ marginTop: 20 }}>
                        <FormLabel id="demo-radio-buttons-group-label">Выберите один из вариантов:</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Добавить мой логотип" />
                            <FormControlLabel value="male" control={<Radio />} label="Использовать логотип приложения" />
                            <FormControlLabel value="other" control={<Radio />} label="Скрыть логотип" />
                        </RadioGroup>
                    </FormControl>
                    <Button
                        variant="outlined"
                        color='success'
                        startIcon={<DriveFolderUploadIcon />}
                        style={{ textTransform: 'none', marginTop: 40 }}
                    >
                        Загрузить логотип
                    </Button>
                </>
            </MainCard> */}
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

export default ConstructorPage;

