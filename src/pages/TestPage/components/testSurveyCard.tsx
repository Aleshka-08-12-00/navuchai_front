import React, { useState } from "react";
import { Typography, TextField, Button, Stack } from "@mui/material";

const TestSurveyCard = ({
  question,
  onNext,
}: {
  question: any;
  onNext: () => void;
}) => {
  const { text, answers } = question.question;

  // answers.subQuestions — массив под-вопросов
  const subQuestions: string[] = answers?.subQuestions || [];
  const [responses, setResponses] = useState<string[]>(
    Array(subQuestions.length).fill("")
  );

  const handleChange = (index: number, value: string) => {
    const updated = [...responses];
    updated[index] = value;
    setResponses(updated);
  };

  const isComplete = responses.every((r) => r.trim() !== "");

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {text}
      </Typography>
      <Stack spacing={2}>
        {subQuestions.map((subQ, index) => (
          <TextField
            key={index}
            label={`Вопрос ${index + 1}`}
            value={responses[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={subQ}
            fullWidth
          />
        ))}
      </Stack>
      <Button
        disabled={!isComplete}
        onClick={onNext}
        variant="outlined"
        color="success"
        sx={{ mt: 2 }}
      >
        Следующий вопрос
      </Button>
    </>
  );
};

export default TestSurveyCard;
