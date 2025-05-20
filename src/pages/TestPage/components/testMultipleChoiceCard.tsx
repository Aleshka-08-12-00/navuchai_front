import React, { useState } from "react";
import { Checkbox, Typography, Button, Stack, FormControlLabel } from "@mui/material";

const TestMultipleChoiceCard = ({ question, onNext }: { question: any; onNext: () => void }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { text, answers } = question.question;

  const toggle = (answer: string) => {
    setSelected(prev =>
      prev.includes(answer) ? prev.filter(a => a !== answer) : [...prev, answer]
    );
  };

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2 }}>{text}</Typography>
      <Stack>
        {answers.allAnswer.map((answer: string, i: number) => (
          <FormControlLabel
            key={i}
            control={
              <Checkbox
                checked={selected.includes(answer)}
                onChange={() => toggle(answer)}
              />
            }
            label={answer}
          />
        ))}
      </Stack>
      <Button disabled={selected.length === 0} onClick={onNext} variant="outlined" color="success" sx={{ mt: 2 }}>
        Следующий вопрос
      </Button>
    </>
  );
};

export default TestMultipleChoiceCard;
