import React, { useRef, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, IconButton, Radio, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import JoditEditor from "jodit-react";
import InfoIcon from '@mui/icons-material/Info';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface SingleChoiceProps {
    onDataChange?: (data: {
        answers: Array<{
            body: string;
            correct: boolean;
        }>;
        correctScore: number;
        incorrectScore: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    }) => void;
    initialData?: {
        answers: Array<{
            body: string;
            correct: boolean;
        }>;
        correctScore: number;
        incorrectScore: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    };
}

const SingleChoice = observer(({ onDataChange, initialData }: SingleChoiceProps) => {
    const editorRefs = useRef<Map<number, any>>(new Map());
    const [contentList, setContentList] = useState<string[]>([""]); 
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [correctScore, setCorrectScore] = useState<number>(0);
    const [incorrectScore, setIncorrectScore] = useState<number>(0);
    const [showMaxScore, setShowMaxScore] = useState<boolean>(true);
    const [requireAnswer, setRequireAnswer] = useState<boolean>(false);
    const [stopIfIncorrect, setStopIfIncorrect] = useState<boolean>(false);

    useEffect(() => {
        if (initialData) {
            setContentList(initialData.answers.map(answer => answer.body));
            const correctAnswerIndex = initialData.answers.findIndex(answer => answer.correct);
            setSelectedValue(correctAnswerIndex >= 0 ? `option-${correctAnswerIndex}` : "");
            setCorrectScore(initialData.correctScore);
            setIncorrectScore(initialData.incorrectScore);
            setShowMaxScore(initialData.showMaxScore);
            setRequireAnswer(initialData.requireAnswer);
            setStopIfIncorrect(initialData.stopIfIncorrect);
        }
    }, [initialData]);

    // Добавление нового элемента
    const addAnswer = () => {
        setContentList([...contentList, ""]);
    };

    // Удаление элемента
    const deleteAnswer = (index: number) => {
        const updatedContent = contentList.filter((_, i) => i !== index);
        setContentList(updatedContent);

        if (selectedValue === `option-${index}`) {
            setSelectedValue("");
        }

        updateParentData(updatedContent, selectedValue === `option-${index}` ? "" : selectedValue);
    };

    // Обработка изменений радиокнопки
    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
        updateParentData(contentList, value);
    };

    // Обновление контента в редакторе
    const handleEditorChange = (index: number, newContent: string) => {
        const updatedContent = [...contentList];
        updatedContent[index] = newContent;
        setContentList(updatedContent);
        updateParentData(updatedContent, selectedValue);
    };

    const updateParentData = (contents: string[], selected: string) => {
        if (onDataChange) {
            const answers = contents.map((content, index) => ({
                body: content,
                correct: `option-${index}` === selected
            }));

            onDataChange({
                answers,
                correctScore,
                incorrectScore,
                showMaxScore,
                requireAnswer,
                stopIfIncorrect
            });
        }
    };

    const handleScoreChange = (type: 'correct' | 'incorrect', value: number) => {
        if (type === 'correct') {
            setCorrectScore(value);
        } else {
            setIncorrectScore(value);
        }
        updateParentData(contentList, selectedValue);
    };

    const handleSwitchChange = (type: 'showMax' | 'require' | 'stop', checked: boolean) => {
        switch (type) {
            case 'showMax':
                setShowMaxScore(checked);
                break;
            case 'require':
                setRequireAnswer(checked);
                break;
            case 'stop':
                setStopIfIncorrect(checked);
                break;
        }
        updateParentData(contentList, selectedValue);
    };

    return (
        <>
            <div style={{ padding: 10 }}>
                <Typography variant="h5">
                    Ответ
                </Typography>
            </div>
            <Typography variant="h6" style={{ padding: 10 }}>
                Добавьте список ответов. Респонденты смогут выбрать только один.
            </Typography>
            <div style={{ width: "95%", margin: "auto", float: 'left' }}>
                {contentList.map((content, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <Radio
                            checked={selectedValue === `option-${index}`}
                            onChange={() => handleRadioChange(`option-${index}`)}
                            value={`option-${index}`}
                            name="single-choice-group"
                            inputProps={{ "aria-label": `Option ${index}` }}
                            style={{
                                marginTop: "-15%",
                                outline: "none",
                                boxShadow: "none",
                            }}
                            sx={{
                                "&:hover": {
                                    backgroundColor: "transparent",
                                },
                            }}
                        />
                        <JoditEditor
                            ref={(ref) => editorRefs.current.set(index, ref)}
                            value={content}
                            onBlur={(newContent) => handleEditorChange(index, newContent)}
                        />
                        <IconButton 
                            aria-label="delete" 
                            onClick={() => deleteAnswer(index)} 
                            style={{
                                marginLeft: "10px",
                                marginTop: "-15%",
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
                <div style={{ textAlign: "left", marginTop: "20px", marginLeft: 40, marginBottom: 40 }}>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={addAnswer}
                        style={{ textTransform: "none" }}
                    >
                        Добавить ответ
                    </Button>
                </div>
            </div>
            <div style={{ padding: 10 }}>
                <Typography variant="h5">
                    Настройки баллов
                </Typography>
            </div>
            <div style={{
                background: '#e3e3e3',
                width: '81%',
                borderRadius: 10,
                marginLeft: 5,
                padding: 20,
                marginTop: 20,
                marginBottom: 20
            }}>
                <div style={{ display: 'flex' }}>
                    <InfoIcon />
                    <Typography variant="h6" color="textSecondary" style={{ marginLeft: 5, marginBottom: 5 }}>
                        Определите оценку за правильный ответ. Также можно назначить отрицательные баллы за неправильные
                        ответы. Если вы не хотите этого делать, введите 0 (ноль) в качестве оценки за этот ответ.
                    </Typography>
                </div>
            </div>
            <div style={{ marginBottom: 20 }}>
                <TextField
                    style={{ width: '39%', marginRight: 30, marginLeft: 5 }}
                    id="outlined-number"
                    label="Балл за правильный ответ"
                    type="number"
                    value={correctScore}
                    onChange={(e) => handleScoreChange('correct', Number(e.target.value))}
                    variant="outlined"
                />
                <TextField
                    style={{ width: '39%' }}
                    id="outlined-number"
                    label="Баллов за неправильный ответ"
                    type="number"
                    value={incorrectScore}
                    onChange={(e) => handleScoreChange('incorrect', Number(e.target.value))}
                    variant="outlined"
                    helperText="Внимание! Количество баллов должно быть отрицательным или нулевым. Отрицательные значения должны включать знак минус, например, -1."
                />
            </div>
            <div>
                <FormGroup>
                    <FormControlLabel 
                        control={
                            <Switch 
                                checked={showMaxScore}
                                onChange={(e) => handleSwitchChange('showMax', e.target.checked)}
                            />
                        } 
                        label="Показать максимально возможный балл за этот вопрос" 
                    />
                    <FormControlLabel 
                        control={
                            <Switch 
                                checked={requireAnswer}
                                onChange={(e) => handleSwitchChange('require', e.target.checked)}
                            />
                        } 
                        label="Заставьте респондента ответить на этот вопрос при первом показе" 
                    />
                    <FormControlLabel 
                        control={
                            <Switch 
                                checked={stopIfIncorrect}
                                onChange={(e) => handleSwitchChange('stop', e.target.checked)}
                            />
                        } 
                        label="Прекратите тест, если ответ на этот вопрос неверный." 
                    />
                </FormGroup>
            </div>
        </>
    );
});

export default SingleChoice;
