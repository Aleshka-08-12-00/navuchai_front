import React, { useState } from 'react';
import { Button, Col, Divider, Progress, Row } from 'antd';
import { useNavigate } from 'react-router';
import { CheckCircleOutlined, CloseCircleOutlined, FieldTimeOutlined, LeftOutlined, MessageOutlined, ProjectOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from '@mui/material';
import styles from './style.module.scss';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import EmailIcon from '@mui/icons-material/Email';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { observer } from 'mobx-react-lite';
import PieChartResult from './pieChartResult/PieChartResult';
import { store } from '../../store/store';
import TimeDisplay from './timeDisplay/TimeDisplay';

import TextArea from 'antd/es/input/TextArea';
import { display, textAlign } from '@mui/system';
import TimeLinear from './timeLiner/TimeLinear';
import QuestionsTestTable from './questionsTestTable/QuestionsTestTable';


const TestUserResult: React.FC = observer(() => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [hasFeedback, setHasFeedback] = useState(false);

    if (!store.selectedUser) {
        return <div>Выберите пользователя</div>;
      }

    const { total_score, test_name, first_name, last_name, test_time, end_date } = store.selectedUser;

    const timeInSeconds = store.getTimeInSeconds(test_time);
    
    const resultTest = (total_score >= 50 && timeInSeconds <= 720) 
        ? 'Тест пройден!' 
        : 'Тест не пройден!';

    const resultGood = (total_score >= 50 && timeInSeconds <= 720) 
        ? 'Оценка удовлетворительная' 
        : 'Оценка неудовлетворительная';

    const resultColor = (total_score >= 50 && timeInSeconds <= 720) 
        ? '#1677ff' 
        : 'red';
    
    const toggleVisibility = () => {
        setVisible(!visible);
        if (!visible) {
            setHasFeedback(false); // Скрыть "Отзывов нет", когда поле для ввода появляется
        }
    };
    const handleSave = () => {
        console.log('Отзыв сохранён:', value);
        setVisible(false);  
        setHasFeedback(true);
    };

   return ( 
        <>
            <Divider orientation="left">
                <Link onClick={() => navigate(-1)} className={styles.link} style={{textAlign: 'left'}}>
                    <LeftOutlined /> Вернуться к списку
                </Link>
            </Divider>
            <Row gutter={[10, 10]}>
                {/* Верхний блок */}
                <Col span={24} className={styles['gutter-row']} style={{ paddingRight: 0 }}>
                    <div className={styles['actions-bar']} style={{marginLeft: '15px'}}>
                    {/* Левая часть */}
                        <div className={styles['actions-bar-left']}>
                            <Link className={styles.link} style={{ fontSize: '18px', fontWeight: 600 }} onClick={() => {}}>
                                {test_name}
                            </Link>
                        </div>

                    {/* Правая часть */}
                        <div className={styles['actions-bar-right']} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', borderRight: '1px solid rgb(80, 93, 107, 0.2)' }} className={styles.btnBackground}>
                                <UserOutlined style={{ marginRight: '5px', color: '#505d6b' }} />
                                <Link style={{ fontSize: '16px', fontWeight: 400, color: '#505d6b', textDecoration: 'none' }} onClick={() => {}}>
                                    {last_name} {first_name}
                                </Link>
                            </div>
                            <div style={{ display: 'flex', borderRight: '1px solid rgb(80, 93, 107, 0.2)' }} className={styles.btnBackground}>
                                <DownloadForOfflineOutlinedIcon style={{ marginRight: '5px', color: '#505d6b' }} />
                                <Link style={{ fontSize: '16px', fontWeight: 400, color: '#505d6b', textDecoration: 'none' }} onClick={() => {}}>
                                    Скачать
                                </Link>
                            </div>
                            <div style={{ display: 'flex' }} className={styles.btnBackground}>
                                <EmailIcon style={{ marginRight: '5px', color: '#505d6b' }} />
                                <Link style={{ fontSize: '16px', fontWeight: 400, color: '#505d6b', textDecoration: 'none' }} onClick={() => {}}>
                                    Отправить
                                </Link>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Тестируемый */}
                <Col span={24} className={styles['gutter-row']}>
                    <div className={styles.respondent}>
                        <span>Тестируемый</span>
                        <div className={styles['respondent-name']}>
                            <AccountBoxOutlinedIcon style={{ fontSize: '30px', marginRight: '15px' }} />
                            <span className={styles['title-card']}>
                                {last_name} {first_name}
                            </span>
                        </div>
                    </div>
                </Col>

                {/* Результат */}
                <Row style={{ width: '100%', display: 'flex', gap: '15px', flexWrap: 'wrap'  }}>
                    <Col xs={24} sm={24} md={14} lg={14} className={styles['gutter-row']}>
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <div className={styles.respondent} style={{ width: '60%' }}>
                                <span>Результат</span>
                                <div className={styles['respondent-name']}>
                                    { total_score >= 50 && timeInSeconds <= 720 
                                    ? 
                                        <CheckCircleOutlined style={{ fontSize: '30px', marginRight: '15px', color: resultColor }} />
                                    :
                                        <CloseCircleOutlined style={{ fontSize: '30px', marginRight: '15px', color: resultColor }}/>
                                    }
                                    <span 
                                        className={styles['title-card']} 
                                        style={{ color: resultColor }}
                                    >
                                        {resultTest}
                                    </span>
                                </div>
                                <span 
                                    style={{ 
                                        textTransform: 'none', 
                                        fontSize: '20px', 
                                        fontWeight: 400, 
                                        margin: '10px 0 0 46px', 
                                        color: resultColor, 
                                    }}
                                >
                                    {resultGood}
                                </span>
                            </div>
                            <div style={{ width: "40%" }}>
                                <PieChartResult totalScore={total_score} />
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} sm={24} md={9} lg={9} style={{ marginLeft: 'auto' }} className={styles['gutter-row']} >
                        <div className={styles.respondent}>
                            <span>Время</span>
                            <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap'}}>
                                <div className={styles['respondent-name']} style={{display: 'flex', flexDirection: 'row', marginBottom: '10px'}}>
                                    <FieldTimeOutlined  style={{ fontSize: '30px', marginRight: '15px' }} />
                                    <div>
                                        <span className={styles['title-card']}>
                                            Общее время
                                        </span>
                                    </div>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '45px'}}>
                                    <div>
                                        <TimeDisplay maxTime={720}/>
                                    </div>
                                    <div style={{marginBottom: '10px'}}>
                                        <TimeLinear timeInSeconds={timeInSeconds}/>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                        <span style={{textTransform: 'none', fontSize: '14px', fontWeight: '400'}}>
                                            Дата: <span style={{fontWeight: "600", textTransform: 'none', fontSize: '16px'}}>{end_date}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Col span={24} className={styles['gutter-row']}>
                    <div className={styles.respondent}>
                        <span>Баллы по категориям вопросов {`(3)`}</span>
                        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '15px', alignItems: 'start'}}>
                            <ProjectOutlined style={{fontSize: '30px'}}/>
                            <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', marginLeft: '15px', marginTop: '5px', margin: 'auto'}}>
                                <div style={{display: 'flex', flexDirection: 'row', flexWrap: "wrap", justifyContent: "space-between", marginBottom: '15px'}}>
                                    <div style={{marginRight: '30px'}}>
                                        <Progress 
                                            percent={68} 
                                            size={[450, 25]} 
                                            format={() => 'Категория №1'} 
                                            strokeWidth={20} 
                                            strokeColor="#1677ff"
                                        />
                                    </div>
                                    <div>
                                        <Progress 
                                            percent={34} 
                                            size={[450, 25]} 
                                            format={() => `Категория №2`} 
                                            strokeWidth={20} 
                                            strokeColor="red"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Progress 
                                            percent={95} 
                                            size={[450, 25]} 
                                            format={() => 'Категория №3'} 
                                            strokeWidth={20} 
                                            strokeColor="#1677ff"
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col span={24} className={styles['gutter-row']}>
                    <div className={styles.respondent}>
                        <span>отзывы</span>
                        <div  style={{marginTop: '15px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                                {!hasFeedback && ( // Показываем "Отзывов нет", если нет отзыва
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <MessageOutlined style={{ fontSize: '18px', marginRight: '10px', color: '#1677ff' }} />
                                        <span style={{ textTransform: 'none', fontSize: '16px', fontWeight: '400' }}>Отзывов нет</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <Button color="primary" variant="outlined" onClick={toggleVisibility}>
                                    {visible ? 'Скрыть поле' : 'Написать отзыв'}
                                </Button>
                                {visible && ( // Появляется только когда поле для ввода отзывов видно
                                    <Button color="primary" variant="solid" onClick={handleSave} style={{ marginLeft: '10px' }}>
                                        Сохранить
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className={`${styles['textarea-container']} ${visible ? styles.show : styles.hide}`}>
                                <TextArea
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Введите отзыв..."
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                />
                        </div>            
                    </div>
                </Col>

                <Col span={24} className={styles['gutter-row']}>
                    <div className={styles.respondent}>
                        <div>
                            <span>Вопросы {`(6)`}</span>
                        </div>
                        <div>
                            <QuestionsTestTable />
                        </div>
                    </div>
                </Col>
            </Row>

        </>
   )
});

export default TestUserResult;
