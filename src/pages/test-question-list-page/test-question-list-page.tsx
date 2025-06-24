import { Context } from "../..";
import { Box, Checkbox, TextField, FormControlLabel, Typography, Paper, Stack, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import SvgIcon from '@mui/material/SvgIcon';
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import SingleChoiceCard from "./components/single-choice-card";
import MultipleChoiceCard from "./components/multiple-choice-card";
import { IQuestionInTest } from "../../interface/interfaceStore";
import TrueFalseCard from "./components/true-false-card";
import SearchIcon from '@mui/icons-material/Search';


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




const TestQuestionListPage = observer(() => {
    const { settingsStore, testQuestionListPageStore, authStore } = React.useContext(Context);
    const { getQuestionListByTestId, questionArray, deleteQuestionById } = testQuestionListPageStore
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Состояние для поиска и выбора
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
    
    // Состояние для диалогового окна удаления
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    React.useEffect(() => {
        console.log('useEffect triggered with id:', id);
        getQuestionListByTestId(Number(id))
        authStore.authMe()
    }, [id]);

  
    // Фильтрация вопросов по поисковому запросу
    const filteredQuestions = useMemo(() => {
        if (!searchQuery.trim()) {
            return questionArray;
        }

        return questionArray.filter((item: IQuestionInTest) => {
            const questionText = item.question.text.toLowerCase();
            const searchLower = searchQuery.toLowerCase();
            return questionText.includes(searchLower);
        });
    }, [questionArray, searchQuery]);

    // Обработчики для чекбоксов
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(filteredQuestions.map((item: IQuestionInTest) => item.question.id));
            setSelectedQuestions(allIds);
        } else {
            setSelectedQuestions(new Set());
        }
    };

    const handleSelectQuestion = (questionId: number, checked: boolean) => {
        const newSelected = new Set(selectedQuestions);
        if (checked) {
            newSelected.add(questionId);
        } else {
            newSelected.delete(questionId);
        }
        setSelectedQuestions(newSelected);
    };

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleDeleteSelected = () => {
        if (selectedQuestions.size === 0) return;
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedQuestions.size === 0) return;

        const promises = Array.from(selectedQuestions).map(questionId =>
            deleteQuestionById(questionId, Number(id))
        );

        try {
            await Promise.all(promises);
            setSelectedQuestions(new Set());
            setDeleteDialogOpen(false);
            showAlert(`Успешно удалено ${selectedQuestions.size} вопросов`, 'success');
        } catch (error) {
            console.error('Error deleting questions:', error);
            showAlert('Ошибка при удалении вопросов', 'error');
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
    };

    const isAllSelected = filteredQuestions.length > 0 &&
        filteredQuestions.every((item: IQuestionInTest) => selectedQuestions.has(item.question.id));

    const isIndeterminate = selectedQuestions.size > 0 && selectedQuestions.size < filteredQuestions.length;

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                {/* Блок управления */}
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={2}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAllSelected}
                                    indeterminate={isIndeterminate}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            }
                            label="Выбрать все"
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                            <SearchIcon color="primary" />
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Поиск по заголовку вопроса..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{
                                    minWidth: 250,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        background: 'rgba(255,255,255,0.8)'
                                    }
                                }}
                            />
                        </Box>

                        {selectedQuestions.size > 0 && (
                            <Button
                                variant='outlined'
                                color="error"
                                onClick={handleDeleteSelected}
                                size="small"
                                style={{textTransform: 'none'}}
                            >
                                Удалить выбранные ({selectedQuestions.size})
                            </Button>
                        )}

                        <Typography variant="body2" color="text.secondary">
                            Найдено: {filteredQuestions.length} из {questionArray.length}
                        </Typography>
                    </Stack>
                </Paper>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <Button 
                    color="success" 
                    variant="outlined"
                    style={{textTransform: 'none'}}
                    onClick={() => navigate(`/main-page/new-test/${id}`)}>
                    + Добавить вопрос  
                  </Button>
                  <Button 
                    color='secondary' 
                    variant="outlined"
                    style={{ textTransform: 'none' }}
                    onClick={() => navigate(`/main-page/new-test/${id}`)}>
                    Редактировть тест 
                  </Button>
                </div>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} style={{ cursor: 'pointer' }} >
                        {filteredQuestions.length ? filteredQuestions.map((item: IQuestionInTest, index: number) => {
                            const questionId = item.question.id;
                            const isSelected = selectedQuestions.has(questionId);

                            // Передаем состояние выбора в компоненты карточек
                            if (item.question.type.code === "single_choice" || item.question.type.code === "SINGLE_CHOICE") {
                                return <SingleChoiceCard
                                    key={`single-${index}`}
                                    {...item}
                                    index={index}
                                    isSelected={isSelected}
                                    onSelectChange={(checked: boolean) => handleSelectQuestion(questionId, checked)}
                                />;
                            }

                            if (item.question.type.code === "multiple_choice" || item.question.type.code === "MULTIPLE_CHOICE") {
                                return <MultipleChoiceCard
                                    key={`multi-${index}`}
                                    {...item}
                                    index={index}
                                    isSelected={isSelected}
                                    onSelectChange={(checked: boolean) => handleSelectQuestion(questionId, checked)}
                                />;
                            }

                            if (item.question.type.code === "TRUE_FALSE" || item.question.type.code === "TRUE_FALSE") {
                                return <TrueFalseCard
                                    key={`true-false-${index}`}
                                    {...item}
                                    index={index}
                                    isSelected={isSelected}
                                    onSelectChange={(checked: boolean) => handleSelectQuestion(questionId, checked)}
                                />;
                            }

                            return null;
                        }): 'В данном тесте нет вопросов'}
                    </Grid>
                </Grid>
            </Box>

            {/* Диалоговое окно подтверждения удаления */}
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
                        Вы уверены, что хотите удалить {selectedQuestions.size} выбранных вопросов?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Это действие нельзя отменить.
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

            {/* Уведомления */}
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
    )
});
export default TestQuestionListPage;
