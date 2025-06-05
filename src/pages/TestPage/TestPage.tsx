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
  const { testId } = useParams();

  useEffect(() => {
    const initialize = async () => {
      if (testId) {
        const parsedId = parseInt(testId, 10);
        if (!isNaN(parsedId)) {
          questionsStore.fetchQuestionsByTestId(parsedId);
          settingsNewTestStore.getTestById(parsedId);
          userAnswerStore.setTestId(parsedId);
        }
      }

      if (!authStore.userId) {
        const user = await authStore.authMe();
        if (user?.id) {
          userAnswerStore.setUserId(user.id);
        }
      } else {
        userAnswerStore.setUserId(authStore.userId);
      }
    };

    initialize();
  }, [testId]);

  const questions = questionsStore.questions;
  const loading = questionsStore.loading;
  const error = questionsStore.error;
  const test = settingsNewTestStore.testMainInfo;

  const handleAnswer = async (answer: any) => {
    const current = questions[currentQuestionIndex];
    if (!current) return;

    userAnswerStore.saveAnswer(current.question.id, answer);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const fullPayload = userAnswerStore.getPayload();
      console.log("fullPayload =", fullPayload);
      
      if (fullPayload) {
        try {
          await testResultStore.createTestResult(fullPayload);

          const result = testResultStore.result;

          if (result?.result?.percentage !== undefined) {
            alert(`Тест завершён! Вы набрали ${result.result.percentage}%`);
          } else {
            alert("Результаты теста отправлены!");
          }
        } catch (e) {
          alert("Ошибка при отправке результатов");
          console.error(e);
        }

        userAnswerStore.reset();
      } else {
        alert("Недостаточно данных для отправки результатов");
      }

      setStart(false);
      setCurrentQuestionIndex(0);
    }
  };

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
  const { type } = question;

  let QuestionComponent;

  switch (type) {
    case "SINGLE_CHOICE":
      QuestionComponent = TestSingleChoiceCard;
      break;
    case "MULTIPLE_CHOICE":
      QuestionComponent = TestMultipleChoiceCard;
      break;
    case "SHORT_ANSWER":
      QuestionComponent = TestTextAnswerCard;
      break;
    case "TRUE_FALSE":
      QuestionComponent = TestYesNoCard;
      break;
    case "DESCRIPTIVE":
      QuestionComponent = TestDescriptiveCard;
      break;
    case "SURVEY":
      QuestionComponent = TestSurveyCard;
      break;
    default:
      QuestionComponent = () => <Typography>Тип вопроса не поддерживается</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Вопрос №{currentQuestionIndex + 1} / {questions.length}
      </Typography>
      <QuestionComponent
        question={current}
        onNext={handleAnswer}
      />
    </Box>
  );
});

export default TestPage;
