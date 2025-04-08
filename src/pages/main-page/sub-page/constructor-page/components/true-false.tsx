import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Radio, Typography, TextField, FormGroup, FormControlLabel, Switch } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import JoditEditor from "jodit-react";

const TrueFalse = observer(() => {
    const [selectedValue, setSelectedValue] = useState<string>(""); // Текущее выбранное значение

    // Обработка изменений радиокнопки
    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
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
                {/* Вариант "ДА" */}
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
                {/* Вариант "НЕТ" */}
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
                />
                <TextField
                    style={{ width: "39%" }}
                    id="outlined-number"
                    label="Баллов за неправильный ответ"
                    type="number"
                    variant="standard"
                    helperText="Внимание! Количество баллов должно быть отрицательным или нулевым. Отрицательные значения должны включать знак минус, например, -1."
                />
            </div>
            <div>
                <FormGroup>
                    <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Показать максимально возможный балл за этот вопрос"
                    />
                    <FormControlLabel
                        control={<Switch />}
                        label="Заставьте респондента ответить на этот вопрос при первом показе"
                    />
                    <FormControlLabel
                        control={<Switch />}
                        label="Прекратите тест, если ответ на этот вопрос неверный."
                    />
                </FormGroup>
            </div>
        </>
    );
});

export default TrueFalse;
