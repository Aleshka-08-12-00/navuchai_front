import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Radio, Typography, TextField, FormGroup, FormControlLabel, Switch } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import JoditEditor from "jodit-react";

interface TrueFalseProps {
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
}

const TrueFalse = observer(({ onDataChange }: TrueFalseProps) => {
    const [selectedValue, setSelectedValue] = useState<string>(""); // Current selected value
    const [correctScore, setCorrectScore] = useState<number>(0);
    const [incorrectScore, setIncorrectScore] = useState<number>(0);
    const [showMaxScore, setShowMaxScore] = useState<boolean>(true);
    const [requireAnswer, setRequireAnswer] = useState<boolean>(false);
    const [stopIfIncorrect, setStopIfIncorrect] = useState<boolean>(false);

    // Handle radio button changes
    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
        updateParentData(value);
    };

    const updateParentData = (selected: string) => {
        if (onDataChange) {
            const answers = [
                { body: "ДА", correct: selected === "yes" },
                { body: "НЕТ", correct: selected === "no" }
            ];

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
        updateParentData(selectedValue);
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
        updateParentData(selectedValue);
    };

    return (
        <>
            <div style={{ padding: 10 }}>
                <Typography variant="h5">Ответ</Typography>
            </div>
            <Typography variant="h6" style={{ padding: 10 }}>
                Выберите правильный ответ, за который будут начислены баллы
            </Typography>
            <div style={{ width: "95%", margin: "auto", display: "flex", alignItems: "center", flexDirection: "column" }}>
                {/* "ДА" option */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    <Radio
                        checked={selectedValue === "yes"}
                        onChange={() => handleRadioChange("yes")}
                        value="yes"
                        name="true-false-group"
                        inputProps={{ "aria-label": "Да" }}
                        style={{ marginTop: "-10%", outline: "none", boxShadow: "none" }}
                        sx={{
                            "&:hover": {
                                backgroundColor: "transparent",
                            },
                        }}
                    />
                    <JoditEditor
                        value="ДА"
                        onBlur={() => { }}
                    />
                </div>
                {/* "НЕТ" option */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                    <Radio
                        checked={selectedValue === "no"}
                        onChange={() => handleRadioChange("no")}
                        value="no"
                        name="true-false-group"
                        inputProps={{ "aria-label": "Нет" }}
                        style={{ marginTop: "-10%", outline: "none", boxShadow: "none" }}
                        sx={{
                            "&:hover": {
                                backgroundColor: "transparent",
                            },
                        }}
                    />
                    <JoditEditor
                        value="НЕТ"
                        onBlur={() => { }}
                    />
                </div>
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
        </>
    );
});

export default TrueFalse;
