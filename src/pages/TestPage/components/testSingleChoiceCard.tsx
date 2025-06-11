import React, { useState } from "react";
import {
  Box,
  Radio,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CardMedia,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import TestTimer from "./testTimer";

const TestSingleChoiceCard = ({
  question,
  onNext,
}: {
  question: any;
  onNext: (answer: any) => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { text, answers, image, time_limit } = question.question;
  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

  const handleTimeEnd = () => {
    if (selected) {
      onNext(selected);
    } else {
      onNext(null);
    }
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Вопрос
            </Typography>

            <TestTimer timeLimit={time_limit} onTimeEnd={handleTimeEnd} />
          </Box>

          <Typography variant="body1" mb={2}>
            {stripHtml(text)}
          </Typography>

          {image && (
            <>
              <CardMedia
                component="img"
                height="240"
                image={image}
                alt="question image"
                sx={{
                  borderRadius: 2,
                  objectFit: "cover",
                  mb: 1,
                }}
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

          <RadioGroup value={selected || ""} onChange={(e) => setSelected(e.target.value)}>
            <Stack spacing={1}>
              {answers?.allAnswer?.map((answer: string, i: number) => (
                <FormControlLabel key={i} value={answer} control={<Radio />} label={stripHtml(answer)} />
              ))}
            </Stack>
          </RadioGroup>

          <Button
            fullWidth
            disabled={!selected}
            onClick={() => onNext(selected)}
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

export default TestSingleChoiceCard;
