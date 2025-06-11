import React, { useEffect, useContext, useState } from 'react';
import { Button, Col, Divider, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  LeftOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Typography, Link as MuiLink } from '@mui/material';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import EmailIcon from '@mui/icons-material/Email';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { observer } from 'mobx-react-lite';
import PieChartResult from './pieChartResult/PieChartResult';
import QuestionsTestTable from './questionsTestTable/QuestionsTestTable';
import styles from './style.module.scss';
import { Context } from '../..';
import userStore from '../../store/userStore';

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
        percentage: number;
        completedAt: string | null;
    } | null>(null);

    useEffect(() => {
        if (!resultId) return;

    resultTableStore.getInfoByIdResultTest(parsedId);
  }, [resultId, resultTableStore]);

  // Обработка состояний загрузки и ошибки
  if (resultTableStore.loading) {
    return <div style={{ padding: 30 }}>Загрузка...</div>;
  }
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
        return <div>Загрузка...</div>;
    }

    // Теперь берем нужные данные из info
    const { testName, userName, percentage, completedAt } = info;

    const name = userName || 'Имя и Фамилия';
    const test_name = testName || 'Название теста';
    const test_time = "0";

    // const timeInSeconds = store.getTimeInSeconds ? store.getTimeInSeconds(test_time) : test_time;
    // && timeInSeconds <= 720;
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

    const toggleVisibility = () => {
        setVisible(!visible);
        if (!visible) setHasFeedback(false);
    };

    const handleSave = () => {
        console.log('Отзыв сохранён:', value);
        setVisible(false);
        setHasFeedback(true);
    };

  if (resultTableStore.error) {
    return (
<<<<<<< HEAD
      <div style={{ padding: 30, color: 'red', fontSize: 18 }}>
        <p>{resultTableStore.error}</p>
        <Button onClick={() => navigate(-1)}>Вернуться назад</Button>
      </div>
=======
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
                                    <Typography variant='h6'  color="textSecondary" >
                                        тест по: &nbsp;
                                    </Typography>
                                      <Typography  variant='h6' >
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
                    <Typography variant="h5" sx={{ fontWeight: 400, fontSize: 18, marginBottom: 2, marginLeft: 1 }}>
                        Ответы на вопросы
                    </Typography>
                    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <QuestionsTestTable />
                    </div>

                </Col>
            </Row>
        </>
>>>>>>> origin/main
    );
  }

  const info = resultTableStore.selectedResult;
  if (!info) {
    return <div style={{ padding: 30 }}>Данные не найдены</div>;
  }

  const testName = resultTableStore.testNamesMap.get(info.test_id) || 'Неизвестно';
  const userName = resultTableStore
    ? resultTableStore.selectedResult && userStore.getUserField(info.user_id, 'name')
    : 'Неизвестно';

  const percentage = info.result?.percentage ?? 0;
  const completed_at = info.completed_at ?? null;
  const is_passed = info.result?.is_passed ?? false;

  const passed = is_passed;
  const resultTest = passed ? 'Тест пройден!' : 'Тест не пройден!';
  const resultGood = passed ? 'Оценка удовлетворительная' : 'Оценка неудовлетворительная';
  const resultColor = passed ? '#1677ff' : '#f58d8f';

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Неизвестно';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const end_date = formatDate(completed_at);

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col span={24} className={styles['gutter-row']} style={{ paddingRight: 0 }}>
          <Typography component="div" className={styles['actions-bar']} style={{ marginLeft: 15 }}>
            <Typography component="div" className={styles['actions-bar-left']}>
              <MuiLink
                component="button"
                className={styles.link}
                sx={{ textAlign: 'left', marginRight: 10 }}
                onClick={() => navigate(-1)}
              >
                <LeftOutlined /> Вернуться к списку
              </MuiLink>

              <MuiLink
                component="button"
                className={styles.link}
                sx={{ fontSize: 18, fontWeight: 400 }}
              >
                {testName}
              </MuiLink>
            </Typography>

            <Typography
              component="div"
              className={styles['actions-bar-right']}
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Typography
                component="div"
                style={{ display: 'flex', borderRight: '1px solid rgba(80, 93, 107, 0.2)' }}
                className={styles.btnBackground}
              >
                <UserOutlined style={{ marginRight: 5, color: '#505d6b' }} />
                <MuiLink
                  component="button"
                  sx={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#505d6b',
                    textDecoration: 'none',
                    lineHeight: '50px',
                    '&:hover': { textDecoration: 'none' },
                  }}
                >
                  {userName || 'Имя и Фамилия'}
                </MuiLink>
              </Typography>
              <Typography
                component="div"
                style={{ display: 'flex', borderRight: '1px solid rgba(80, 93, 107, 0.2)' }}
                className={styles.btnBackground}
              >
                <DownloadForOfflineOutlinedIcon style={{ marginRight: 5, color: '#505d6b' }} />
                <MuiLink
                  component="button"
                  sx={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#505d6b',
                    textDecoration: 'none',
                    lineHeight: '50px',
                    '&:hover': { textDecoration: 'none' },
                  }}
                >
                  Скачать
                </MuiLink>
              </Typography>
              <Typography
                component="div"
                style={{ display: 'flex' }}
                className={styles.btnBackground}
              >
                <EmailIcon style={{ marginRight: 5, color: '#505d6b' }} />
                <MuiLink
                  component="button"
                  sx={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#505d6b',
                    textDecoration: 'none',
                    lineHeight: '50px',
                    '&:hover': { textDecoration: 'none' },
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
              <AccountBoxOutlinedIcon style={{ fontSize: 30, marginRight: 15 }} />
              <Typography variant="h6" className={styles['title-card']}>
                {userName || 'Имя и Фамилия'}
              </Typography>
            </Typography>
          </Typography>
        </Col>

        <Row
          style={{ width: '100%', display: 'flex', gap: 15, flexWrap: 'wrap' }}
        >
          <Col
            xs={24}
            sm={24}
            md={14}
            lg={14}
            className={styles['gutter-row']}
          >
            <Typography
              component="div"
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                component="div"
                className={styles.respondent}
                style={{ width: '60%' }}
              >
                <Typography variant="subtitle1">Результат</Typography>
                <Typography component="div" className={styles['respondent-name']}>
                  {passed ? (
                    <CheckCircleOutlined
                      style={{ fontSize: 30, marginRight: 15, color: resultColor }}
                    />
                  ) : (
                    <CloseCircleOutlined
                      style={{ fontSize: 30, marginRight: 15, color: resultColor }}
                    />
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
                <PieChartResult totalScore={percentage} />
              </Typography>
            </Typography>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={9}
            lg={9}
            style={{ marginLeft: 'auto' }}
            className={styles['gutter-row']}
          >
            <Typography component="div" className={styles.respondent}>
              <Typography variant="subtitle1">Дата окончания</Typography>
              <Typography component="div" className={styles['respondent-name']}>
                <FieldTimeOutlined
                  style={{ fontSize: 30, marginRight: 15, color: '#7b858e' }}
                />
                <Typography variant="h6">{end_date}</Typography>
              </Typography>
            </Typography>
          </Col>
        </Row>

        <Divider
          style={{
            width: '100%',
            marginTop: 30,
            marginBottom: 40,
            borderTop: '2px solid #1677ff',
          }}
        />

        <Col span={24} className={styles['gutter-row']}>
          {/* <QuestionsTestTable
            questions={info.answers ?? []}
            testId={info.test_id}
            userId={info.user_id}
          /> */}
        </Col>
      </Row>
    </>
  );
});

export default TestUserResult;
