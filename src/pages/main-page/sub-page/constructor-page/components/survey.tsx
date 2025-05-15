import React, { useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Button, FormControlLabel, FormGroup, IconButton, Switch, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import JoditEditor from "jodit-react";
import InfoIcon from "@mui/icons-material/Info";

interface SurveyAnswersProps {
    onDataChange?: (data: {
        answers: Array<{
            body: string;
            points: number;
        }>;
        correctScore: number;
        incorrectScore: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    }) => void;
}

const SurveyAnswers = observer(({ onDataChange }: SurveyAnswersProps) => {
    const editorRefs = useRef<Map<number, any>>(new Map());
    const [options, setOptions] = useState<{ id: number; content: string; points: number }[]>([
        { id: 1, content: "Option 1", points: 0 },
        { id: 2, content: "Option 2", points: 0 },
    ]);
    const [correctScore, setCorrectScore] = useState<number>(0);
    const [incorrectScore, setIncorrectScore] = useState<number>(0);
    const [showMaxScore, setShowMaxScore] = useState<boolean>(true);
    const [requireAnswer, setRequireAnswer] = useState<boolean>(false);
    const [stopIfIncorrect, setStopIfIncorrect] = useState<boolean>(false);

    const updateParentData = () => {
        if (onDataChange) {
            const answers = options.map(option => ({
                body: option.content,
                points: option.points
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

    // Add a new answer option
    const addOption = () => {
        const newId = options.length + 1;
        const updatedOptions = [...options, { id: newId, content: "", points: 0 }];
        setOptions(updatedOptions);
        updateParentData();
    };

    // Delete an answer option
    const deleteOption = (id: number) => {
        const updatedOptions = options.filter((option) => option.id !== id);
        setOptions(updatedOptions);
        updateParentData();
    };

    // Update the content in the editor for an answer option
    const handleEditorChange = (id: number, newContent: string) => {
        const updatedOptions = options.map((option) =>
            option.id === id ? { ...option, content: newContent } : option
        );
        setOptions(updatedOptions);
        updateParentData();
    };

    // Update the number of points for an answer option
    const handlePointsChange = (id: number, newPoints: number) => {
        const updatedOptions = options.map((option) =>
            option.id === id ? { ...option, points: newPoints } : option
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
                Добавьте список ответов. Респонденты смогут выбрать только один.
            </Typography>
            <div style={{ width: "95%", margin: "auto", float: 'left', marginLeft: 10 }}>
                {options.map((option, index) => (
                    <React.Fragment key={option.id}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <JoditEditor
                                ref={(ref) => editorRefs.current.set(option.id, ref)}
                                value={option.content}
                                onBlur={(newContent) => handleEditorChange(option.id, newContent)}
                            />
                            <IconButton 
                                aria-label="delete" 
                                onClick={() => deleteOption(option.id)} 
                                style={{
                                    marginLeft: "10px",
                                    marginTop: "-15%",
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                        <TextField
                            label="Количество баллов за этот ответ"
                            type="number"
                            value={option.points}
                            onChange={(e) => handlePointsChange(option.id, Number(e.target.value))}
                            style={{ flexGrow: 1, marginRight: 10, width: '95%', marginBottom: 30 }}
                            variant="outlined"
                        />
                    </React.Fragment>
                ))}
                <div style={{ textAlign: "left", marginBottom: 40 }}>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<AddIcon />}
                        onClick={addOption}
                        style={{ textTransform: "none" }}
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
                <div style={{ marginBottom: 20 }}>
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

export default SurveyAnswers;
