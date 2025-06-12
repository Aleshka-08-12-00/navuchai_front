import * as React from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Context } from '../../..';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
  isUserAnswer: boolean;
}

interface QuestionData {
  question: string;
  title: string;
  options: Option[];
  correctCount: number;
  timeSpent: number;
}

const stripHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const Row = ({ row }: { row: QuestionData }) => {
  const [open, setOpen] = React.useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isMultiple = row.correctCount > 1;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.question}</TableCell>
        <TableCell align="right">{stripHtml(row.title)}</TableCell>
        <TableCell align="right">{formatTime(row.timeSpent)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Варианты ответа
              </Typography>
              {isMultiple && (
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Несколько правильных ответов
                </Typography>
              )}
              <Box component="ol" sx={{ pl: 3, m: 0 }}>
                {row.options.map((option) => {
                  const { isCorrect, isUserAnswer } = option;

                  let bgColor = 'transparent';
                  let textColor = 'inherit';
                  let borderColor = '#ccc';

                  if (isCorrect && isUserAnswer) {
                    bgColor = '#9af49e'; // зелёный фон — правильно выбран
                    textColor = '#000';
                  } else if (!isCorrect && isUserAnswer) {
                    bgColor = '#f58d8f'; // красный фон — пользователь выбрал неверный
                    textColor = '#000';
                  } else if (isCorrect && !isUserAnswer) {
                    borderColor = '#1677ff'; // синяя рамка — правильный, но не выбран
                  }

                  return (
                    <li
                      key={`${option.id}-${stripHtml(option.text)}`}
                      style={{
                        marginBottom: 4,
                        listStyle: 'decimal',
                        paddingLeft: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Chip
                        label={stripHtml(option.text)}
                        variant="outlined"
                        sx={{
                          my: 0.5,
                          backgroundColor: bgColor,
                          color: textColor,
                          borderColor:
                            bgColor !== 'transparent' ? 'transparent' : borderColor,
                        }}
                      />
                      {/* Показываем текст, если правильный, но не выбран */}
                      {isCorrect && !isUserAnswer && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ fontStyle: 'italic' }}
                        >
                          Правильный вариант ответа
                        </Typography>
                      )}
                    </li>
                  );
                })}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const QuestionsTestTable: React.FC = observer(() => {
  const { resultTableStore } = React.useContext(Context);
  const { resultId } = useParams();
  const [questions, setQuestions] = React.useState<QuestionData[]>([]);

React.useEffect(() => {
  const load = async () => {
    if (!resultId) return;
    const parsedId = parseInt(resultId, 10);
    if (isNaN(parsedId)) return;

    const data = await resultTableStore.getInfoByIdResultTest(parsedId);
    if (!data || !Array.isArray(data.questions)) return;
    console.log("Вопросы из результата:", data.questions);
    const mappedQuestions: QuestionData[] = data.questions.map((q: any, index: any) => ({
      question: q.question,
      title: q.title,
      timeSpent: q.timeSpent,
      correctCount: q.options.filter((o: any) => o.isCorrect).length,
      options: q.options.map((opt: any, i: any) => ({
        id: opt.id ?? i,
        text: opt.text,
        isCorrect: opt.isCorrect,
        isUserAnswer: opt.isUserAnswer,
      })),
    }));

    setQuestions(mappedQuestions);
  };

  load();
}, [resultId]);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
       <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Вопрос</TableCell>
          <TableCell align="right">Название</TableCell>
          <TableCell align="right">Время</TableCell>
        </TableRow>
      </TableHead>
        <TableBody>
          {questions.map((q, index) => (
            <Row key={q.question} row={q} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default QuestionsTestTable;
