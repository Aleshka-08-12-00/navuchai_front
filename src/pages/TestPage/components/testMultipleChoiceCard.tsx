import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CardMedia,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const TestMultipleChoiceCard = ({
  question,
  onNext,
}: {
  question: any;
  onNext: (answer: any) => void;
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { text, answers, image } = question.question;

  const toggle = (answer: string) => {
    setSelected((prev) =>
      prev.includes(answer) ? prev.filter((a) => a !== answer) : [...prev, answer]
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4f7fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 4,
      }}
    >
      <Card sx={{ maxWidth: 600, width: "100%", p: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Вопрос
          </Typography>
          <Typography variant="body1" mb={2}>
            {text}
          </Typography>

          {image && (
            <>
              <CardMedia
                component="img"
                height="240"
                image={image}
                alt="question image"
                sx={{ borderRadius: 2, objectFit: "cover", mb: 1 }}
              />
              <Typography
                variant="caption"
                color="primary"
                sx={{ cursor: "pointer", mb: 2, display: "block" }}
                onClick={() => window.open(image, "_blank")}
              >
                Увеличить изображение
              </Typography>
            </>
          )}

          <Stack spacing={1}>
            {answers?.allAnswer?.map((answer: string, i: number) => (
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

          <Button
            fullWidth
            disabled={selected.length === 0}
            onClick={() => onNext(selected)} // передаем массив выбранных ответов напрямую
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

export default TestMultipleChoiceCard;
