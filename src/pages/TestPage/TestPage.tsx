import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Context } from "../..";

import { Typography, Box } from "@mui/material";
import TestStartPage from "./components/test-start-page";
import TestSingleChoiceCard from "./components/testSingleChoiceCard";
import TestTextAnswerCard from "./components/testTextAnswerCard";
import TestYesNoCard from "./components/testYesNoCard";
import TestDescriptiveCard from "./components/testDescriptiveCard";
import TestSurveyCard from "./components/testSurveyCard";
import TestMultipleChoiceCard from "./components/testMultipleChoiceCard";
import TestTimer from "./components/testTimer";
import { ITestResultAnswerPayload } from "../../interface/interfaceStore";

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
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const { testId } = useParams<{ testId: string }>();

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (!testId) return;

      const parsedId = parseInt(testId, 10);
      if (isNaN(parsedId)) return;

      if (isMounted) {
        await Promise.all([
          questionsStore.fetchQuestionsByTestId(parsedId),
          settingsNewTestStore.getTestById(parsedId),
        ]);
        userAnswerStore.setTestId(parsedId);
      }

      if (!authStore.userId) {
        const user = await authStore.authMe();
        if (user?.id && isMounted) {
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
  }, [testId]);

  const questions = questionsStore.questions;
  const loading = questionsStore.loading;
  const error = questionsStore.error;
  const test = settingsNewTestStore.testMainInfo;
  const timeLimit = settingsNewTestStore.timeLimitFromTest;

const handleAnswer = async (answerValue: any) => {
  const current = questions[currentQuestionIndex];
  if (!current || questionStartTime === null) return;

  const time_spent = Math.floor((Date.now() - questionStartTime) / 1000);

  const answerPayload: ITestResultAnswerPayload = {
    value: answerValue,
    time_spent,
  };

  userAnswerStore.saveAnswer(current.question.id, answerPayload);


    const isLastQuestion = currentQuestionIndex >= questions.length - 1;

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      let userId = authStore.userId;
      if (!userId) {
        const user = await authStore.authMe();
        if (user?.id) {
          userId = user.id;
          userAnswerStore.setUserId(user.id);
        }
      }

      const fullPayload = userAnswerStore.getPayload();

      if (!fullPayload) {
        alert("Недостаточно данных для отправки результатов");
        return;
      }

      try {
        await testResultStore.createTestResult(fullPayload);
        const result = testResultStore.result;

        if (result?.result?.percentage !== undefined) {
          alert(`Тест завершён! Вы набрали ${result.result.percentage}%`);
        } else {
          alert("Результаты теста отправлены!");
        }
      } catch (e) {
        console.error(e);
        alert("Ошибка при отправке результатов");
      } finally {
        userAnswerStore.reset();
        setStart(false);
        setCurrentQuestionIndex(0);
        setQuestionStartTime(null);
      }
    }
  };

  useEffect(() => {
    if (start) {
      setQuestionStartTime(Date.now());
    }
  }, [start, currentQuestionIndex]);

  if (!start) {
    return (
      <TestStartPage
        setStart={setStart}
        start={start}
        questionsLength={questions.length}
        testTitle={test?.title}
        testLogo={test?.image?.path}
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
  const { question } = current;

  const QuestionComponent = (() => {
    switch (question.type) {
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
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">
          Вопрос №{currentQuestionIndex + 1} / {questions.length}
        </Typography>

        <TestTimer
          timeLimit={timeLimit}
          onTimeEnd={() => {
            alert("Время вышло! Отправляем результаты...");
            handleAnswer(null);
          }}
        />
      </Box>

      <QuestionComponent
        question={current}
        onNext={handleAnswer}
      />
    </Box>
  );
});

export default TestPage;
