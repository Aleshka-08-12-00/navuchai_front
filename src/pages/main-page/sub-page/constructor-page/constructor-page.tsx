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
import DialogPopup from '../../../../components/DialogPopup';
import ShortAnswer from './components/short-answer';
import MultipleChoice from './components/multiple-choice';
import { IPostQuestion } from '../../../../interface/interfaceStore';

const ConstructorPage = observer(() => {
    const { createQuestionsStore } = React.useContext(Context);
    const { postQuestion } = createQuestionsStore;
    const editor = React.useRef(null);
    const [content, setContent] = React.useState("");
    const [openDialogClose, setOpenDialogClose] = React.useState(false);
    const [openDialogSave, setOpenDialogSave] = React.useState(false);
    const [category, setCategory] = React.useState('');
    const [answerType, setAnswerType] = React.useState('');
    const [questionData, setQuestionData] = React.useState<IPostQuestion>({
        text: "",
        text_abstract: "",
        type: "",
        reviewable: false,
        answers: {
            correctAnswer: [],
            allAnswer: [],
            settings: {
                correctScore: 0,
                incorrectScore: 0,
                showMaxScore: true,
                requireAnswer: false,
                stopIfIncorrect: false
            }
        }
    });

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value);
    };

    const handleChangeAnswerType = (event: SelectChangeEvent) => {
        setAnswerType(event.target.value);
        setQuestionData(prev => ({
            ...prev,
            type: event.target.value.toUpperCase()
        }));
    };

    const handleSingleChoiceDataChange = (data: any) => {
        const correctAnswers = data.answers
            .filter((answer: { correct: boolean }) => answer.correct)
            .map((answer: { body: string }) => answer.body);

        const allAnswers = data.answers.map((answer: { body: string }) => answer.body);

        setQuestionData(prev => ({
            ...prev,
            answers: {
                correctAnswer: correctAnswers,
                allAnswer: allAnswers,
                settings: {
                    correctScore: data.correctScore,
                    incorrectScore: data.incorrectScore,
                    showMaxScore: data.showMaxScore,
                    requireAnswer: data.requireAnswer,
                    stopIfIncorrect: data.stopIfIncorrect
                }
            }
        }));
    };

    const handleDescriptiveDataChange = (data: {
        maxScore: number;
        maxCharCount: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    }) => {
        setQuestionData(prev => ({
            ...prev,
            reviewable: true,
            answers: {
                correctAnswer: [],
                allAnswer: [],
                settings: {
                    correctScore: data.maxScore,
                    incorrectScore: 0,
                    showMaxScore: data.showMaxScore,
                    requireAnswer: data.requireAnswer,
                    stopIfIncorrect: data.stopIfIncorrect,
                    maxCharCount: data.maxCharCount
                }
            }
        }));
    };

    const handleTrueFalseDataChange = (data: {
        answers: Array<{
            body: string;
            correct: boolean;
        }>;
        correctScore: number;
        incorrectScore: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    }) => {
        const correctAnswers = data.answers
            .filter(answer => answer.correct)
            .map(answer => answer.body);

        const allAnswers = data.answers.map(answer => answer.body);

        setQuestionData(prev => ({
            ...prev,
            answers: {
                correctAnswer: correctAnswers,
                allAnswer: allAnswers,
                settings: {
                    correctScore: data.correctScore,
                    incorrectScore: data.incorrectScore,
                    showMaxScore: data.showMaxScore,
                    requireAnswer: data.requireAnswer,
                    stopIfIncorrect: data.stopIfIncorrect
                }
            }
        }));
    };

    const handleSurveyDataChange = (data: {
        answers: Array<{
            body: string;
            points: number;
        }>;
        correctScore: number;
        incorrectScore: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    }) => {
        const allAnswers = data.answers.map(answer => answer.body);
        // For survey questions, we don't have correct answers, but we store points for each answer
        const correctAnswers = data.answers
            .filter(answer => answer.points > 0)
            .map(answer => answer.body);

        setQuestionData(prev => ({
            ...prev,
            answers: {
                correctAnswer: correctAnswers,
                allAnswer: allAnswers,
                settings: {
                    correctScore: data.correctScore,
                    incorrectScore: data.incorrectScore,
                    showMaxScore: data.showMaxScore,
                    requireAnswer: data.requireAnswer,
                    stopIfIncorrect: data.stopIfIncorrect
                }
            }
        }));
    };

    const handleShortAnswerDataChange = (data: {
        answers: Array<{
            body: string;
            maxCharCount: number;
        }>;
        correctScore: number;
        incorrectScore: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    }) => {
        const allAnswers = data.answers.map(answer => answer.body);
        // For short answers, all provided answers are considered correct
        const correctAnswers = allAnswers;

        setQuestionData(prev => ({
            ...prev,
            answers: {
                correctAnswer: correctAnswers,
                allAnswer: allAnswers,
                settings: {
                    correctScore: data.correctScore,
                    incorrectScore: data.incorrectScore,
                    showMaxScore: data.showMaxScore,
                    requireAnswer: data.requireAnswer,
                    stopIfIncorrect: data.stopIfIncorrect,
                    maxCharCount: data.answers[0]?.maxCharCount || 100
                }
            }
        }));
    };

    const handleMultipleChoiceDataChange = (data: {
        answers: Array<{
            body: string;
            correct: boolean;
        }>;
        correctScore: number;
        incorrectScore: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    }) => {
        const correctAnswers = data.answers
            .filter(answer => answer.correct)
            .map(answer => answer.body);

        const allAnswers = data.answers.map(answer => answer.body);

        setQuestionData(prev => ({
            ...prev,
            answers: {
                correctAnswer: correctAnswers,
                allAnswer: allAnswers,
                settings: {
                    correctScore: data.correctScore,
                    incorrectScore: data.incorrectScore,
                    showMaxScore: data.showMaxScore,
                    requireAnswer: data.requireAnswer,
                    stopIfIncorrect: data.stopIfIncorrect
                }
            }
        }));
    };

    const clickClose = () => {
        setOpenDialogClose(!openDialogClose);
    };

    const clickSave = async () => {
        setOpenDialogSave(!openDialogSave);
        const finalData: IPostQuestion = {
            ...questionData,
            text: content,
            text_abstract: content.replace(/<[^>]*>/g, '')
        };

        try {
            await postQuestion(finalData);
            console.log('Question saved successfully');
        } catch (error) {
            console.error('Error saving question:', error);
        }
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        setQuestionData(prev => ({
            ...prev,
            text: newContent,
            text_abstract: newContent.replace(/<[^>]*>/g, '')
        }));
    };

    return (
        <div>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <>
                    <div style={{ padding: 5 }}>
                        <Typography variant="h6" color="textSecondary">
                            Текст вопроса:
                        </Typography>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            onBlur={handleContentChange}
                        />
                    </div>

                    <FormControl variant="standard" sx={{ m: 1, minWidth: '62%', mt: 1 }}>
                        <InputLabel id="category-select-label">Категория</InputLabel>
                        <Select
                            labelId="category-select-label"
                            value={category}
                            onChange={handleChange}
                            label="Category"
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
                        style={{ textTransform: 'none', marginTop: 15 }}
                    >
                        Создать категорию
                    </Button>

                    <FormControl variant="standard" sx={{ m: 1, minWidth: '80%', mt: 1 }}>
                        <InputLabel id="answer-type-select-label">Тип ответа</InputLabel>
                        <Select
                            labelId="answer-type-select-label"
                            value={answerType}
                            onChange={handleChangeAnswerType}
                            label="Answer Type"
                        >
                            <MenuItem value={'short_answer'}>Короткий ответ</MenuItem>
                            <MenuItem value={'true_false'}>ДА / НЕТ</MenuItem>
                            <MenuItem value={'single_choice'}>Одиночный выбор</MenuItem>
                            <MenuItem value={'multiple_choice'}>Множественный выбор</MenuItem>
                            <MenuItem value={'descriptive'}>Описательный</MenuItem>
                            <MenuItem value={'survey'}>Опрос</MenuItem>
                        </Select>
                    </FormControl>

                    {answerType === 'single_choice' && <SingleChoice onDataChange={handleSingleChoiceDataChange} />}
                    {answerType === 'descriptive' && <Descriptive onDataChange={handleDescriptiveDataChange} />}
                    {answerType === 'true_false' && <TrueFalse onDataChange={handleTrueFalseDataChange} />}
                    {answerType === 'survey' && <SurveyAnswers onDataChange={handleSurveyDataChange} />}
                    {answerType === 'short_answer' && <ShortAnswer onDataChange={handleShortAnswerDataChange} />}
                    {answerType === 'multiple_choice' && <MultipleChoice onDataChange={handleMultipleChoiceDataChange} />}
                </>
            </MainCard>
            <Button
                variant='contained'
                color='success'
                style={{ textTransform: 'none', marginTop: 10 }}
                onClick={clickSave}
            >
                сохранить
            </Button>
            <Button
                variant='contained'
                color='inherit'
                style={{ textTransform: 'none', marginTop: 10, marginLeft: 15 }}
                onClick={clickClose}
            >
                выйти
            </Button>
            {/* <DialogPopup
                title='Подтверждение'
                mainText='Сохранить Ваши изменение?'
                open={openDialogSave}
                setOpen={setOpenDialogSave}
            /> */}
            <DialogPopup
                title='Подтверждение'
                mainText='Вы не сохранили изменения. Вы уверены, что хотите покинуть страницу?'
                open={openDialogClose}
                setOpen={setOpenDialogClose}
            />
        </div>
    );
});

export default ConstructorPage;

