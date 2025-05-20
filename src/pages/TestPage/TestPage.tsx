import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom"; // Импортируем useParams
import { Context } from "../..";
import TestStartPage from "./components/test-start-page";

import { Typography, Box } from "@mui/material";
import TestSingleChoiceCard from "./components/testSingleChoiceCard";
import TestTextAnswerCard from "./components/testTextAnswerCard";
import TestYesNoCard from "./components/testYesNoCard";
import TestDescriptiveCard from "./components/testDescriptiveCard";
import TestSurveyCard from "./components/testSurveyCard";
import TestMultipleChoiceCard from "./components/testMultipleChoiceCard";

const TestPage = observer(() => {
  const { questionsStore } = useContext(Context);
  const [start, setStart] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { testId } = useParams(); // Получаем testId из URL

  useEffect(() => {
    if (start && testId) {
      const parsedId = parseInt(testId, 10);
      if (!isNaN(parsedId)) {
        questionsStore.fetchQuestionsByTestId(parsedId);
        setCurrentQuestionIndex(0);
      }
    }
  }, [start, testId, questionsStore]);

  const questions = questionsStore.questions;
  const loading = questionsStore.loading;
  const error = questionsStore.error;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Тест завершен!");
      setStart(false);
    }
  };

  if (!start) {
    return <TestStartPage start={start} setStart={setStart} />;
  }

  if (loading) {
    return <Typography sx={{ mt: 4, textAlign: "center" }}>Загрузка вопросов...</Typography>;
  }

  if (error) {
    return <Typography sx={{ mt: 4, textAlign: "center", color: "red" }}>{error}</Typography>;
  }

  if (!questions.length) {
    console.log(testId);
    return <Typography sx={{ mt: 4, textAlign: "center" }}>Нет доступных вопросов</Typography>;
  }

  const current = questions[currentQuestionIndex];
  const { question, position } = current;
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
      <QuestionComponent question={current} onNext={handleNextQuestion} />
    </Box>
  );
});

export default TestPage;
