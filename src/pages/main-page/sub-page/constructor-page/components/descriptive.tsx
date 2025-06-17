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

interface DescriptiveProps {
    onDataChange?: (data: {
        maxScore: number;
        maxCharCount: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    }) => void;
    initialData?: {
        maxScore: number;
        maxCharCount: number;
        showMaxScore: boolean;
        requireAnswer: boolean;
        stopIfIncorrect: boolean;
    };
}

const Descriptive = observer(({ onDataChange, initialData }: DescriptiveProps) => {
    const editorRefs = useRef<Map<number, any>>(new Map()); // Хранилище ссылок на редакторы
    const [contentList, setContentList] = useState<string[]>([""]); // Список контента
    const [selectedValue, setSelectedValue] = useState<string>(""); // Текущее выбранное значение
    const [maxScore, setMaxScore] = useState<number>(0);
    const [maxCharCount, setMaxCharCount] = useState<number>(0);
    const [showMaxScore, setShowMaxScore] = useState<boolean>(true);
    const [requireAnswer, setRequireAnswer] = useState<boolean>(false);
    const [stopIfIncorrect, setStopIfIncorrect] = useState<boolean>(false);

    useEffect(() => {
        if (initialData) {
            setMaxScore(initialData.maxScore);
            setMaxCharCount(initialData.maxCharCount);
            setShowMaxScore(initialData.showMaxScore);
            setRequireAnswer(initialData.requireAnswer);
            setStopIfIncorrect(initialData.stopIfIncorrect);
        }
    }, [initialData]);

    // Отдельный useEffect для обновления родительского компонента
    useEffect(() => {
        if (initialData && onDataChange) {
            onDataChange({
                maxScore: initialData.maxScore,
                maxCharCount: initialData.maxCharCount,
                showMaxScore: initialData.showMaxScore,
                requireAnswer: initialData.requireAnswer,
                stopIfIncorrect: initialData.stopIfIncorrect
            });
        }
    }, [initialData, onDataChange]);

    // Добавление нового элемента
    const addAnswer = () => {
        setContentList([...contentList, ""]);
    };

    // Удаление элемента
    const deleteAnswer = (index: number) => {
        const updatedContent = contentList.filter((_, i) => i !== index);
        setContentList(updatedContent);

        // Если удалён выбранный элемент, сбросить выбор
        if (selectedValue === `option-${index}`) {
            setSelectedValue("");
        }
    };

    // Обработка изменений радиокнопки
    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
    };

    // Обновление контента в редакторе
    const handleEditorChange = (index: number, newContent: string) => {
        const updatedContent = [...contentList];
        updatedContent[index] = newContent;
        setContentList(updatedContent);
    };

    const updateParentData = () => {
        if (onDataChange) {
            onDataChange({
                maxScore,
                maxCharCount,
                showMaxScore,
                requireAnswer,
                stopIfIncorrect
            });
        }
    };

    const handleMaxScoreChange = (value: number) => {
        setMaxScore(value);
        updateParentData();
    };

    const handleMaxCharCountChange = (value: number) => {
        setMaxCharCount(value);
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
                        Вам придется самостоятельно оценить ответы на описательные вопросы после теста.
                        Ниже вы можете установить максимальный балл за этот вопрос.
                    </Typography>
                </div>
            </div>

            <div style={{ marginBottom: 20 }}>
                <TextField
                    style={{ width: '39%', marginRight: 30, marginLeft: 5 }}
                    id="outlined-number"
                    label="Максимальный балл за правильный ответ"
                    type="number"
                    value={maxScore}
                    onChange={(e) => handleMaxScoreChange(Number(e.target.value))}
                    variant="standard"
                />
                <TextField
                    style={{ width: '39%' }}
                    id="outlined-number"
                    label="Максимальное количество символов в ответе"
                    type="number"
                    value={maxCharCount}
                    onChange={(e) => handleMaxCharCountChange(Number(e.target.value))}
                    variant="standard"
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

export default Descriptive;
