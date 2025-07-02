import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
// import TestTimer from "./testTimer";

const TestTextAnswerCard = ({
  question,
  onNext,
}: {
  question: any;
  onNext: (answer: any) => void;
}) => {
  const [text, setText] = useState("");
  const { question: qData } = question;
  const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

  const handleTimeEnd = () => {
    const trimmed = text.trim();
    if (trimmed !== "") {
      onNext(trimmed);
    } else {
      onNext(null);
    }
  };

  return (
    <Box
      sx={{
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

          {/* <TestTimer timeLimit={qData.time_limit} onTimeEnd={handleTimeEnd} /> */}
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

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Введите ответ..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <Button
            fullWidth
            disabled={text.trim() === ""}
            onClick={() => onNext(text.trim())}
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

export default TestTextAnswerCard;
