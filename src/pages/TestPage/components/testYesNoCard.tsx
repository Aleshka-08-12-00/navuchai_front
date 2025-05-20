import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";

const TestYesNoCard = ({ question, onNext }: { question: any; onNext: () => void }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { text, image } = question.question;

  return (
    <Box sx={{ backgroundColor: "#f4f7fa", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start", py: 4 }}>
      <Card sx={{ maxWidth: 600, width: "100%", p: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>Вопрос</Typography>
          <Typography variant="body1" mb={2}>{text}</Typography>

          {image && (
            <>
              <CardMedia component="img" height="240" image={image} alt="question image" sx={{ borderRadius: 2, objectFit: "cover", mb: 1 }} />
              <Typography variant="caption" color="primary" sx={{ cursor: "pointer", mb: 2, display: "block" }} onClick={() => window.open(image, "_blank")}>
                Увеличить изображение
              </Typography>
            </>
          )}

          <RadioGroup value={selected || ""} onChange={(e) => setSelected(e.target.value)}>
            <Stack spacing={1}>
              <FormControlLabel value="Да" control={<Radio />} label="Да" />
              <FormControlLabel value="Нет" control={<Radio />} label="Нет" />
            </Stack>
          </RadioGroup>

          <Button
            fullWidth
            disabled={!selected}
            onClick={onNext}
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Следующий вопрос
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestYesNoCard;
