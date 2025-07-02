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
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Context } from "../../..";

function QuestionsTestTable() {
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

  // Восстановленная функция для нормализации ответов (для сравнения)
  function normalizeAnswers(ans: any): string[] {
    if (!ans) return [];
    if (Array.isArray(ans)) return ans.map(a => stripHtml(String(a).trim()));
    if (typeof ans === "string") return ans.split(",").map(a => stripHtml(a.trim()));
    return [stripHtml(String(ans).trim())];
  }

  // Универсальная функция для извлечения ключа ответа из HTML (текст + src картинок)
  function extractAnswerKey(html: string): string[] {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    // Извлекаем все src из img
    const imgs = Array.from(tmp.getElementsByTagName("img")).map(img => img.src);
    // Извлекаем текст
    const text = tmp.textContent?.trim() || "";
    if (imgs.length && text) return [text, ...imgs];
    if (imgs.length) return imgs;
    return [text];
  }

  // Функция для нормализации ключа ответа (без HTML, пробелов, регистра)
  function normalizeAnswerKey(html: string): string {
    return stripHtml(html).trim().toLowerCase();
  }

  const [openRows, setOpenRows] = React.useState<Record<number, boolean>>({});

  const toggleRow = (id: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const questionTypeLabels: Record<string, string> = {
    'single_choice': 'Одиночный выбор',
    'multiple_choice': 'Множественный выбор',
    'true_false': 'Верно/Неверно',
    'descriptive': 'Развернутый',
    'short_answer': 'Краткий ответ',
    'survey': 'Опрос',
    // ... другие типы ...
  };
  const questionTypeColors = {
    'single_choice': 'primary',
    'multiple_choice': 'secondary',
    'true_false': 'success',
    'descriptive': 'info',
    'short_answer': 'warning',
    'survey': 'default',
  } as const;

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 6, background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)' }}>
      <Table aria-label="questions table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ width: 48, p: 0 }} />
            <TableCell sx={{ fontWeight: 500, fontSize: 13, p: 0 }}>Вопрос</TableCell>
            <TableCell align="right" sx={{ fontWeight: 500, fontSize: 13, width: 120, p: 0, pr: 2 }}>Время (сек)</TableCell>
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
              // Для single_choice и true_false сравниваем как одну строку, для остальных — как массив
              let correctAnswerKeys: string[];
              let userAnswerKeys: string[];
              if (q.questionType === "SINGLE_CHOICE" || q.questionType === "single_choice" || q.questionType === "true_false") {
                correctAnswerKeys = extractAnswerKey(q.correctAnswer).map(key => key.trim().toLowerCase());
                userAnswerKeys = extractAnswerKey(q.userAnswer).map(key => key.trim().toLowerCase());
              } else {
                correctAnswerKeys = normalizeAnswers(q.correctAnswer).map(normalizeAnswerKey);
                userAnswerKeys = normalizeAnswers(q.userAnswer).map(normalizeAnswerKey);
              }

              // Определяем цвет полоски-статуса
              let statusColor = q.isCorrect ? '#4caf50' : q.isTimeExceeded ? '#f44336' : '#ff9800';
              return (
                <React.Fragment key={q.id}>
                  <TableRow
                    hover
                    sx={{
                      transition: 'background 0.3s',
                      '&:hover': { background: 'linear-gradient(90deg, #e3f2fd 0%, #f8fafc 100%)' },
                      position: 'relative',
                      height: 64,
                    }}
                  >
                    {/* Кнопка раскрытия/сворачивания с анимацией */}
                    <TableCell sx={{ width: 48, textAlign: 'center', background: 'transparent', border: 'none', p: 0 }}>
                      <IconButton
                        aria-label="expand row"
                        size="medium"
                        onClick={() => toggleRow(q.id)}
                        sx={{
                          transition: 'background 0.2s, box-shadow 0.2s',
                          borderRadius: '50%',
                          ml: 2,
                          mr: 1,
                          boxShadow: openRows[q.id] ? 2 : 0,
                          background: openRows[q.id] ? 'rgba(33,150,243,0.08)' : 'transparent',
                          '&:hover': {
                            background: 'rgba(33,150,243,0.15)',
                            boxShadow: 3,
                          },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            transition: 'transform 0.3s',
                            transform: openRows[q.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: openRows[q.id] ? '#1976d2' : '#333',
                          }}
                        >
                          <KeyboardArrowDownIcon fontSize="large" />
                        </Box>
                      </IconButton>
                    </TableCell>
                    {/* Полоска-статус с градиентом и тенью */}
                    <Box
                      component="td"
                      sx={{
                        width: 8,
                        background: statusColor,
                        borderRadius: 2,
                        position: 'absolute',
                        left: 0,
                        top: 8,
                        bottom: 8,
                        zIndex: 1,
                        height: '80%',
                        minWidth: 8,
                        maxWidth: 8,
                        boxShadow: openRows[q.id] ? '0 0 8px 2px rgba(33,150,243,0.15)' : 'none',
                        transition: 'box-shadow 0.3s, background 0.3s',
                      }}
                    />
                    {/* Вопрос + аватар с номером */}
                    <TableCell sx={{
                      zIndex: 2,
                      background: 'transparent',
                      border: 'none',
                      p: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      {/* <Avatar sx={{
                        bgcolor: openRows[q.id] ? '#1565c0' : '#1976d2',
                        color: '#fff',
                        width: 32,
                        height: 32,
                        fontWeight: 700,
                        fontSize: 15,
                        boxShadow: openRows[q.id] ? 4 : 2,
                        transition: 'background 0.3s, box-shadow 0.3s',
                        mr: 1.2
                      }}>
                        {index + 1}
                      </Avatar> */}
                      №  {index + 1}
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, ml: 0, fontSize: 15, textAlign: 'left' }}>
                        <span dangerouslySetInnerHTML={{ __html: q.text }} />
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ zIndex: 2, background: 'transparent', border: 'none', width: 120, p: 0, pr: 6 }}>
                      <Box sx={{ fontWeight: 500, color: q.isTimeExceeded ? 'error.main' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {q.timeSeconds}
                        {q.isTimeExceeded && (
                          <ErrorOutlineIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                      <Collapse
                        in={openRows[q.id]}
                        timeout={400}
                        unmountOnExit
                        sx={{
                          '& .MuiBox-root': {
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)',
                            borderRadius: 4,
                            boxShadow: 6,
                            p: { xs: 2, sm: 4 },
                            mt: 1,
                            mb: 2,
                            transition: 'box-shadow 0.3s, background 0.3s',
                            animation: openRows[q.id] ? 'fadeIn 0.5s' : 'none',
                          },
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom component="div" sx={{ fontWeight: 600, mb: 1 }}>
                          Варианты ответов
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {q.options.length === 0 ? (
                          <Typography variant="body2" color="textSecondary">
                            Варианты ответов отсутствуют
                          </Typography>
                        ) : (
                          <Table size="small" aria-label="options">
                            <TableBody>
                              {q.options.map((opt: string, i: number) => {
                                const optKeyArr = extractAnswerKey(opt).map(key => key.trim().toLowerCase());
                                const isCorrect = optKeyArr.some(key => correctAnswerKeys.includes(key));
                                const isUser = optKeyArr.some(key => userAnswerKeys.includes(key));
                                return (
                                  <TableRow
                                    key={i}
                                    sx={{
                                      backgroundColor: isCorrect
                                        ? "rgba(76, 175, 80, 0.10)"
                                        : isUser
                                          ? "rgba(244, 67, 54, 0.08)"
                                          : "inherit",
                                      transition: 'background 0.2s',
                                      borderRadius: 2,
                                      boxShadow: isCorrect || isUser ? 2 : 0,
                                      '.MuiTableCell-root': {
                                        border: 'none',
                                      },
                                    }}
                                  >
                                    <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.2 }}>
                                      {isCorrect && <CheckCircleIcon color="success" fontSize="small" />}
                                      {!isCorrect && isUser && <CancelIcon color="error" fontSize="small" />}
                                      <span dangerouslySetInnerHTML={{ __html: opt }} />
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        )}

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
}

export default observer(QuestionsTestTable);
