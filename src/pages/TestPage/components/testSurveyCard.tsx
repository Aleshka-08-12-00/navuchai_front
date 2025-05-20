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

const TestSurveyCard = ({ question, onNext }: { question: any; onNext: () => void }) => {
  const [value, setValue] = useState(5);
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

          <Slider
            value={value}
            onChange={(_, newValue) => setValue(newValue as number)}
            min={0}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
          />

          <Button
            fullWidth
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

export default TestSurveyCard;
