import * as React from 'react';
import { observer } from 'mobx-react-lite';
import MainCard from '../../../components/MainCard';
import { Button, IconButton, Typography } from '@mui/material';
import { minWidth, Stack } from '@mui/system';
import { Context } from '../../..';
import JoditEditor from "jodit-react";

const TestStartPage = observer(() => {
    const { settingsStore } = React.useContext(Context);
    const editor = React.useRef(null);
    const [content, setContent] = React.useState("Здравствуйте! Этот тест состоит из 7 вопросов. Время на решение одного вопроса — 2 минуты.Убедитесь, что у вас достаточно времени, а затем приступайте к тесту.Удачи!");
    function newContent2(props: any) {
        setContent(props)
    }


    React.useEffect(() => {

    }, []);

    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Стартовая страница теста
            </Typography>
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

            <div style={{ marginBottom: 20 }}>
                <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                    <>
                        <Typography variant="h5" color="textSecondary" style={{ marginBottom: 10 }}   >
                            Форма начала теста
                        </Typography>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10, marginBottom: 20 }} >
                            Настройте форму начала теста и соберите данные для идентификации респондентов.
                        </Typography>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            // config={config}
                            onBlur={(newContent) => newContent2(newContent)}
                        />
                    </>
                </MainCard>
            </div>
            <div style={{ marginBottom: 20 }}>
                <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                    <>
                        <Typography variant="h5" color="textSecondary" style={{ marginBottom: 10 }}   >
                        Согласие
                        </Typography>
                        <Typography variant="h6" color="textSecondary" style={{ marginRight: 10, marginBottom: 20 }} >
                        Если для прохождения теста требуется согласие или одобрение респондентов, укажите это ниже.
                        </Typography>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            // config={config}
                            onBlur={(newContent) => newContent2(newContent)}
                        />
                    </>
                </MainCard>
            </div>

        </div>
    );
})

export default TestStartPage;

