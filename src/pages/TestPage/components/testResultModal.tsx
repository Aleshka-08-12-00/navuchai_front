import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";

interface TestResultModalProps {
  open: boolean;
  resultPercentage?: number | null;
  onClose: () => void;
}

const TestResultModal: React.FC<TestResultModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Тест завершён</DialogTitle>
      <DialogContent>
        <Typography>
          Вы набрали 0% по тесту.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestResultModal;
