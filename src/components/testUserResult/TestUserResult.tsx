import React from 'react';
import { Button, Col, Divider, Row } from 'antd';
import { useNavigate } from 'react-router';
import { LeftOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from '@mui/material';
import styles from './style.module.scss';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import EmailIcon from '@mui/icons-material/Email';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';

const style: React.CSSProperties = { background: '#0092ff'};

const App: React.FC = () => {
    const navigate = useNavigate();

   return ( 
        <>
            <Divider orientation="left">
                <Link onClick={() => navigate(-1)} className={styles.link}>
                    <LeftOutlined /> Вернуться к списку
                </Link>
            </Divider>
            <Row gutter={[10,10]}>
                <Col className={styles['gutter-row']} span={24} style={{paddingRight: 0}}>
                    <div className={styles['actions-bar']} >
                        {/* Левая часть */}
                        <div className={styles['actions-bar-left']}>
                        
                            <Link className={styles.link} style={{fontSize: '18px', fontWeight: 600}} onClick= {()=> {}}>Название теста</Link>  {/* Сделать ссылку на ТЕСТ! */}
                        </div>

                        {/* Правая часть */}
                        <div className={styles['actions-bar-right']} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <div style={{display: 'flex', borderRight: '1px solid rgb(80, 93, 107, 0.2)'}} className={styles.btnBackground}>
                                <UserOutlined style={{marginRight: '5px', color: "#505d6b"}}/>
                                <Link style={{fontSize: '16px', fontWeight: 400, color: '#505d6b', textDecoration: 'none'}} onClick= {()=> {}}>
                                    Пользователь
                                </Link>  {/* Сделать ссылку на Пользователя! */}
                            </div>
                            <div style={{display: 'flex',  borderRight: '1px solid rgb(80, 93, 107, 0.2)'}} className={styles.btnBackground}>
                                <DownloadForOfflineOutlinedIcon style={{marginRight: '5px', color: "#505d6b"}}/>
                                <Link style={{fontSize: '16px', fontWeight: 400, color: '#505d6b', textDecoration: 'none'}} onClick= {()=> {}}>
                                    Скачать
                                </Link>  {/* Сделать ссылку на скачивание */}
                            </div>
                            <div style={{display: 'flex'}} className={styles.btnBackground}>
                                <EmailIcon style={{marginRight: '5px', color: "#505d6b"}}/>
                                <Link style={{fontSize: '16px', fontWeight: 400, color: '#505d6b', textDecoration: 'none'}} onClick= {()=> {}}>
                                    Отправить
                                </Link>  {/* Сделать ссылку на отправку */}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col className={styles['gutter-row']} span={24}>
                    <div className={styles.respondent}>
                        <span>Тестируемый</span>
                        <div className={styles['respondent-name']}>
                            <AccountBoxOutlinedIcon style={{fontSize: '30px'}}/>
                            <span className={styles['user-name']}>Фамилия и имя</span>
                        </div>
                    </div>
                </Col>
                {/* 3 и 4 блоки в одной строке */}
                <Col className={styles['gutter-row']} flex='55%' offset={0} >
                <div className={styles.respondent}>
                        <span>Результат</span>
                        <div className={styles['respondent-name']}>
                            <AccountBoxOutlinedIcon style={{fontSize: '30px'}}/>
                            <span className={styles['user-name']}>Фамилия и имя</span>
                        </div>
                    </div>
                </Col>
                <Col className={styles['gutter-row']} flex='40%' offset={1}> 
                <div className={styles.respondent}>
                        <span>Время</span>
                        <div className={styles['respondent-name']}>
                            <AccountBoxOutlinedIcon style={{fontSize: '30px'}}/>
                            <span className={styles['user-name']}>Фамилия и имя</span>
                        </div>
                    </div>
                </Col>
                <Col className={styles['gutter-row']} span={24}>
                    <div style={style}>Block 5</div>
                </Col>
                <Col className={styles['gutter-row']} span={24}>
                    <div style={style}>Block 6</div>
                </Col>
                <Col className={styles['gutter-row']} span={24}>
                    <div style={style}>Block 7</div>
                </Col>
            </Row>
        </>
   )
};

export default App;
