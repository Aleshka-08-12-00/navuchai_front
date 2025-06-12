import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Context } from "../../..";

const QuestionsTestTable: React.FC = observer(() => {
  const { resultTableStore } = React.useContext(Context);

  // Вытягиваем checked_answers из результата
  const questions =
    resultTableStore.selectedResult?.result?.checked_answers?.map((item: any) => ({
      id: item.question_id,
      text: item.question_text,
      timeSeconds: item.time_seconds,
      options: item.options?.allAnswer || [],
      userAnswer:
        item.check_details?.user_answer ??
        (item.check_details?.user_answers ? item.check_details.user_answers.join(", ") : ""),
      correctAnswer:
        item.check_details?.correct_answer ??
        (item.check_details?.correct_answers ? item.check_details.correct_answers.join(", ") : ""),
      isCorrect: item.is_correct,
      questionType: item.question_type,
      isTimeExceeded: item.is_time_exceeded,
    })) ?? [];

  // Утилита для нормализации ответа в массив строк (универсально для одиночных и множественных)
  function stripHtml(html: string): string {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function normalizeAnswers(ans: any): string[] {
  if (!ans) return [];
  if (Array.isArray(ans)) return ans.map(a => stripHtml(String(a).trim()));
  if (typeof ans === "string") return ans.split(",").map(a => stripHtml(a.trim()));
  return [stripHtml(String(ans).trim())];
}

  const [openRows, setOpenRows] = React.useState<Record<number, boolean>>({});

  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="questions table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>№</TableCell>
            <TableCell>Вопрос</TableCell>
            <TableCell align="right">Время (сек)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Нет данных по вопросам
              </TableCell>
            </TableRow>
          ) : (
            questions.map((q, index) => {
              const correctAnswers = normalizeAnswers(q.correctAnswer);
              const userAnswers = normalizeAnswers(q.userAnswer);

              return (
                <React.Fragment key={q.id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(q.id)}
                        aria-label={openRows[q.id] ? "Свернуть" : "Развернуть"}
                      >
                        {openRows[q.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div dangerouslySetInnerHTML={{ __html: q.text }} />
                    </TableCell>
                    <TableCell align="right">{q.timeSeconds}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                      <Collapse in={openRows[q.id]} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="subtitle1" gutterBottom component="div">
                            Варианты ответов
                          </Typography>

                          {q.options.length === 0 ? (
                            <Typography variant="body2" color="textSecondary">
                              Варианты ответов отсутствуют
                            </Typography>
                          ) : (
                            <Table size="small" aria-label="options">
                              <TableBody>
                                {q.options.map((opt: string, i: number) => {
                                  const cleanOpt = opt.replace(/<\/?p>/g, "").trim();

                                  const isCorrect = correctAnswers.includes(cleanOpt);
                                  const isUser = userAnswers.includes(cleanOpt);

                                  return (
                                    <TableRow
                                      key={i}
                                      sx={{
                                        backgroundColor: isCorrect
                                          ? "rgba(76, 175, 80, 0.3)" // зелёный для правильных
                                          : isUser
                                          ? "rgba(244, 67, 54, 0.3)" // красный для выбранных неправильных
                                          : "inherit",
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        <div dangerouslySetInnerHTML={{ __html: opt }} />
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          )}

                          <Box mt={2}>
                            <Typography variant="body2">
                              <b>Ваш ответ:</b>{" "}
                              <span style={{ color: q.isCorrect ? "green" : "red" }}>
                                {q.userAnswer || "-"}
                              </span>
                            </Typography>
                            <Typography variant="body2">
                              <b>Правильный ответ:</b> {q.correctAnswer || "-"}
                            </Typography>
                            {q.isTimeExceeded && (
                              <Typography variant="body2" color="error">
                                Превышено время на вопрос
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default QuestionsTestTable;
