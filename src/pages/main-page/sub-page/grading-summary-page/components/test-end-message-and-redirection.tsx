import React, { useState } from 'react';
import { FormControlLabel, FormGroup, Switch, TextField, Typography, Button, Snackbar, Alert } from '@mui/material';
import MainCard from '../../../../../components/MainCard';
import JoditEditor from "jodit-react";
import InfoIcon from '@mui/icons-material/Info';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../../..';


const TestEndMessageAndRedirection = observer(() => {
    const { settingsNewTestStore } = React.useContext(Context);
    const { getTestById, testMainInfo } = settingsNewTestStore;
    const { id } = useParams<{ id: string }>();
    const [goodbyeMessage, setGoodbyeMessage] = React.useState("");
    const [goodbyeMessageAbstract, setGoodbyeMessageAbstract] = React.useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    React.useEffect(() => {
        if (id) {
            getTestById(Number(id));
        }
    }, [id]);

    React.useEffect(() => {
        if (testMainInfo) {
            setGoodbyeMessage(testMainInfo.goodbye_message || "");
            setGoodbyeMessageAbstract((testMainInfo.goodbye_message || "").replace(/<[^>]*>/g, ''));
        }
    }, [testMainInfo]);

    const handleEditorChange = (newContent: string) => {
        setGoodbyeMessage(newContent);
        setGoodbyeMessageAbstract(newContent.replace(/<[^>]*>/g, ''));
    };

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };
    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleSave = async () => {
        const test = testMainInfo;

        if (!test?.id) return;
        const payload = {
            title: test.title,
            description: test.description,
            category_id: test.category_id,
            creator_id: test.creator_id,
            access_timestamp: test.access_timestamp,
            status: test.status_name,
            status_id: test.status_id,
            status_name: test.status_name,
            status_name_ru: test.status_name_ru || '',
            status_color: test.status_color || '',
            frozen: test.frozen,
            locale_id: test.locale_id,
            time_limit: test.time_limit,
            img_id: test.img_id || 0,
            goodbye_message: goodbyeMessage,
            goodbye_message_abstract: goodbyeMessageAbstract
        };
        try {
            await settingsNewTestStore.updateTest(payload, test.id);
            showAlert('Сообщение успешно сохранено', 'success');
        } catch (e) {
            showAlert('Ошибка при сохранении сообщения', 'error');
        }
    };
    const editor = React.useRef(null);
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
                    Сообщение по завершении теста
                </Typography>
                <Typography variant="h6" color="textSecondary" style={{ marginRight: 10, marginBottom: 20 }}>
                    Настройте сообщение, которое будет отображаться всем участникам по завершении теста, независимо от его результатов.
                </Typography>
                <JoditEditor
                    ref={editor}
                    value={goodbyeMessage}
                    onChange={handleEditorChange}
                    onBlur={handleSave}
                />
                <div style={{ marginTop: 20, opacity: 0.1, display: 'none' }}>
                    <FormGroup>
                        <FormControlLabel
                            disabled
                            control={<Switch checked={isRedirectionEnabled} onChange={handleSwitchChange} />}
                            label="Установить перенаправление на внешний сайт в конце теста"
                        />
                    </FormGroup>
                </div>
                {isRedirectionEnabled && ( // Условное отображение секции
                    <>
                        <div style={{ display: 'none', opacity: 0.1, background: '#e3e3e3', width: '100%', borderRadius: 10, padding: 20, marginTop: 20 }}>
                            <div style={{ display: 'flex' }}>
                                <InfoIcon />
                                <Typography variant="h6" color="textSecondary" style={{ marginLeft: 5, marginBottom: 5 }}>
                                    Введите полный адрес веб-сайта (включая http/https).
                                </Typography>
                            </div>

                        </div>
                        <TextField
                            disabled
                            id="outlined-basic"
                            style={{ display: 'none', width: '100%', marginTop: 20, opacity: 0.1, }}
                            label="Веб-сайт"
                            variant="outlined"
                            value={inputValue}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: MAX_LENGTH }} // Ограничение количества символов
                            helperText={`${inputValue.length}/${MAX_LENGTH} символов`} // Отображение количества символов внутри TextField
                        />
                    </>

                )}
                <Button
                    variant='contained'
                    color='success'
                    style={{ textTransform: 'none',marginTop: 20, }}
                    onClick={handleSave}
                >
                    сохранить
                </Button>
            </MainCard>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
})
export default TestEndMessageAndRedirection;
