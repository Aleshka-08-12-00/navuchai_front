import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Context } from "../..";

import {
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

import TestStartPage from "./components/test-start-page";
import TestSingleChoiceCard from "./components/testSingleChoiceCard";
import TestTextAnswerCard from "./components/testTextAnswerCard";
import TestYesNoCard from "./components/testYesNoCard";
import TestDescriptiveCard from "./components/testDescriptiveCard";
import TestSurveyCard from "./components/testSurveyCard";
import TestMultipleChoiceCard from "./components/testMultipleChoiceCard";
import TestTimer from "./components/testTimer";
import { ITestResultCreateResponse } from "../../interface/interfaceStore";
import TestResultCard from "./components/testResultCard";

const TestPage = observer(() => {
  const {
    questionsStore,
    settingsNewTestStore,
    userAnswerStore,
    authStore,
    testResultStore,
  } = useContext(Context);

  const [start, setStart] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [prevQuestionTime, setPrevQuestionTime] = useState<number | null>(null);
  const { testId } = useParams<{ testId: string }>();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [showResultCard, setShowResultCard] = useState(false);
  const [resultData, setResultData] = useState<ITestResultCreateResponse | null>(null);

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (!testId) return;
      const parsedId = parseInt(testId, 10);
      if (isNaN(parsedId)) return;

      if (isMounted) {
        await Promise.all([
          questionsStore.fetchQuestionsByTestIdPublick(parsedId),
          settingsNewTestStore.getTestById(parsedId),
        ]);
        userAnswerStore.setTestId(parsedId);
      }

      if (!authStore.userId) {
        const user = await authStore.authMe();
        if (user && isMounted) {
          userAnswerStore.setUserId(user.id);
        }
      } else {
        userAnswerStore.setUserId(authStore.userId);
      }
    };

    initialize();
    return () => {
      isMounted = false;
    };
  }, [testId, authStore.userId, questionsStore, settingsNewTestStore, userAnswerStore, authStore]);

  useEffect(() => {
    if (start) {
      userAnswerStore.reset();
      if (testId) userAnswerStore.setTestId(parseInt(testId, 10));
      if (authStore.userId) userAnswerStore.setUserId(authStore.userId);
      const now = new Date().toISOString();
      userAnswerStore.setTimeStart(now);
      setPrevQuestionTime(Date.now());
    }
    // eslint-disable-next-line
  }, [start]);

  const questions = questionsStore.questions;
  const loading = questionsStore.loading;
  const error = questionsStore.error;
  const test = settingsNewTestStore.testMainInfo;

  const timeLimit = Number(settingsNewTestStore.timeLimitFromTest) || 0;

  const handleAnswer = async (answerValue: any) => {
    if (answerValue === null || answerValue === undefined) {
      showAlert("Пожалуйста, выберите ответ перед продолжением", "error");
      return;
    }

    const current = questions[currentQuestionIndex];
    if (!current) {
      showAlert("Ошибка: текущий вопрос не найден", "error");
      return;
    }

    const now = Date.now();
    const startTime = prevQuestionTime ?? now;
    setPrevQuestionTime(now);

    userAnswerStore.saveAnswer(
      current.question.id,
      { value: answerValue },
      new Date(startTime).toISOString(),
      new Date(now).toISOString()
    );

    const isLastQuestion = currentQuestionIndex >= questions.length - 1;

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      userAnswerStore.setTimeEnd(new Date().toISOString());
      const fullPayload = userAnswerStore.getPayload();
      if (!fullPayload || !fullPayload.answers || fullPayload.answers.length === 0) {
        showAlert("Недостаточно данных для отправки результатов", "error");
        return;
      }
      try {
        const result = await testResultStore.createTestResult(fullPayload);
        if (result) {
          setResultData(result);
          setShowResultCard(true);
          setTimeout(() => {
            userAnswerStore.reset();
            setStart(false);
            setCurrentQuestionIndex(0);
            setPrevQuestionTime(null);
          }, 500);
        }
        if (result?.result?.percentage !== undefined) {
          showAlert(`Тест завершён! Вы набрали ${result.result.percentage}%`, "success");
        } else {
          showAlert("Результаты теста отправлены!", "success");
        }
      } catch (e) {
        console.error(e);
        showAlert("Ошибка при отправке результатов", "error");
      } finally {
        userAnswerStore.reset();
        setStart(false);
        setCurrentQuestionIndex(0);
        setPrevQuestionTime(null);
      }
    }
  };

  const handleTimeEnd = async () => {
    showAlert("Время вышло! Отправляем результаты...", "error");

    userAnswerStore.setTimeEnd(new Date().toISOString());

    const fullPayload = userAnswerStore.getPayload();
    if (
      !fullPayload ||
      !fullPayload.answers ||
      fullPayload.answers.length === 0
    ) {
      showAlert("Нет данных для отправки", "error");
      return;
    }

    try {
      await testResultStore.createTestResult(fullPayload);
      const result = testResultStore.result;
      if (result?.result?.percentage !== undefined) {
        showAlert(`Тест завершён! Вы набрали ${result.result.percentage}%`, "success");
      } else {
        showAlert("Результаты теста отправлены!", "success");
      }
    } catch (e) {
      console.error(e);
      showAlert("Ошибка при отправке результатов", "error");
    } finally {
      userAnswerStore.reset();
      setStart(false);
      setCurrentQuestionIndex(0);
      setPrevQuestionTime(null);
    }
  };

  if (showResultCard && resultData) {
  return (
    <TestResultCard
      open={showResultCard}
      resultTestData={resultData}
      onClose={() => setShowResultCard(false)}
      goodbyeMessage={test?.goodbye_message}
    />
  );
}

  if (!start) {
    return (
      <TestStartPage
        setStart={setStart}
        start={start}
        questionsLength={questions.length}
        testTitle={test?.title}
        testLogo={test?.image?.path}
        welcomeMessage={test?.welcome_message}
        timeLimit={timeLimit}
      />
    );
  }

  if (loading) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>
        Загрузка вопросов...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center", color: "red" }}>
        {error}
      </Typography>
    );
  }

  if (!questions.length) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>
        Нет доступных вопросов
      </Typography>
    );
  }

  const current = questions[currentQuestionIndex];
  if (!current) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center", color: "red" }}>
        Ошибка: Вопрос не найден
      </Typography>
    );
  }

  const { question } = current;
  console.log(`Лимит времени на данный вопрос: ${question.time_limit}`);

  const QuestionComponent = (() => {
    switch (question.type.code) {
      case "SINGLE_CHOICE":
        return TestSingleChoiceCard;
      case "MULTIPLE_CHOICE":
        return TestMultipleChoiceCard;
      case "SHORT_ANSWER":
        return TestTextAnswerCard;
      case "TRUE_FALSE":
        return TestYesNoCard;
      case "DESCRIPTIVE":
        return TestDescriptiveCard;
      case "SURVEY":
        return TestSurveyCard;
      default:
        return () => <Typography>Тип вопроса не поддерживается</Typography>;
    }
  })();

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">
            Вопрос №{currentQuestionIndex + 1} / {questions.length}
          </Typography>

          <TestTimer
            key={start ? 'running' : 'stopped'}
            timeLimit={timeLimit}
            onTimeEnd={handleTimeEnd}
          />
        </Box>

        <QuestionComponent question={current} onNext={handleAnswer} />
      </Box>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

    {resultData && (
      <TestResultCard
        open={showResultCard}
        resultTestData={resultData}
        onClose={() => setShowResultCard(false)}
        goodbyeMessage={test?.goodbye_message}
      />
    )}
    </>
  );
});

export default TestPage;
