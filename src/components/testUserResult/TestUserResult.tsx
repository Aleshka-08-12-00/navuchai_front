import React, { useEffect, useContext } from 'react';
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
  const { resultTableStore } = useContext(Context);
  const navigate = useNavigate();
  const { resultId } = useParams();

  useEffect(() => {
    if (!resultId) return;
    const parsedId = Number(resultId);
    if (isNaN(parsedId)) return;

    resultTableStore.getInfoByIdResultTest(parsedId);
  }, [resultId, resultTableStore]);

  // Обработка состояний загрузки и ошибки
  if (resultTableStore.loading) {
    return <div style={{ padding: 30 }}>Загрузка...</div>;
  }

  if (resultTableStore.error) {
    return (
      <div style={{ padding: 30, color: 'red', fontSize: 18 }}>
        <p>{resultTableStore.error}</p>
        <Button onClick={() => navigate(-1)}>Вернуться назад</Button>
      </div>
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
