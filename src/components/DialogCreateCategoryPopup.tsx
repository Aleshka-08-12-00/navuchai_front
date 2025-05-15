import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, Input, InputLabel } from '@mui/material';

interface DialogCreateCategoryPopupProps {
    title: string;
    mainText: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    onConfirm?: () => void;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DialogCreateCategoryPopup({ 
    title, 
    mainText, 
    open, 
    setOpen, 
    onConfirm, 
    value, 
    onChange 
}: DialogCreateCategoryPopupProps) {
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
                    <DialogContentText id="alert-dialog-description" style={{maxWidth: 400}}>
                        {mainText}
                    </DialogContentText>
                </DialogContent>
                <FormControl sx={{ m: 3, minWidth: '60%' }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-amount">Название категории</InputLabel>
                    <Input
                        id="standard-adornment-amount"
                        value={value}
                        onChange={onChange}
                    />
                </FormControl>
                <DialogActions>
                    <Button onClick={handleClose} variant='contained' color='inherit'>
                        Закрыть
                    </Button>
                    <Button onClick={handleConfirm} color='success' variant='contained' autoFocus>
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}