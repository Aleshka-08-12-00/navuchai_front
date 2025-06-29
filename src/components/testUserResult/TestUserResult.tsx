import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined, FieldTimeOutlined, LeftOutlined, UserOutlined } from '@ant-design/icons';
import { Typography, Link as MuiLink } from '@mui/material';
import styles from './style.module.scss';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import EmailIcon from '@mui/icons-material/Email';
import { observer } from 'mobx-react-lite';
import PieChartResult from './pieChartResult/PieChartResult';
import TimeLinear from './timeLiner/TimeLinear';
import QuestionsTestTable from './questionsTestTable/QuestionsTestTable';
import { Context } from '../..';

const TestUserResult: React.FC = observer(() => {
    const { resultTableStore } = React.useContext(Context);
    const navigate = useNavigate();
    const { resultId } = useParams();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    console.log(resultId);

    const [info, setInfo] = useState<{
        result: any;
        testName: string;
        userName: string;
        percentage: number;
        completedAt: string | null;
        time_limit: number;
        total_time_seconds: number;
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
                    percentage: data.percentage ?? 0,
                    completedAt: data.completedAt ?? null,
                    time_limit: data.result.result.test_time_limit ?? 0,
                    total_time_seconds: data.result.result.total_time_seconds ?? 0,
                });
                console.log(data);
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
        return <div>Загрузка...</div>;
    }

    // Теперь берем нужные данные из info
    const { testName, userName, percentage, completedAt, time_limit, total_time_seconds } = info;

    const name = userName || 'Имя и Фамилия';
    const test_name = testName || 'Название теста';
    const test_time_limit = time_limit || 0;
    const test_spent_time = total_time_seconds || 0
    console.log(test_time_limit);

    const passed = percentage >= 50;
    const resultTest = passed ? 'Тест пройден!' : 'Тест не пройден!';
    const resultGood = passed ? 'Оценка удовлетворительная' : 'Оценка неудовлетворительная';
    const resultColor = passed ? '#10a000' : '#f58d8f';

    const formatDate = (dateStr: string | null): string => {
        if (!dateStr) return 'Неизвестно';
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const end_date = formatDate(completedAt);

  

    return (
        <>
            <Row gutter={[10, 10]}>
                <Col span={24} className={styles['gutter-row']} style={{ paddingRight: 0 }}>
                    <Typography component="div" className={styles['actions-bar']} style={{ marginLeft: '15px' }}>
                        <Typography component="div" className={styles['actions-bar-left']}>
                            <MuiLink component="button" className={styles.link} sx={{ textAlign: 'left', marginRight: 10 }} onClick={() => navigate(-1)}>
                                <LeftOutlined /> назад к списку
                            </MuiLink>

                            <MuiLink component="button" className={styles.link} sx={{ fontSize: 18, fontWeight: 400 }}>
                                <Typography component="div" style={{display: 'flex', justifyContent: 'space-between', margin: 'auto'}}>
                                     <Typography variant='h6' >
                                         {test_name}
                                    </Typography>
                                </Typography>
                            </MuiLink>
                        </Typography>

                        <Typography
                            component="div"
                            className={styles['actions-bar-right']}
                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                        >
                            <Typography component="div" style={{ display: 'flex', borderRight: '1px solid rgb(80, 93, 107, 0.2)' }} className={styles.btnBackground}>
                                <UserOutlined style={{ marginRight: 10, color: '#505d6b', marginLeft: 10 }} />
                                <MuiLink
                                    component="button"
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 400,
                                        color: '#505d6b',
                                        textDecoration: 'none',
                                        lineHeight: '50px',
                                        pr: 1,
                                        '&:hover': {
                                            textDecoration: 'none',
                                        },
                                    }}
                                >
                                    {name}
                                </MuiLink>
                            </Typography>
                            <Typography component="div" style={{ display: 'flex', borderRight: '1px solid rgb(80, 93, 107, 0.2)' }} className={styles.btnBackground}>
                                <DownloadForOfflineOutlinedIcon style={{ marginRight: 10, color: '#505d6b', marginLeft: 10 }} />
                                <MuiLink
                                    component="button"
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 400,
                                        color: '#505d6b',
                                        textDecoration: 'none',
                                        lineHeight: '50px',
                                        pr: 1,
                                        pl: 1,
                                        '&:hover': {
                                            textDecoration: 'none',
                                        },
                                    }}
                                >
                                    Скачать
                                </MuiLink>
                            </Typography>
                            <Typography component="div" style={{ display: 'flex' }} className={styles.btnBackground}>
                                <EmailIcon style={{ marginRight: '5px', color: '#505d6b', marginLeft: 10 }} />
                                <MuiLink
                                    component="button"
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 400,
                                        color: '#505d6b',
                                        textDecoration: 'none',
                                        lineHeight: '50px',
                                        pr: 1,
                                        pl: 1,
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
                        <Typography variant="h6">Тестируемый</Typography>
                        <Typography component="div" className={styles['respondent-name']}>
                            <UserOutlined style={{ fontSize: '20px', marginRight: '15px' }} />
                            <Typography variant="h5" >
                                {name}
                            </Typography>
                        </Typography>
                    </Typography>
                </Col>

                <Row style={{ width: '100%', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <Col xs={24} sm={24} md={14} lg={14} className={styles['gutter-row']}>
                        <Typography component="div" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <Typography component="div" className={styles.respondent} style={{ width: '60%' }}>
                                <Typography variant="h6">Результат</Typography>
                                <Typography component="div" className={styles['respondent-name']}>
                                    {passed ? (
                                        <CheckCircleOutlined style={{ fontSize: '30px', marginRight: '15px', color: resultColor }} />
                                    ) : (
                                        <CloseCircleOutlined style={{ fontSize: '30px', marginRight: '15px', color: resultColor }} />
                                    )}
                                    <Typography variant="h6" sx={{ color: resultColor }}>
                                        {resultTest}
                                    </Typography>
                                </Typography>
                                <Typography variant="h6" sx={{ margin: '10px 0 0 46px', color: resultColor }}>
                                    {resultGood}
                                </Typography>
                            </Typography>
                            <Typography component="div" style={{ width: '40%' }}>
                                <PieChartResult totalScore={percentage} />
                            </Typography>
                        </Typography>
                    </Col>

                    <Col xs={24} sm={24} md={9} lg={9} style={{ marginLeft: 'auto' }} className={styles['gutter-row']}>
                      <Typography component="div" className={styles.respondent}>
                        <Typography variant="h6">Время</Typography>

                        <Typography component="div" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                          <Typography
                            component="div"
                            className={styles['respondent-name']}
                            style={{ display: 'flex', flexDirection: 'row'}}
                          >
                            <FieldTimeOutlined style={{ fontSize: '30px', marginRight: '15px' }} />
                            <Typography variant="h6">Общее время</Typography>
                          </Typography>

                          <Typography
                            component="div"
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '45px' }}
                          >
                            {/* <TimeDisplay maxTime={test_time_limit} />  */}

                            <Typography component="div" style={{ marginBottom: '10px' }}>
                              <TimeLinear timeInSeconds={test_spent_time} maxTimeInSeconds={test_time_limit} />
                            </Typography>

                            <Typography variant="body2">
                              Дата:{' '}
                              <Typography component="span" sx={{ fontWeight: 600, fontSize: 16 }}>
                                {end_date}
                              </Typography>
                            </Typography>
                          </Typography>
                        </Typography>
                      </Typography>
                    </Col>
                </Row>

                <Col span={24} className={styles['gutter-row']}>
                    <Divider style={{ margin: '30px 0 15px 0' }} />
                    <Typography variant="h5" sx={{ fontWeight: 400, fontSize: 18, marginBottom: 2, marginLeft: 1 }}>
                        Ответы на вопросы
                    </Typography>
                    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <QuestionsTestTable />
                    </div>

                </Col>
            </Row>
        </>
    );
});

export default TestUserResult;