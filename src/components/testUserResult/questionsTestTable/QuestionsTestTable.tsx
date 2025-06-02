// QuestionsTestTable.tsx
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
  timeSpent: string;
  description: string;
  options: Option[];
  correctCount: number;
  userAnswerIds: number[];
}

const stripHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const Row = ({ row }: { row: QuestionData }) => {
  const [open, setOpen] = React.useState(false);

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
        <TableCell align="right">{stripHtml(row.timeSpent)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Описание вопроса
              </Typography>
              <Typography variant="body2" gutterBottom>{stripHtml(row.description)}</Typography>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Правильный/Неправильный ответ
              </Typography>
              <Box component="ol" sx={{ pl: 3, m: 0 }}>
                {row.options.map((option) => {
                  const { isCorrect, isUserAnswer } = option;
                  const isMultiple = row.correctCount > 1;
  
              let bgColor = 'transparent';
              let textColor = 'inherit';
              let borderColor = '#ccc';

                            if (isMultiple) {
                  if (isCorrect && isUserAnswer) {
                    bgColor = '#9af49e';
                    textColor = '#000';
                  } else if (!isCorrect && isUserAnswer) {
                    bgColor = '#f58d8f';
                    textColor = '#000';
                  } else if (isCorrect && !isUserAnswer) {
                    borderColor = '#9af49e';
                    textColor = '#000';
                  }
                } else {
                  if (isUserAnswer) {
                    if (isCorrect) {
                      bgColor = '#9af49e';
                      textColor = '#000';
                    } else {
                      bgColor = '#f58d8f';
                      textColor = '#000';
                    }
                  }
                }

                return (
                  <li key={option.id} style={{ marginBottom: 4, listStyle: 'decimal', paddingLeft: 8 }}>
                    <Chip
                      label={stripHtml(option.text)}
                      variant="outlined"
                      sx={{
                        my: 0.5,
                        backgroundColor: bgColor,
                        color: textColor,
                        borderColor: bgColor !== 'transparent' ? 'transparent' : borderColor,
                      }}
                    />
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

      if (data && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      }
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
          {questions.map((q, idx) => (
            <Row key={idx} row={q} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default QuestionsTestTable;
