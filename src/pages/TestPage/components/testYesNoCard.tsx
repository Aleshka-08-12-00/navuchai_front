import React, { useState } from "react";
import { RadioGroup, FormControlLabel, Radio, Typography, Button } from "@mui/material";

const TestYesNoCard = ({ question, onNext }: { question: any; onNext: () => void }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { text } = question.question;

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2 }}>{text}</Typography>
      <RadioGroup value={selected || ""} onChange={e => setSelected(e.target.value)}>
        <FormControlLabel value="Да" control={<Radio />} label="Да" />
        <FormControlLabel value="Нет" control={<Radio />} label="Нет" />
      </RadioGroup>
      <Button disabled={!selected} onClick={onNext} variant="outlined" color="success" sx={{ mt: 2 }}>
        Следующий вопрос
      </Button>
    </>
  );
};

export default TestYesNoCard;
