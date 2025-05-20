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

const TestDescriptiveCard = ({ question, onNext }: { question: any; onNext: () => void }) => {
  const [answer, setAnswer] = useState("");
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

          <TextField
            fullWidth
            placeholder="Ваш ответ"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <Button
            fullWidth
            disabled={!answer.trim()}
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

export default TestDescriptiveCard;
