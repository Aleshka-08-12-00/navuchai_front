import React, { useState } from "react";
import { Radio, Typography, Button, Stack } from "@mui/material";

const TestSingleChoiceCard = ({ question, onNext }: { question: any; onNext: () => void }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { text, answers } = question.question;

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2 }}>{text}</Typography>
      <Stack>
        {answers.allAnswer.map((answer: string, i: number) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <Radio
              checked={selected === answer}
              onChange={() => setSelected(answer)}
              name="single-choice-group"
            />
            <Typography>{answer}</Typography>
          </div>
        ))}
      </Stack>
      <Button disabled={!selected} onClick={onNext} variant="outlined" color="success" sx={{ mt: 2 }}>
        Следующий вопрос
      </Button>
    </>
  );
};

export default TestSingleChoiceCard;
