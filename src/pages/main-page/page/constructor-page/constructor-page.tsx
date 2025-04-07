import * as React from 'react';
import { observer } from 'mobx-react-lite';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import { Context } from '../../../..';
import MainCard from '../../../../components/MainCard';
import AddIcon from '@mui/icons-material/Add';
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

export default ConstructorPage;

