import React, { useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Button, FormControlLabel, FormGroup, IconButton, Switch, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import JoditEditor from "jodit-react";
import InfoIcon from "@mui/icons-material/Info";

const SurveyAnswers = observer(() => {
    const editorRefs = useRef<Map<number, any>>(new Map()); // References for editors
    const [options, setOptions] = useState<{ id: number; content: string; points: number }[]>([
        { id: 1, content: "Option 1", points: 0 },
        { id: 2, content: "Option 2", points: 0 },
    ]);

    // Add a new answer option
    const addOption = () => {
        const newId = options.length + 1;
        setOptions([...options, { id: newId, content: "", points: 0 }]);
    };

    // Delete an answer option
    const deleteOption = (id: number) => {
        const updatedOptions = options.filter((option) => option.id !== id);
        setOptions(updatedOptions);
    };

    // Update the content in the editor for an answer option
    const handleEditorChange = (id: number, newContent: string) => {
        const updatedOptions = options.map((option) =>
            option.id === id ? { ...option, content: newContent } : option
        );
        setOptions(updatedOptions);
    };

    // Update the number of points for an answer option
    const handlePointsChange = (id: number, newPoints: number) => {
        const updatedOptions = options.map((option) =>
            option.id === id ? { ...option, points: newPoints } : option
        );
        setOptions(updatedOptions);
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
                    <>
                        <div
                            key={index}
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
                            <IconButton aria-label="delete" onClick={() => deleteOption(option.id)} style={{
                                marginLeft: "10px",
                                marginTop: "-15%",
                            }}>
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
                    </>

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
                <div style={{marginBottom: 20}}>
                    <FormGroup>
                        <FormControlLabel control={<Switch defaultChecked />} label="Показать максимально возможный балл за этот вопрос" />
                        <FormControlLabel control={<Switch />} label="Заставьте респондента ответить на этот вопрос при первом показе" />
                        <FormControlLabel control={<Switch />} label="Прекратите тест, если ответ на этот вопрос неверный." />
                    </FormGroup>
                </div>


            </div>
        </>
    );
});

export default SurveyAnswers;
