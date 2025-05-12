import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DialogPopupProps {
    title: string;
    mainText: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    onConfirm?: () => void;
}

export default function DialogPopup({ title, mainText, open, setOpen, onConfirm }: DialogPopupProps) {
    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {mainText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='contained' color='inherit'>
                        Нет
                    </Button>
                    <Button onClick={handleConfirm} color='success' variant='contained' autoFocus>
                        Да
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}