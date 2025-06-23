import React, { useEffect, useRef, useState, useContext } from 'react';
import { Typography, Button, Snackbar, Alert } from '@mui/material';
import MainCard from '../../../../../components/MainCard';
import JoditEditor from "jodit-react";
import { Context } from '../../../../..';
import { useParams } from 'react-router-dom';

const InstructionsForRespondents: React.FC = () => {
    const { settingsNewTestStore } = useContext(Context);
    const { getTestById, testMainInfo, updateTest } = settingsNewTestStore;
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const { id } = useParams<{ id: string }>();

    // --- ALERT STATE ---
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };
    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    useEffect(() => {
        if (id) {
            getTestById(Number(id));
        }
    }, [id]);

    useEffect(() => {
        if (testMainInfo) {
            setContent(testMainInfo.welcome_message || "");
        }
    }, [testMainInfo]);

    const handleEditorChange = (newContent: string) => {
        setContent(newContent);
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
            welcome_message: content,
            goodbye_message: test.goodbye_message || '',
        };
        try {
            await updateTest(payload, test.id);
            showAlert('Инструкции успешно сохранены', 'success');
        } catch (e) {
            showAlert('Ошибка при сохранении инструкций', 'error');
        }
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
                    onChange={handleEditorChange}
                    onBlur={handleSave}
                />
                <Button
                    variant='contained'
                    color='success'
                    style={{ textTransform: 'none', marginTop: 20 }}
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
};

export default InstructionsForRespondents;
