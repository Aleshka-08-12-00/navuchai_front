import React, { useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Button, Checkbox, IconButton, Typography, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import JoditEditor from "jodit-react";

const MultipleChoice = observer(() => {
    const editorRefs = useRef<Map<number, any>>(new Map());
    const [options, setOptions] = useState<{ id: number; content: string; points: number; selected: boolean }[]>([
        { id: 1, content: "Option 1", points: 0, selected: false },
        { id: 2, content: "Option 2", points: 0, selected: false },
    ]);

    const addOption = () => {
        const newId = options.length + 1;
        setOptions([...options, { id: newId, content: "", points: 0, selected: false }]);
    };

    const deleteOption = (id: number) => {
        setOptions(options.filter((option) => option.id !== id));
    };

    const handleEditorChange = (id: number, newContent: string) => {
        setOptions(options.map(option => option.id === id ? { ...option, content: newContent } : option));
    };

    const handlePointsChange = (id: number, newPoints: number) => {
        setOptions(options.map(option => option.id === id ? { ...option, points: newPoints } : option));
    };

    const handleSelectionChange = (id: number) => {
        setOptions(options.map(option => option.id === id ? { ...option, selected: !option.selected } : option));
    };

    return (
        <>
            <div style={{ padding: 10 }}>
                <Typography variant="h5">Ответ</Typography>
            </div>
            <Typography variant="h6" style={{ padding: 10 }}>
                Добавьте список ответов. Респонденты смогут выбрать несколько вариантов ответа и указать баллы.
            </Typography>
            <div style={{ width: "95%", margin: "auto", float: 'left', marginLeft: 10 }}>
                {options.map((option) => (
                    <div key={option.id} style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Checkbox
                                style={{marginRight: 10}}
                                checked={option.selected}
                                onChange={() => handleSelectionChange(option.id)}
                            />
                            <JoditEditor
                                ref={(ref) => editorRefs.current.set(option.id, ref)}
                                value={option.content}
                                onBlur={(newContent) => handleEditorChange(option.id, newContent)}
                            />
                            <IconButton aria-label="delete" onClick={() => deleteOption(option.id)} style={{ marginLeft: "10px" }}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                        <TextField
                            label="Количество баллов за этот ответ"
                            type="number"
                            value={option.points}
                            onChange={(e) => handlePointsChange(option.id, Number(e.target.value))}
                            style={{ width: '92%', marginTop: 10, marginLeft: 45, marginBottom: 10 }}
                            variant="outlined"
                        />
                    </div>
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
            </div>
        </>
    );
});

export default MultipleChoice;
