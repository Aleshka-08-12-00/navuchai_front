import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Slider,
} from "@mui/material";
import TestTimer from "./testTimer";

interface QuestionProps {
  question: {
    question: {
      text: string;
      image?: string;
      time_limit?: number;
    };
  };
  onNext: (answer: { answer: number } | null) => void;
}

const TestSurveyCard: React.FC<QuestionProps> = ({ question, onNext }) => {
  const [value, setValue] = useState<number>(5);
  const qData = question.question;
  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

  if (!qData) return null;

  const handleTimeEnd = () => {
    onNext({ answer: value });
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
              {qData.time_limit && (
                <TestTimer timeLimit={qData.time_limit} onTimeEnd={handleTimeEnd} />
              )}
          </Box>
          <Typography variant="body1" mb={2}>
            {stripHtml(qData.text)}
          </Typography>

          {qData.image && (
            <>
              <CardMedia
                component="img"
                height="240"
                image={qData.image}
                alt="question image"
                sx={{ borderRadius: 2, objectFit: "cover", mb: 1 }}
              />
              <Typography
                variant="caption"
                color="primary"
                sx={{ cursor: "pointer", mb: 2, display: "block" }}
                onClick={() => window.open(qData.image, "_blank")}
              >
                Увеличить изображение
              </Typography>
            </>
          )}

          <Slider
            value={value}
            onChange={(_, val) => setValue(val as number)}
            min={1}
            max={10}
            step={1}
            valueLabelDisplay="auto"
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            onClick={() => onNext({ answer: value })}
            variant="contained"
            color="primary"
          >
            Следующий вопрос
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestSurveyCard;
