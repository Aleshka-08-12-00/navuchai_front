import { Checkbox, IconButton, Stack, Typography, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Snackbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';

import SvgIcon from '@mui/material/SvgIcon';
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import MainCard from "../../../components/MainCard";
import { IQuestionInTest } from "../../../interface/interfaceStore";
import { Context } from "../../..";

type FontAwesomeSvgIconProps = {
    icon: any;
};

const FontAwesomeSvgIcon = React.forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>(
    (props, ref) => {
        const { icon } = props;

        const {
            icon: [width, height, , , svgPathData],
        } = icon;

        return (
            <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
                {typeof svgPathData === 'string' ? (
                    <path d={svgPathData} />
                ) : (
                    svgPathData.map((d: string, i: number) => (
                        <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
                    ))
                )}
            </SvgIcon>
        );
    },
);

const Example = ({ htmlContent }: { htmlContent: string }) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
};

const MultipleChoiceCard = observer(({ 
    index, 
    isSelected, 
    onSelectChange, 
    ...obj 
}: IQuestionInTest & { 
    index: number; 
    isSelected: boolean; 
    onSelectChange: (checked: boolean) => void; 
}) => {
    const { testQuestionListPageStore } = React.useContext(Context);
    const { deleteQuestionById } = testQuestionListPageStore;
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleDelete = (idQuestion: number) => {
        setSelectedQuestionId(idQuestion);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleConfirmDelete = async () => {
        if (selectedQuestionId) {
            try {
                await deleteQuestionById(selectedQuestionId, Number(id));
                setDeleteDialogOpen(false);
                setSelectedQuestionId(null);
                showAlert('Вопрос успешно удален', 'success');
            } catch (error) {
                showAlert('Ошибка при удалении вопроса', 'error');
            }
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedQuestionId(null);
    };

    const handleEdit = () => {
        // Здесь будет логика редактирования
        
        console.log('Изменить вопрос:', index);
        handleMenuClose();
    };

    return (
        <>
            <div style={{ marginBottom: 20 }}>
                <MainCard contentSX={{ p: 2.25, pt: 3.3 }} 
                
                >
                    <>
                        <div style={{ display: 'flex', margin: 'auto', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox 
                                    checked={isSelected}
                                    onChange={(e) => onSelectChange(e.target.checked)}
                                />
                                <Typography variant="h5">
                                № {index +1}
                                </Typography>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Typography variant="h6" color="textSecondary">
                                    Тип:
                                </Typography>
                                <Typography variant="h6">
                                    {obj.question.type.name}
                                </Typography>
                                <Typography variant="h6" color="textSecondary">
                                    |
                                </Typography>
                                <Typography variant="h6" color="textSecondary">
                                    Баллов:
                                </Typography>
                                <Typography variant="h6">
                                    {obj.max_score}
                                </Typography>

                                <IconButton aria-label="Example" onClick={handleMenuClick}>
                                    <FontAwesomeSvgIcon icon={faEllipsisV} />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem  onClick={() => navigate(`/main-page/test/${id}/question/${obj.question.id}`)} >Изменить</MenuItem>
                                    <MenuItem onClick={()=>handleDelete(obj.question.id)}>Удалить</MenuItem>
                                </Menu>
                            </span>
                        </div>
                        <Stack sx={{ mt: 2, mb: 2, ml: 5 }}>
                            <Example htmlContent={obj.question.text} />

                            {obj.question.answers.allAnswer.map((item: string, index: number) => (
                                <div
                                    key={index}
                                    style={obj.question.answers.correctAnswer.includes(item) ? { backgroundColor: '#e5ffea', borderRadius: 10 } : { borderRadius: 10 }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <Checkbox
                                            checked={obj.question.answers.correctAnswer.includes(item)}
                                            disabled={true}
                                            style={{
                                                outline: "none",
                                                boxShadow: "none",
                                                marginTop: 3
                                            }}
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: "transparent",
                                                },
                                            }}
                                        />
                                        <div style={{ marginTop: 12 }}>
                                            <Example htmlContent={item} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Stack>
                    </>
                </MainCard>
            </div>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700 }}>
                    Подтверждение удаления
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить этот вопрос?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={handleCancelDelete} 
                        variant='outlined' 
                        color='inherit'
                    >
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        color="error" 
                        variant='outlined'
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={alertOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseAlert} 
                    severity={alertSeverity} 
                    sx={{ 
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
});

export default MultipleChoiceCard;
