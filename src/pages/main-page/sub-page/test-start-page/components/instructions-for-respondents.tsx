import React, { useState } from 'react';
import { Typography } from '@mui/material';
import MainCard from '../../../../../components/MainCard';
import JoditEditor from "jodit-react";


const InstructionsForRespondents: React.FC = () => {
    const editor = React.useRef(null);
    const [content, setContent] = React.useState("Здравствуйте! Этот тест состоит из 7 вопросов. Время на решение одного вопроса — 2 минуты.Убедитесь, что у вас достаточно времени, а затем приступайте к тесту.Удачи!");
    function newContent2(props: any) {
        setContent(props)
    }

    return (
        <div style={{ marginBottom: 20 }}>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <Typography variant="h5" color="textSecondary" style={{ marginBottom: 10 }}   >
                    Инструкции для респондентов
                </Typography>
                <Typography variant="h6" color="textSecondary" style={{ marginRight: 10, marginBottom: 20 }} >
                    Предоставьте инструкции по тестированию, которые будут отображаться респондентам на начальной странице теста.
                </Typography>
                <JoditEditor
                    ref={editor}
                    value={content}
                    // config={config}
                    onBlur={(newContent) => newContent2(newContent)}
                />
            </MainCard>
        </div>
    );
};

export default InstructionsForRespondents;
