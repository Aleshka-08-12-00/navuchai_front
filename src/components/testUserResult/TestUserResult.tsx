import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Progress, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined, FieldTimeOutlined, LeftOutlined, MessageOutlined, ProjectOutlined, UserOutlined } from '@ant-design/icons';
import { Typography, Link as MuiLink } from '@mui/material';
import styles from './style.module.scss';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import EmailIcon from '@mui/icons-material/Email';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { observer } from 'mobx-react-lite';
import PieChartResult from './pieChartResult/PieChartResult';
// import TimeDisplay from './timeDisplay/TimeDisplay';
// import TimeLinear from './timeLiner/TimeLinear';
import QuestionsTestTable from './questionsTestTable/QuestionsTestTable';
import JoditEditor from 'jodit-react';
import TestResultStore from '../../store/testResultStore';
import resultTableStore from '../../store/resultTableStore';
import { Context } from '../..';

const TestUserResult: React.FC = observer(() => {
    const { resultTableStore } = React.useContext(Context);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [hasFeedback, setHasFeedback] = useState(false);
    const { resultId } = useParams();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    console.log(resultId);
    
    const [info, setInfo] = useState<{
        result: any;
        testName: string;
        userName: string;
    } | null>(null);

        useEffect(() => {
        if (!resultId) return;

        const parsedId = parseInt(resultId, 10);
        if (isNaN(parsedId)) return;

        resultTableStore.getInfoByIdResultTest(parsedId).then((data) => {
            if (data?.error) {
            console.error("Ошибка:", data.error);
            setInfo(null);
            setErrorMessage(data.error); // новое состояние
            } else {
            setInfo({
                result: data.result,
                testName: data.testName ?? "Неизвестно",
                userName: data.userName ?? "Неизвестно",
            });
            setErrorMessage(null);
            }
        });
        }, [resultId]);


    if (errorMessage) {
        return (
            <div style={{ padding: '30px', color: 'red', fontSize: '18px' }}>
            <p>{errorMessage}</p>
            <Button onClick={() => navigate(-1)}>Вернуться назад</Button>
            </div>
        );
    }

    if (!info) {
        return <div>Загрузка...</div>; // или спиннер
    }

  // Теперь берем нужные данные из info
    const { result, testName, userName } = info;

    const name = userName|| 'Имя и Фамилия';
    const total_score = 0;
    const test_name = testName || 'Название теста';
    const test_time = "0";
    const end_date = 'дд.мм.гггг';

    // const timeInSeconds = store.getTimeInSeconds ? store.getTimeInSeconds(test_time) : test_time;

    // const passed = total_score >= 50 && timeInSeconds <= 720;
    const passed = 0;
    const resultTest = passed ? 'Тест пройден!' : 'Тест не пройден!';
    const resultGood = passed ? 'Оценка удовлетворительная' : 'Оценка неудовлетворительная';
    const resultColor = passed ? 'rgb(22, 119, 255)' : 'rgb(247, 100, 100)';

    const toggleVisibility = () => {
        setVisible(!visible);
        if (!visible) setHasFeedback(false);
    };

    const handleSave = () => {
        console.log('Отзыв сохранён:', value);
        setVisible(false);
        setHasFeedback(true);
    };

    return (
        <>
            <Row gutter={[10, 10]}>
                <Col span={24} className={styles['gutter-row']} style={{ paddingRight: 0 }}>
                    <Typography component="div" className={styles['actions-bar']} style={{ marginLeft: '15px' }}>
                        <Typography component="div" className={styles['actions-bar-left']}>
                            <MuiLink component="button" className={styles.link} sx={{ textAlign: 'left', marginRight: 10 }} onClick={() => navigate(-1)}>
                                <LeftOutlined /> Вернуться к списку
                            </MuiLink>

                            <MuiLink component="button" className={styles.link} sx={{ fontSize: 18, fontWeight: 400 }}>
                                {test_name}
                            </MuiLink>
                        </Typography>

                        <Typography
                            component="div"
                            className={styles['actions-bar-right']}
                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                        >
                            <Typography component="div" style={{ display: 'flex', borderRight: '1px solid rgb(80, 93, 107, 0.2)' }} className={styles.btnBackground}>
                                <UserOutlined style={{ marginRight: '5px', color: '#505d6b' }} />
                                <MuiLink
                                    component="button"
                                    sx={{
                                        fontSize: 16,
                                        fontWeight: 400,
                                        color: '#505d6b',
                                        textDecoration: 'none',
                                        lineHeight: '50px',
                                        '&:hover': {
                                            textDecoration: 'none',
                                        },
                                    }}
                                >
                                    {name}
                                </MuiLink>
                            </Typography>
                            <Typography component="div" style={{ display: 'flex', borderRight: '1px solid rgb(80, 93, 107, 0.2)' }} className={styles.btnBackground}>
                                <DownloadForOfflineOutlinedIcon style={{ marginRight: '5px', color: '#505d6b' }} />
                                <MuiLink
                                    component="button"
                                    sx={{
                                        fontSize: 16,
                                        fontWeight: 400,
                                        color: '#505d6b',
                                        textDecoration: 'none',
                                        lineHeight: '50px',
                                        '&:hover': {
                                            textDecoration: 'none',
                                        },
                                    }}
                                >
                                    Скачать
                                </MuiLink>
                            </Typography>
                            <Typography component="div" style={{ display: 'flex' }} className={styles.btnBackground}>
                                <EmailIcon style={{ marginRight: '5px', color: '#505d6b' }} />
                                <MuiLink
                                    component="button"
                                    sx={{
                                        fontSize: 16,
                                        fontWeight: 400,
                                        color: '#505d6b',
                                        textDecoration: 'none',
                                        lineHeight: '50px',
                                        '&:hover': {
                                            textDecoration: 'none',
                                        },
                                    }}
                                >
                                    Отправить
                                </MuiLink>
                            </Typography>
                        </Typography>
                    </Typography>
                </Col>

                <Col span={24} className={styles['gutter-row']}>
                    <Typography component="div" className={styles.respondent}>
                        <Typography variant="subtitle1">Тестируемый</Typography>
                        <Typography component="div" className={styles['respondent-name']}>
                            <AccountBoxOutlinedIcon style={{ fontSize: '30px', marginRight: '15px' }} />
                            <Typography variant="h6" className={styles['title-card']}>
                                {name}
                            </Typography>
                        </Typography>
                    </Typography>
                </Col>

                <Row style={{ width: '100%', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <Col xs={24} sm={24} md={14} lg={14} className={styles['gutter-row']}>
                        <Typography component="div" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <Typography component="div" className={styles.respondent} style={{ width: '60%' }}>
                                <Typography variant="subtitle1">Результат</Typography>
                                <Typography component="div" className={styles['respondent-name']}>
                                    {passed ? (
                                        <CheckCircleOutlined style={{ fontSize: '30px', marginRight: '15px', color: resultColor }} />
                                    ) : (
                                        <CloseCircleOutlined style={{ fontSize: '30px', marginRight: '15px', color: resultColor }} />
                                    )}
                                    <Typography variant="h3" sx={{ color: resultColor }}>
                                        {resultTest}
                                    </Typography>
                                </Typography>
                                <Typography variant="h4" sx={{ margin: '10px 0 0 46px', color: resultColor }}>
                                    {resultGood}
                                </Typography>
                            </Typography>
                            <Typography component="div" style={{ width: '40%' }}>
                                <PieChartResult totalScore={total_score} />
                            </Typography>
                        </Typography>
                    </Col>

                    <Col xs={24} sm={24} md={9} lg={9} style={{ marginLeft: 'auto' }} className={styles['gutter-row']}>
                        <Typography component="div" className={styles.respondent}>
                            <Typography variant="subtitle1">Время</Typography>
                            <Typography component="div" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                                <Typography component="div" className={styles['respondent-name']} style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                                    <FieldTimeOutlined style={{ fontSize: '30px', marginRight: '15px' }} />
                                    <Typography variant="h6">Общее время</Typography>
                                </Typography>
                                <Typography component="div" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '45px' }}>
                                    {/* <TimeDisplay maxTime={720} /> */}
                                    <Typography component="div" style={{ marginBottom: '10px' }}>
                                        {/* <TimeLinear timeInSeconds={0} /> */}
                                    </Typography>
                                    <Typography variant="body2">
                                        Дата: <Typography component="span" sx={{ fontWeight: 600, fontSize: 16 }}>{end_date}</Typography>
                                    </Typography>
                                </Typography>
                            </Typography>
                        </Typography>
                    </Col>
                </Row>

                {/* Если хотите, раскомментируйте блоки ниже и замените заглушки на данные */}

                {/* <Col span={24} className={styles['gutter-row']}>
                    <Typography component="div" className={styles.respondent}>
                        <Typography variant="subtitle1">Баллы по категориям вопросов (3)</Typography>
                        <Typography component="div" style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap', marginTop: '15px', alignItems: 'start', gap: '10px', width: '100%'}}>
                            <Typography component="div" style={{marginRight: '30px'}}>
                                <ProjectOutlined style={{ fontSize: '30px' }} />
                            </Typography>
                            <Typography component="div" style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginLeft: '5px', marginTop: '5px',  gap: '15px', width: '94%'}}>
                                <Typography component="div" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '250px'}}>
                                    <Progress percent={68} format={() => 'Категория №1'} strokeWidth={20} strokeColor="rgb(22, 119, 255)" style={{ width: '100%' }}/>
                                    <Progress percent={34} format={() => 'Категория №2'} strokeWidth={20} strokeColor="rgb(247, 100, 100)" style={{ width: '100%' }}/>
                                </Typography>
                                <Typography component="div" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minWidth: '250px'}}>
                                    <Progress percent={95} format={() => 'Категория №3'} strokeWidth={20} strokeColor="rgb(22, 119, 255)" style={{ width: '100%' }}/>
                                </Typography>
                            </Typography>
                        </Typography>
                    </Typography>
                </Col> */}

                {/* <Col span={24} className={styles['gutter-row']}>
                    <Typography component="div" className={styles.respondent}>
                        <Typography variant="subtitle1">Отзывы</Typography>
                        <Typography component="div" style={{ marginTop: '15px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <Typography component="div" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                {!hasFeedback && (
                                    <Typography component="div" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <MessageOutlined style={{ fontSize: '18px', marginRight: '10px', color: '#1677ff' }} />
                                        <Typography variant="body1" sx={{ fontWeight: 400 }}>Отзывов нет</Typography>
                                    </Typography>
                                )}
                            </Typography>
                            <Typography component="div">
                                <Button color="primary" variant="outlined" onClick={toggleVisibility}>
                                    {visible ? 'Скрыть поле' : 'Написать отзыв'}
                                </Button>
                                {visible && (
                                    <Button color="primary" variant="solid" onClick={handleSave} style={{ marginLeft: '10px' }}>
                                        Сохранить
                                    </Button>
                                )}
                            </Typography>
                        </Typography>
                        <Typography component="div" className={`${styles['textarea-container']} ${visible ? styles.show : styles.hide}`}>
                            <JoditEditor
                                value={value}
                                onChange={(newValue) => setValue(newValue)}
                                tabIndex={1}
                                config={{ readonly: false }}
                            />
                        </Typography>
                    </Typography>
                </Col> */}

                <Col span={24} className={styles['gutter-row']}>
                    <Divider style={{ margin: '30px 0 15px 0' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 400, fontSize: 20, margin: '0 0 20px 0' }}>
                        Ответы на вопросы
                    </Typography>
                    <QuestionsTestTable />
                </Col>
            </Row>
        </>
    );
});

export default TestUserResult;
