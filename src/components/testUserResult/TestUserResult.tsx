import React from 'react';
import { Button, Col, Divider, Row } from 'antd';
import { useNavigate } from 'react-router';
import { CheckCircleOutlined, FieldTimeOutlined, LeftOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from '@mui/material';
import styles from './style.module.scss';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import EmailIcon from '@mui/icons-material/Email';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { observer } from 'mobx-react-lite';
import PieChartResult from './pieChartResult/PieChartResult';
import { store } from '../../store/store';
import TimeDisplay from './timeDisplay/TimeDisplay';

const style: React.CSSProperties = { background: '#0092ff'};

const TestUserResult: React.FC = observer(() => {
    const navigate = useNavigate();

    if (!store.selectedUser) {
        return <div>Выберите пользователя</div>;
      }

    const { total_score, test_name, first_name, last_name, test_time } = store.selectedUser;

    const timeInSeconds = store.getTimeInSeconds(test_time);
    
    const resultTest = (total_score >= 50 && timeInSeconds <= 720) 
        ? 'Тест пройден!' 
        : 'Тест не пройден!';

    const resultGood = (total_score >= 50 && timeInSeconds <= 720) 
        ? 'Оценка удовлетворительная' 
        : 'Оценка не удовлетворительная';

    const resultColor = (total_score >= 50 && timeInSeconds <= 720) 
        ? 'rgb(50, 220, 45)' 
        : 'red';

   return ( 
        <>
            <Divider orientation="left">
                <Link onClick={() => navigate(-1)} className={styles.link}>
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
                                    <CheckCircleOutlined 
                                        style={{ fontSize: '30px', marginRight: '15px', color: resultColor }} 
                                    />
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
                            <div style={{display: 'flex', alignItems: "center"}}>
                                <div className={styles['respondent-name']}>
                                    <FieldTimeOutlined  style={{ fontSize: '30px', marginRight: '15px' }} />
                                </div>
                                <div style={{marginTop: '10px'}}>
                                    <span className={styles['title-card']}>Общее время</span>
                                    <TimeDisplay maxTime={720}/>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>


                {/* Остальные блоки */}
                <Col span={24} className={styles['gutter-row']}>
                    <div style={style}>Block 5</div>
                </Col>
                <Col span={24} className={styles['gutter-row']}>
                    <div style={style}>Block 6</div>
                </Col>
                <Col span={24} className={styles['gutter-row']}>
                    <div style={style}>Block 7</div>
                </Col>
            </Row>

        </>
   )
});

export default TestUserResult;
