import React, { useState } from "react";
import { TextField, Typography, Button } from "@mui/material";

const TestDescriptiveCard = ({ question, onNext }: { question: any; onNext: () => void }) => {
  const [text, setText] = useState("");
  const { text: questionText } = question.question;

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2 }}>{questionText}</Typography>
      <TextField
        multiline
        rows={6}
        fullWidth
        placeholder="Введите развёрнутый ответ..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <Button disabled={text.trim() === ""} onClick={onNext} variant="outlined" color="success" sx={{ mt: 2 }}>
        Следующий вопрос
      </Button>
    </>
  );
};

export default TestDescriptiveCard;
