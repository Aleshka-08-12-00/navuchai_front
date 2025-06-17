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
import { useParams } from "react-router-dom";
import { fetchData, postData } from '../../../../api';

const ConstructorPage = observer(() => {

    const { id } = useParams<{ id: string }>();
    const { questionId } = useParams<{ questionId: string }>();

    const { createQuestionsStore, testQuestionListPageStore } = React.useContext(Context);
    const { postQuestion, putQuestion } = createQuestionsStore;
    const { getQuestionTypes, questionsTypesArray } = testQuestionListPageStore;
    const editor = React.useRef<any>(null);
    const [content, setContent] = React.useState("");
    const [openDialogClose, setOpenDialogClose] = React.useState(false);
    const [openDialogSave, setOpenDialogSave] = React.useState(false);
    const [category, setCategory] = React.useState('');
    const [answerType, setAnswerType] = React.useState('');
    const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(null);
    const [isUploadingImage, setIsUploadingImage] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [questionData, setQuestionData] = React.useState<IPostQuestion>({
        text: "",
        text_abstract: "",
        type_id: 0,
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
        const selectedValue = event.target.value;
        console.log('Selected answer type:', selectedValue);
        setAnswerType(selectedValue);
        
        // Находим соответствующий тип вопроса по коду
        const selectedType = questionsTypesArray.find(type => type.code.toLowerCase() === selectedValue);
        const typeId = selectedType ? selectedType.id : 0;
        
        setQuestionData(prev => ({
            ...prev,
            type_id: typeId
        }));
    };

    React.useEffect(() => {
        getQuestionTypes();
    }, []);

 

    React.useEffect(() => {
        const fetchQuestionData = async () => {
            if (questionId) {
                try {
                    const result = await fetchData('getQuestionsByIdById', {}, questionId);
                    if (result) {
                        setQuestionData(result);
                        setContent(result.text || "");
                        // Проверяем, является ли type объектом или строкой
                        const typeCode = typeof result.type === 'object' && result.type?.code 
                            ? result.type.code 
                            : result.type;
                        setAnswerType(typeCode?.toLowerCase() || "");
                        
                        // Устанавливаем type_id если он есть в результате
                        if (result.type_id) {
                            setQuestionData(prev => ({
                                ...prev,
                                type_id: result.type_id
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching question data:', error);
                }
            }
        };

        fetchQuestionData();
    }, [questionId]);


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
            await postQuestion(finalData, Number(id));
            console.log('Question saved successfully');
        } catch (error) {
            console.error('Error saving question:', error);
        }
    };
    const clickPutSave = async () => {
        setOpenDialogSave(!openDialogSave);
        const finalData: IPostQuestion = {
            ...questionData,
            text: content,
            text_abstract: content.replace(/<[^>]*>/g, '')
        };

        try {
            await putQuestion(finalData, Number(questionId));
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

    const handleImageFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Проверяем, что это изображение
            if (file.type.startsWith('image/')) {
                setSelectedImageFile(file);
            } else {
                alert('Пожалуйста, выберите файл изображения');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    const handleUploadImage = async () => {
        if (!selectedImageFile) return;

        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append('file', selectedImageFile);

        try {
            const response = await postData('uploadLogo', formData);
            if (response && response.url) {
                // Вставляем изображение в редактор
                const imageHtml = `<img src="${response.url}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
                
                // Получаем текущую позицию курсора в редакторе
                const editorInstance = editor.current?.editor;
                if (editorInstance && typeof editorInstance.insertHTML === 'function') {
                    // Вставляем изображение в позицию курсора
                    editorInstance.insertHTML(imageHtml);
                } else {
                    // Если не удалось получить редактор, добавляем в конец
                    const newContent = content + imageHtml;
                    setContent(newContent);
                    setQuestionData(prev => ({
                        ...prev,
                        text: newContent,
                        text_abstract: newContent.replace(/<[^>]*>/g, '')
                    }));
                }
                
                // Очищаем выбранный файл
                setSelectedImageFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                
                console.log('Изображение успешно загружено и вставлено в текст');
            }
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
            alert('Ошибка при загрузке изображения');
        } finally {
            setIsUploadingImage(false);
        }
    };

    return (
        <div>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <>
                    <div style={{ padding: 5 }}>
                        <Typography variant="h6" color="textSecondary">
                            Текст вопроса:
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileSelect}
                                style={{ display: 'none' }}
                            />
                            <Button
                                variant="outlined"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingImage}
                                style={{ textTransform: 'none' }}
                            >
                                Выбрать изображение
                            </Button>
                            {selectedImageFile && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUploadImage}
                                    disabled={isUploadingImage}
                                    style={{ textTransform: 'none' }}
                                >
                                    {isUploadingImage ? 'Загрузка...' : 'Загрузить и вставить'}
                                </Button>
                            )}
                            {selectedImageFile && (
                                <Typography variant="body2" color="textSecondary">
                                    Выбран файл: {selectedImageFile.name}
                                </Typography>
                            )}
                        </div>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            onBlur={handleContentChange}
                        />
                    </div>

                    {/* <FormControl variant="standard" sx={{ m: 1, minWidth: '62%', mt: 1 }}>
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
                    </Button> */}

                    <FormControl variant="standard" sx={{ m: 1, minWidth: '80%', mt: 1 }}>
                        <InputLabel id="answer-type-select-label">Тип ответа</InputLabel>
                        <Select
                            labelId="answer-type-select-label"
                            value={answerType}
                            onChange={handleChangeAnswerType}
                            label="Answer Type"
                        >
                            {questionsTypesArray.map((type) => (
                                <MenuItem key={type.id} value={type.code.toLowerCase()}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {answerType === 'single_choice' && <SingleChoice onDataChange={handleSingleChoiceDataChange} initialData={questionData.answers.allAnswer.length > 0 ? {
                        answers: questionData.answers.allAnswer.map((answer, index) => ({
                            body: answer,
                            correct: questionData.answers.correctAnswer.includes(answer)
                        })),
                        correctScore: questionData.answers.settings.correctScore,
                        incorrectScore: questionData.answers.settings.incorrectScore,
                        showMaxScore: questionData.answers.settings.showMaxScore,
                        requireAnswer: questionData.answers.settings.requireAnswer,
                        stopIfIncorrect: questionData.answers.settings.stopIfIncorrect
                    } : undefined} />}
                    {answerType === 'descriptive' && <Descriptive onDataChange={handleDescriptiveDataChange} initialData={questionData.answers.settings.correctScore > 0 ? {
                        maxScore: questionData.answers.settings.correctScore,
                        maxCharCount: (questionData.answers.settings as any).maxCharCount || 100,
                        showMaxScore: questionData.answers.settings.showMaxScore,
                        requireAnswer: questionData.answers.settings.requireAnswer,
                        stopIfIncorrect: questionData.answers.settings.stopIfIncorrect
                    } : undefined} />}
                    {answerType === 'true_false' && <TrueFalse onDataChange={handleTrueFalseDataChange} initialData={questionData.answers.allAnswer.length > 0 ? {
                        answers: questionData.answers.allAnswer.map((answer, index) => ({
                            body: answer,
                            correct: questionData.answers.correctAnswer.includes(answer)
                        })),
                        correctScore: questionData.answers.settings.correctScore,
                        incorrectScore: questionData.answers.settings.incorrectScore,
                        showMaxScore: questionData.answers.settings.showMaxScore,
                        requireAnswer: questionData.answers.settings.requireAnswer,
                        stopIfIncorrect: questionData.answers.settings.stopIfIncorrect
                    } : undefined} />}
                    {answerType === 'survey' && <SurveyAnswers onDataChange={handleSurveyDataChange} initialData={questionData.answers.allAnswer.length > 0 ? {
                        answers: questionData.answers.allAnswer.map((answer, index) => ({
                            body: answer,
                            points: questionData.answers.correctAnswer.includes(answer) ? 1 : 0
                        })),
                        correctScore: questionData.answers.settings.correctScore,
                        incorrectScore: questionData.answers.settings.incorrectScore,
                        showMaxScore: questionData.answers.settings.showMaxScore,
                        requireAnswer: questionData.answers.settings.requireAnswer,
                        stopIfIncorrect: questionData.answers.settings.stopIfIncorrect
                    } : undefined} />}
                    {answerType === 'short_answer' && <ShortAnswer onDataChange={handleShortAnswerDataChange} initialData={questionData.answers.allAnswer.length > 0 ? {
                        answers: questionData.answers.allAnswer.map((answer, index) => ({
                            body: answer,
                            maxCharCount: (questionData.answers.settings as any).maxCharCount || 100
                        })),
                        correctScore: questionData.answers.settings.correctScore,
                        incorrectScore: questionData.answers.settings.incorrectScore,
                        showMaxScore: questionData.answers.settings.showMaxScore,
                        requireAnswer: questionData.answers.settings.requireAnswer,
                        stopIfIncorrect: questionData.answers.settings.stopIfIncorrect
                    } : undefined} />}
                    {answerType === 'multiple_choice' && <MultipleChoice onDataChange={handleMultipleChoiceDataChange} initialData={questionData.answers.allAnswer.length > 0 ? {
                        answers: questionData.answers.allAnswer.map((answer, index) => ({
                            body: answer,
                            correct: questionData.answers.correctAnswer.includes(answer)
                        })),
                        correctScore: questionData.answers.settings.correctScore,
                        incorrectScore: questionData.answers.settings.incorrectScore,
                        showMaxScore: questionData.answers.settings.showMaxScore,
                        requireAnswer: questionData.answers.settings.requireAnswer,
                        stopIfIncorrect: questionData.answers.settings.stopIfIncorrect
                    } : undefined} />}
                </>
            </MainCard>
            <Button
                variant='contained'
                color='success'
                style={{ textTransform: 'none', marginTop: 10 }}
                onClick={questionId ? clickPutSave : clickSave}
            >
                {questionId ? 'сохранить изменения' : 'сохранить'}
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

