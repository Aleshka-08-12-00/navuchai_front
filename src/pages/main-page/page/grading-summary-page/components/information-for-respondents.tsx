import React, { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Switch, TextField, Typography } from '@mui/material';
import MainCard from '../../../../../components/MainCard';
import JoditEditor from "jodit-react";
import InfoIcon from '@mui/icons-material/Info';

const InformationRorRespondents: React.FC = () => {
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
                    Информация для респондентов
                </Typography>
                <Typography variant="h6" color="textSecondary" style={{ marginRight: 10, marginBottom: 20 }}>
                    Выберите, какую информацию показывать респондентам в конце теста.
                </Typography>
                <div style={{ background: '#e3e3e3', width: '100%', borderRadius: 10, padding: 20, marginTop: 20 }}>
                    <div style={{ display: 'flex' }}>
                        <InfoIcon />
                        <Typography variant="h6" color="textSecondary" style={{ marginLeft: 5, marginBottom: 5 }}>
                            Двухфазная обратная связь
                        </Typography>
                    </div>
                    <Typography variant="h6" color="textSecondary" style={{ marginLeft: 5, marginBottom: 5 }}>
                        Вы можете изначально скрыть часть информации от респондентов. После просмотра всех результатов вы можете раскрыть остальную часть.
                    </Typography>
                </div>
                <FormGroup style={{marginTop: 20}}>
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Процентный балл" />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Баллы в единицах" />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Оценка" />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Описательная оценка" />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Правильные ответы на вопросы" />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Сообщение о прохождении или провале" />
                </FormGroup>
                <div style={{ marginTop: 20 }}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={isRedirectionEnabled} onChange={handleSwitchChange} />}
                            label="Сообщить респонденту о результате по электронной почте"
                        />
                    </FormGroup>
                </div>
            </MainCard>
        </div>
    );
};

export default InformationRorRespondents;
