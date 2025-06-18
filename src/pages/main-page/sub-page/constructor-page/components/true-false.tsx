import React, { useRef, useState, useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Radio, Typography, TextField, FormGroup, FormControlLabel, Switch } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

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

const TrueFalse = observer(({ onDataChange, initialData }: TrueFalseProps) => {
    const prevDataRef = useRef<any>(null);
    const isInitializedRef = useRef<boolean>(false);
    
    // Функция для очистки HTML-тегов
    const stripHtmlTags = (html: string): string => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const [options, setOptions] = useState<Array<{ id: number; content: string; correct: boolean }>>([]);
    const [correctScore, setCorrectScore] = useState<number>(0);
    const [incorrectScore, setIncorrectScore] = useState<number>(0);
    const [showMaxScore, setShowMaxScore] = useState<boolean>(true);
    const [requireAnswer, setRequireAnswer] = useState<boolean>(false);
    const [stopIfIncorrect, setStopIfIncorrect] = useState<boolean>(false);

    // Инициализация состояния из initialData
    useEffect(() => {
        // Инициализируем только один раз при первом рендере
        if (!isInitializedRef.current) {
            if (initialData) {
                const trueFalseOptions = initialData.answers.map((answer, index) => ({
                    id: index + 1,
                    content: stripHtmlTags(answer.body),
                    correct: answer.correct
                }));
                setOptions(trueFalseOptions);
                setCorrectScore(initialData.correctScore);
                setIncorrectScore(initialData.incorrectScore);
                setShowMaxScore(initialData.showMaxScore);
                setRequireAnswer(initialData.requireAnswer);
                setStopIfIncorrect(initialData.stopIfIncorrect);
            } else {
                // Устанавливаем значения по умолчанию, если initialData не предоставлен
                setOptions([
                    { id: 1, content: "ДА", correct: false },
                    { id: 2, content: "НЕТ", correct: false }
                ]);
            }
            isInitializedRef.current = true;
        }
    }, []); // Убираем initialData из зависимостей

    // Обновление родительского компонента при изменении состояния
    useEffect(() => {
        if (onDataChange && isInitializedRef.current) {
            const currentData = {
                answers: options.map(option => ({
                    body: option.content,
                    correct: option.correct
                })),
                correctScore,
                incorrectScore,
                showMaxScore,
                requireAnswer,
                stopIfIncorrect
            };

            // Проверяем, изменились ли данные
            const prevData = prevDataRef.current;
            if (!prevData || JSON.stringify(prevData) !== JSON.stringify(currentData)) {
                prevDataRef.current = currentData;
                onDataChange(currentData);
            }
        }
    }, [options, correctScore, incorrectScore, showMaxScore, requireAnswer, stopIfIncorrect, onDataChange]);

    const handleRadioChange = useCallback((id: number) => {
        setOptions(prev => prev.map(option => ({
            ...option,
            correct: option.id === id
        })));
    }, []);

    const handleScoreChange = useCallback((type: 'correct' | 'incorrect', value: string) => {
        const numValue = value === '' ? 0 : Number(value);
        if (!isNaN(numValue)) {
            if (type === 'correct') {
                setCorrectScore(numValue);
            } else {
                setIncorrectScore(numValue);
            }
        }
    }, []);

    const handleSwitchChange = useCallback((type: 'showMax' | 'require' | 'stop', checked: boolean) => {
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
    }, []);

    return (
        <>
            <div style={{ padding: 10 }}>
                <Typography variant="h5">Ответ</Typography>
            </div>
            <Typography variant="h6" style={{ padding: 10 }}>
                Выберите правильный ответ, за который будут начислены баллы
            </Typography>
            <div style={{ width: "95%", margin: "auto", float: 'left', marginLeft: 10 }}>
                {options.map((option) => (
                    <div 
                        key={`option-${option.id}`} 
                        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
                    >
                        <Radio
                            checked={option.correct}
                            onChange={() => handleRadioChange(option.id)}
                            value={`option-${option.id}`}
                            name="true-false-group"
                            inputProps={{ "aria-label": `Option ${option.id}` }}
                            sx={{
                                "&:hover": {
                                    backgroundColor: "transparent",
                                },
                            }}
                        />
                        <Typography variant="body1" style={{ marginLeft: 8 }}>
                            {option.content}
                        </Typography>
                    </div>
                ))}
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
                    id="correct-score-field"
                    name="correctScore"
                    style={{ width: "39%", marginRight: 30, marginLeft: 5 }}
                    label="Балл за правильный ответ"
                    type="number"
                    variant="standard"
                    value={correctScore}
                    onChange={(e) => handleScoreChange('correct', e.target.value)}
                />
                <TextField
                    id="incorrect-score-field"
                    name="incorrectScore"
                    style={{ width: "39%" }}
                    label="Баллов за неправильный ответ"
                    type="number"
                    variant="standard"
                    value={incorrectScore}
                    onChange={(e) => handleScoreChange('incorrect', e.target.value)}
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
