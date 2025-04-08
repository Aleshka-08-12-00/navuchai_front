import React, { useState } from 'react';
import { FormControlLabel, FormGroup, Switch, TextField, Typography } from '@mui/material';
import MainCard from '../../../../../components/MainCard';
import JoditEditor from "jodit-react";
import InfoIcon from '@mui/icons-material/Info';

const TestEndMessageAndRedirection: React.FC = () => {
    const editor = React.useRef(null);
    const [content, setContent] = React.useState("Здравствуйте! Этот тест состоит из 7 вопросов. Время на решение одного вопроса — 2 минуты. Убедитесь, что у вас достаточно времени, а затем приступайте к тесту. Удачи!");
    const [isRedirectionEnabled, setIsRedirectionEnabled] = useState<boolean>(true); // Состояние переключателя
    const [inputValue, setInputValue] = useState<string>("");

    const MAX_LENGTH = 1000; // Максимальное количество символов

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsRedirectionEnabled(event.target.checked);
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <Typography variant="h5" color="textSecondary" style={{ marginBottom: 10 }}>
                    Инструкции для респондентов
                </Typography>
                <Typography variant="h6" color="textSecondary" style={{ marginRight: 10, marginBottom: 20 }}>
                    Предоставьте инструкции по тестированию, которые будут отображаться респондентам на начальной странице теста.
                </Typography>
                <JoditEditor
                    ref={editor}
                    value={content}
                    onBlur={(newContent) => setContent(newContent)}
                />
                <div style={{ marginTop: 20 }}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={isRedirectionEnabled} onChange={handleSwitchChange} />}
                            label="Установить перенаправление на внешний сайт в конце теста"
                        />
                    </FormGroup>
                </div>
                {isRedirectionEnabled && ( // Условное отображение секции
                    <>
                        <div style={{ background: '#e3e3e3', width: '100%', borderRadius: 10, padding: 20, marginTop: 20 }}>
                            <div style={{ display: 'flex' }}>
                                <InfoIcon />
                                <Typography variant="h6" color="textSecondary" style={{ marginLeft: 5, marginBottom: 5 }}>
                                    Введите полный адрес веб-сайта (включая http/https).
                                </Typography>
                            </div>

                        </div>
                        <TextField
                            id="outlined-basic"
                            style={{ width: '100%', marginTop: 20 }}
                            label="Веб-сайт"
                            variant="outlined"
                            value={inputValue}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: MAX_LENGTH }} // Ограничение количества символов
                            helperText={`${inputValue.length}/${MAX_LENGTH} символов`} // Отображение количества символов внутри TextField
                        />
                    </>

                )}
            </MainCard>
        </div>
    );
};

export default TestEndMessageAndRedirection;
