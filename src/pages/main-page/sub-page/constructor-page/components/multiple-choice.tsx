import React, { useRef, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, IconButton, Checkbox, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import JoditEditor from "jodit-react";
import InfoIcon from '@mui/icons-material/Info';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface MultipleChoiceProps {
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

const MultipleChoice = observer(({ onDataChange, initialData }: MultipleChoiceProps) => {
    const editorRefs = useRef<Map<number, any>>(new Map());
    const [options, setOptions] = useState<Array<{ id: number; content: string; correct: boolean }>>([
        { id: 1, content: "", correct: false },
        { id: 2, content: "", correct: false }
    ]);
    const [correctScore, setCorrectScore] = useState<number>(0);
    const [incorrectScore, setIncorrectScore] = useState<number>(0);
    const [showMaxScore, setShowMaxScore] = useState<boolean>(true);
    const [requireAnswer, setRequireAnswer] = useState<boolean>(false);
    const [stopIfIncorrect, setStopIfIncorrect] = useState<boolean>(false);

    useEffect(() => {
        if (initialData) {
            const multipleOptions = initialData.answers.map((answer, index) => ({
                id: index + 1,
                content: answer.body,
                correct: answer.correct
            }));
            setOptions(multipleOptions);
            setCorrectScore(initialData.correctScore);
            setIncorrectScore(initialData.incorrectScore);
            setShowMaxScore(initialData.showMaxScore);
            setRequireAnswer(initialData.requireAnswer);
            setStopIfIncorrect(initialData.stopIfIncorrect);
        }
    }, [initialData]);

    const updateParentData = () => {
        if (onDataChange) {
            const answers = options.map(option => ({
                body: option.content,
                correct: option.correct
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

    const addOption = () => {
        const newId = options.length + 1;
        const updatedOptions = [...options, { id: newId, content: "", correct: false }];
        setOptions(updatedOptions);
        updateParentData();
    };

    const deleteOption = (id: number) => {
        if (options.length > 2) {
            const updatedOptions = options.filter(option => option.id !== id);
            setOptions(updatedOptions);
            updateParentData();
        }
    };

    const handleEditorChange = (id: number, newContent: string) => {
        const updatedOptions = options.map(option =>
            option.id === id ? { ...option, content: newContent } : option
        );
        setOptions(updatedOptions);
        updateParentData();
    };

    const handleCheckboxChange = (id: number, checked: boolean) => {
        const updatedOptions = options.map(option =>
            option.id === id ? { ...option, correct: checked } : option
        );
        setOptions(updatedOptions);
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

    return (
        <>
            <div style={{ padding: 10 }}>
                <Typography variant="h5">Ответ</Typography>
            </div>
            <Typography variant="h6" style={{ padding: 10 }}>
                Добавьте список ответов. Респонденты смогут выбрать несколько вариантов.
            </Typography>
            <div style={{ width: "95%", margin: "auto", float: 'left', marginLeft: 10 }}>
                {options.map((option) => (
                    <React.Fragment key={option.id}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                            <Checkbox
                                checked={option.correct}
                                onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
                                style={{ marginTop: "-10%" }}
                            />
                            <div style={{ flexGrow: 1 }}>
                                <JoditEditor
                                    ref={(ref) => editorRefs.current.set(option.id, ref)}
                                    value={option.content}
                                    onBlur={(newContent) => handleEditorChange(option.id, newContent)}
                                />
                            </div>
                            {options.length > 2 && (
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => deleteOption(option.id)}
                                    style={{ marginLeft: "10px", marginTop: "-10%" }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </div>
                    </React.Fragment>
                ))}
                <div style={{ textAlign: "left", marginBottom: 40 }}>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={addOption}
                        style={{ textTransform: "none", marginLeft: 45 }}
                    >
                        Добавить ответ
                    </Button>
                </div>
                <div style={{ padding: 10 }}>
                    <Typography variant="h5">Настройки баллов</Typography>
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
                <div style={{ marginBottom: 20 }}>
                    <TextField
                        style={{ width: "39%", marginRight: 30, marginLeft: 5 }}
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
            </div>
        </>
    );
});

export default MultipleChoice;
