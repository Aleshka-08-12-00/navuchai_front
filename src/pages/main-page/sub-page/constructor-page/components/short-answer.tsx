import React, { useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, IconButton, Radio, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import JoditEditor from "jodit-react";
import InfoIcon from '@mui/icons-material/Info';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const ShortAnswer = observer(() => {
    const editorRefs = useRef<Map<number, any>>(new Map()); // Хранилище ссылок на редакторы
    const [contentList, setContentList] = useState<string[]>([""]); // Список контента
    const [selectedValue, setSelectedValue] = useState<string>(""); // Текущее выбранное значение

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


    // Обновление контента в редакторе
    const handleEditorChange = (index: number, newContent: string) => {
        const updatedContent = [...contentList];
        updatedContent[index] = newContent;
        setContentList(updatedContent);
    };

    return (
        <>
            <div style={{ padding: 10 }}>
                <Typography variant="h5"  >
                    Ответ
                </Typography>

            </div>
            <Typography variant="h6" style={{ padding: 10 }}>
                Добавьте ответ на вопрос. Респондент должен будет вписать краткий ответ в поле.
            </Typography>
            <div style={{ width: "95%", margin: "auto", float: 'left' }}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <TextField
                        style={{ width: '39%', marginRight: 30, marginLeft: 5 }}
                        id="outlined-text"
                        label="Ответ"
                        type="text"
                        variant="standard"
                    />
                    <TextField
                        style={{ width: '39%'}}
                        id="outlined-number"
                        label="Максимальное количество символов в ответе"
                        type="number"
                        variant="standard"
                    />
                </div>
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
                <Typography variant="h5"  >
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
                    <Typography variant="h6" color="textSecondary" style={{ marginLeft: 5, marginBottom: 5 }}  >
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
                    variant="outlined"
                />
                <TextField
                    style={{ width: '39%' }}
                    id="outlined-number"
                    label="Баллов за неправильный ответ"
                    type="number"
                    variant="outlined"
                    helperText="Внимание! Количество баллов должно быть отрицательным или нулевым. Отрицательные значения должны включать знак минус, например, -1."
                />
            </div>
            <div>
                <FormGroup>
                    <FormControlLabel control={<Switch defaultChecked />} label="Показать максимально возможный балл за этот вопрос" />
                    <FormControlLabel control={<Switch />} label="Заставьте респондента ответить на этот вопрос при первом показе" />
                    <FormControlLabel control={<Switch />} label="Прекратите тест, если ответ на этот вопрос неверный." />
                </FormGroup>
            </div>
        </>
    );
});

export default ShortAnswer;
