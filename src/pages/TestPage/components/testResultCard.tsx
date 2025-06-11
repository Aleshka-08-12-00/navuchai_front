import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import { CheckCircle, Cancel, Close } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { ITestResultCreateResponse, ITextCheckDetails, IChoiceCheckDetails } from "../../../interface/interfaceStore";
import authStore from "../../../store/authStore";

interface TestResultCardProps {
  open: boolean;
  resultTestData: ITestResultCreateResponse;
  onClose: () => void;
}

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

const TestResultCard: React.FC<TestResultCardProps> = ({
  open,
  onClose,
  resultTestData,
}) => {
  const navigate = useNavigate();
  const { percentage, total_time_seconds, checked_answers } = resultTestData.result;

  const [userName, setUserName] = useState<string>("Гость");

  useEffect(() => {
    if (open) {
      authStore.authMe().then(user => {
        if (user?.name) {
          setUserName(user.name);
        }
      });
    }
  }, [open]);

  const handleClose = () => {
    onClose();
    navigate('/main-page');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          pr: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
          Результаты теста
        </Typography>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          size="large"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box mb={2} textAlign="center">
          <Typography
            variant="h6"
            fontWeight="bold"
            color={percentage >= 60 ? "success.main" : "error.main"}
          >
            Вы набрали {percentage}%
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Общее время прохождения: {total_time_seconds} сек.
          </Typography>

          {/* Здесь отображаем имя пользователя под результатами */}
          <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: "medium" }}>
            Пользователь: {userName}
          </Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Ответы по вопросам:
          </Typography>
          <List>
            {checked_answers.map((answer, index) => {
              let userAnswerDisplay = "—";

              if (answer.check_details) {
                if (
                  answer.question_type === "SINGLE_CHOICE" ||
                  answer.question_type === "SHORT_ANSWER" ||
                  answer.question_type === "DESCRIPTIVE" ||
                  answer.question_type === "TRUE_FALSE"
                ) {
                  userAnswerDisplay = stripHtml(
                    (answer.check_details as ITextCheckDetails).user_answer ?? "—"
                  );
                } else {
                  userAnswerDisplay =
                    ((answer.check_details as IChoiceCheckDetails).user_answers ?? []).join(", ") || "—";
                }
              }

              return (
                <ListItem
                  key={answer.question_id}
                  sx={{
                    backgroundColor: answer.is_correct ? "#e8f5e9" : "#ffebee",
                    borderRadius: 2,
                    mb: 1,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemIcon sx={{ mt: 0.5 }}>
                    {answer.is_correct ? (
                      <CheckCircle sx={{ color: green[600] }} />
                    ) : (
                      <Cancel sx={{ color: red[500] }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography fontWeight="medium">
                        Вопрос {index + 1}: {stripHtml(answer.question_text)}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">
                          Ответ: <strong>{userAnswerDisplay}</strong>
                        </Typography>
                        <Typography variant="body2">
                          {answer.is_correct ? "Ответ верный" : "Ответ неверный"} | Потрачено времени: {answer.time_seconds} сек.
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          pb: 2,
          pt: 1,
        }}
      >
        <Button onClick={handleClose} variant="contained" color="primary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestResultCard;