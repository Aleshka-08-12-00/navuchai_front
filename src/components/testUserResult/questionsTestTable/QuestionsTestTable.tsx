import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function createData(
  question: string,
  title: string,
  time: string,
  category: string,
  description: string
) {
  return {
    question,
    title,
    time,
    category,
    description,
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.question}
        </TableCell>
        <TableCell align="right">{row.title}</TableCell>
        <TableCell align="right">{row.time}</TableCell>
        <TableCell align="right">{row.category}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Описание вопроса
              </Typography>
              <Typography>{row.description}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData('Вопрос №1', 'Название вопроса 1', '00:30', 'Категория №1', 'Описание вопроса 1'),
  createData('Вопрос №2', 'Название вопроса 2', '01:00', 'Категория №1', 'Описание вопроса 2'),
  createData('Вопрос №3', 'Название вопроса 3', '00:45', 'Категория №2', 'Описание вопроса 3'),
  createData('Вопрос №4', 'Название вопроса 4', '00:20', 'Категория №2', 'Описание вопроса 4'),
  createData('Вопрос №5', 'Название вопроса 5', '00:50', 'Категория №3', 'Описание вопроса 5'),
  createData('Вопрос №6', 'Название вопроса 6', '00:40', 'Категория №3', 'Описание вопроса 6'),
];

export default function QuestionsTestTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Вопрос</TableCell>
            <TableCell align="right">Название</TableCell>
            <TableCell align="right">Время</TableCell>
            <TableCell align="right">Категория</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.question} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
