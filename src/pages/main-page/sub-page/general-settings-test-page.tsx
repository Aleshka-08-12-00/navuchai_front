import * as React from 'react';
import { observer } from 'mobx-react-lite';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import { minWidth, Stack } from '@mui/system';
import { Context } from '../../..';
import MainCard from '../../../components/MainCard';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { ITestCategories } from '../../../interface/interfaceStore';
import { useState } from 'react';
import DialogPopup from '../../../components/DialogPopup';
import { postData } from '../../../api';

const GeneralSettingsTestPage = observer(() => {
    const { settingsNewTestStore } = React.useContext(Context);
    const { getTestCategories, testCategories, createNewTest } = settingsNewTestStore;

    const [category, setCategory] = React.useState('');
    const [leng, setLeng] = React.useState('');

    const [openDialogClose, setOpenDialogClose] = React.useState(false);
    const [openDialogSave, setOpenDialogSave] = React.useState(false);

    // Используем существующий шаблон как начальное состояние
    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        category_id: 0,
        creator_id: 0,
        access_timestamp: "2025-05-12T12:10:13.557Z",
        status: '',
        frozen: true,
        locale: '',
        time_limit: 0
    });

    const handleChange = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value;
        setCategory(selectedValue);
        // Обновляем category_id в formData
        setFormData(prev => ({
            ...prev,
            category_id: selectedValue ? Number(selectedValue) : 0
        }));
    };

    const handleChangeLeng = (event: SelectChangeEvent) => {
        setLeng(event.target.value);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            title: event.target.value
        }));
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            description: event.target.value
        }));
    };

    const clickClose = () => {
        setOpenDialogClose(!openDialogClose)
    };
    const clickSave = () => {
        setOpenDialogSave(!openDialogSave)
    };

    const handleSave = async () => {
        createNewTest(formData)
    };

    const handleClose = () => {
        // Если пользователь подтвердил выход без сохранения
        window.location.replace('/');
    };

    React.useEffect(() => {
        getTestCategories()
    }, []);

    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                Основная информация
            </Typography>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <>
                    <Typography variant="h5"  >
                        Начальные настройки
                    </Typography>
                    <FormControl sx={{ m: 1, minWidth: '80%' }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Название теста</InputLabel>
                        <Input
                            id="standard-adornment-amount"
                            value={formData.title}
                            onChange={handleTitleChange}
                        />
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: '62%', mt: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">Нет категории</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={category}
                            onChange={handleChange}
                            label="Age"
                        >
                            <MenuItem value="">
                                <em>Нет категории</em>
                            </MenuItem>
                            {testCategories.length && testCategories.map((item: ITestCategories, index: number) => (
                                <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                    <Button
                        variant="outlined"
                        color='success'
                        startIcon={<AddIcon />}
                        disabled={true}
                        //   color={item.statusColor}
                        style={{ textTransform: 'none', marginTop: 15 }}

                    >
                        Создать категорию
                    </Button>


                    <FormControl variant="standard" sx={{ m: 1, minWidth: '80%', mt: 1 }}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Добавьте описание теста для идентификации. Оно будет видно только вам."
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleDescriptionChange}
                        />
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: '80%', mt: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">Русский</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={leng}
                            onChange={handleChangeLeng}
                            label="Язык теста"
                        >
                            <MenuItem value="">
                                <em>нет выбрано</em>
                            </MenuItem>
                            <MenuItem value={10}>Русский</MenuItem>
                            <MenuItem value={20}>Английский</MenuItem>
                            <MenuItem value={30}>Немецкий</MenuItem>
                        </Select>
                    </FormControl>
                </>
            </MainCard>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }} sx={{ mt: 3 }}>
                <>
                    <Typography variant="h5"  >
                        Логотип
                    </Typography>
                    <div style={{ background: '#e3e3e3', width: '81%', borderRadius: 10, marginLeft: 5, padding: 20, marginTop: 20 }}>
                        <div style={{ display: 'flex' }}>
                            <InfoIcon />
                            <Typography variant="h6" color="textSecondary" style={{ marginLeft: 5, marginBottom: 5 }}  >
                                Видимость логотипа
                            </Typography>
                        </div>

                        <Typography variant="h6" color="textSecondary" >
                            Логотип виден в онлайн- и печатной версии теста.
                        </Typography>
                    </div>
                    <FormControl style={{ marginTop: 20 }}>
                        <FormLabel id="demo-radio-buttons-group-label">Выберите один из вариантов:</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Добавить мой логотип" />
                            <FormControlLabel value="male" control={<Radio />} label="Использовать логотип приложения" />
                            <FormControlLabel value="other" control={<Radio />} label="Скрыть логотип" />
                        </RadioGroup>
                    </FormControl>
                    <Button
                        variant="outlined"
                        color='success'
                        startIcon={<DriveFolderUploadIcon />}
                        style={{ textTransform: 'none', marginTop: 40 }}
                        disabled={true}
                    >
                        Загрузить логотип
                    </Button>
                </>
            </MainCard>
            <Button
                variant='contained'
                color='success'
                style={{ textTransform: 'none', marginTop: 10 }}
                onClick={() => clickSave()}
            >
                сохранить
            </Button>
            <Button
                variant='contained'
                color='inherit'
                style={{ textTransform: 'none', marginTop: 10, marginLeft: 15 }}
                onClick={() => clickClose()}
            >
                выйти
            </Button>
            <DialogPopup
                title='Подтверждение'
                mainText='Сохранить Ваши изменения?'
                open={openDialogSave}
                setOpen={setOpenDialogSave}
                onConfirm={handleSave}
            />
            <DialogPopup
                title='Подтверждение'
                mainText='Вы не сохранили изменения. Вы уверены, что хотите покинуть страницу?'
                open={openDialogClose}
                setOpen={setOpenDialogClose}
                onConfirm={handleClose}
            />
        </div>
    );
})

export default GeneralSettingsTestPage;

