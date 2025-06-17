import React, { useRef, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import JoditEditor from "jodit-react";
import InfoIcon from '@mui/icons-material/Info';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface ShortAnswerProps {
    onDataChange?: (data: {
        answers: Array<{
            body: string;
            maxCharCount: number;
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
            maxCharCount: number;
        }>;
        correctScore: number;
        incorrectScore: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    };
}

const ShortAnswer = observer(({ onDataChange, initialData }: ShortAnswerProps) => {
    const [answers, setAnswers] = useState<Array<{ id: number; text: string; maxCharCount: number }>>([
        { id: 1, text: "", maxCharCount: 100 }
    ]);
    const [correctScore, setCorrectScore] = useState<number>(0);
    const [incorrectScore, setIncorrectScore] = useState<number>(0);
    const [showMaxScore, setShowMaxScore] = useState<boolean>(true);
    const [requireAnswer, setRequireAnswer] = useState<boolean>(false);
    const [stopIfIncorrect, setStopIfIncorrect] = useState<boolean>(false);

    const updateParentData = () => {
        if (onDataChange) {
            const formattedAnswers = answers.map(answer => ({
                body: answer.text,
                maxCharCount: answer.maxCharCount
            }));

            onDataChange({
                answers: formattedAnswers,
                correctScore,
                incorrectScore,
                showMaxScore,
                requireAnswer,
                stopIfIncorrect
            });
        }
    };

    const addAnswer = () => {
        const newId = answers.length + 1;
        setAnswers([...answers, { id: newId, text: "", maxCharCount: 100 }]);
        updateParentData();
    };

    const deleteAnswer = (id: number) => {
        if (answers.length > 1) {
            const updatedAnswers = answers.filter(answer => answer.id !== id);
            setAnswers(updatedAnswers);
            updateParentData();
        }
    };

    const handleAnswerChange = (id: number, text: string) => {
        const updatedAnswers = answers.map(answer =>
            answer.id === id ? { ...answer, text } : answer
        );
        setAnswers(updatedAnswers);
        updateParentData();
    };

    const handleMaxCharCountChange = (id: number, maxCharCount: number) => {
        const updatedAnswers = answers.map(answer =>
            answer.id === id ? { ...answer, maxCharCount } : answer
        );
        setAnswers(updatedAnswers);
        updateParentData();
    };

    const handleScoreChange = (type: 'correct' | 'incorrect', value: number) => {
        if (type === 'correct') {
            setCorrectScore(value);
        } else {
            setIncorrectScore(value);
        }
        updateParentData();
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
        updateParentData();
    };

    useEffect(() => {
        if (initialData) {
            const shortAnswers = initialData.answers.map((answer, index) => ({
                id: index + 1,
                text: answer.body,
                maxCharCount: answer.maxCharCount
            }));
            setAnswers(shortAnswers);
            setCorrectScore(initialData.correctScore);
            setIncorrectScore(initialData.incorrectScore);
            setShowMaxScore(initialData.showMaxScore);
            setRequireAnswer(initialData.requireAnswer);
            setStopIfIncorrect(initialData.stopIfIncorrect);
        }
    }, [initialData]);

    return (
        <>
            <div style={{ padding: 10 }}>
                <Typography variant="h5">
                    Ответ
                </Typography>
            </div>
            <Typography variant="h6" style={{ padding: 10 }}>
                Добавьте ответ на вопрос. Респондент должен будет вписать краткий ответ в поле.
            </Typography>
            <div style={{ width: "95%", margin: "auto", float: 'left' }}>
                {answers.map((answer) => (
                    <React.Fragment key={answer.id}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <TextField
                                style={{ width: '39%', marginRight: 30, marginLeft: 5 }}
                                id={`answer-${answer.id}`}
                                label="Ответ"
                                type="text"
                                variant="standard"
                                value={answer.text}
                                onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                            />
                            <TextField
                                style={{ width: '39%' }}
                                id={`max-chars-${answer.id}`}
                                label="Максимальное количество символов в ответе"
                                type="number"
                                variant="standard"
                                value={answer.maxCharCount}
                                onChange={(e) => handleMaxCharCountChange(answer.id, Number(e.target.value))}
                            />
                            {answers.length > 1 && (
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => deleteAnswer(answer.id)}
                                    style={{ marginLeft: 10 }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </div>
                    </React.Fragment>
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
            <div
                style={{
                    background: "#e3e3e3",
                    width: "81%",
                    borderRadius: 10,
                    marginLeft: 5,
                    padding: 20,
                    marginTop: 20,
                    marginBottom: 20,
                }}
            >
                <div style={{ display: "flex" }}>
                    <InfoIcon />
                    <Typography
                        variant="h6"
                        color="textSecondary"
                        style={{ marginLeft: 5, marginBottom: 5 }}
                    >
                        Определите оценку за правильный ответ. Также можно назначить отрицательные баллы
                        за неправильные ответы. Если вы не хотите этого делать, введите 0 (ноль) в качестве
                        оценки за этот ответ.
                    </Typography>
                </div>
            </div>
            <div style={{ marginBottom: 20, marginLeft: 5 }}>
                <TextField
                    style={{ width: "39%", marginRight: 30 }}
                    id="outlined-number"
                    label="Балл за правильный ответ"
                    type="number"
                    variant="standard"
                    value={correctScore}
                    onChange={(e) => handleScoreChange('correct', Number(e.target.value))}
                />
                <TextField
                    style={{ width: "39%" }}
                    id="outlined-number"
                    label="Баллов за неправильный ответ"
                    type="number"
                    variant="standard"
                    value={incorrectScore}
                    onChange={(e) => handleScoreChange('incorrect', Number(e.target.value))}
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

export default ShortAnswer;
