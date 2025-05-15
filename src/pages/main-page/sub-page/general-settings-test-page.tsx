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
import { ILocales, ITestCategories } from '../../../interface/interfaceStore';
import DialogPopup from '../../../components/DialogPopup';
import { postData } from '../../../api';
import DialogCreateCategoryPopup from '../../../components/DialogCreateCategoryPopup';

const GeneralSettingsTestPage = observer(() => {
    const { settingsNewTestStore } = React.useContext(Context);
    const { getTestCategories, testCategories, createNewTest, locales, getLocales, postTestCategories } = settingsNewTestStore;

    const [category, setCategory] = React.useState('');
    const [leng, setLeng] = React.useState('');

    const [openDialogClose, setOpenDialogClose] = React.useState(false);
    const [openDialogSave, setOpenDialogSave] = React.useState(false);
    const [openDialogNewCategory, setOpenDialogNewCategory] = React.useState(false);
    const [newCategoryName, setNewCategoryName] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const [imageId, setImageId] = React.useState(0);

    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [logoOption, setLogoOption] = React.useState('1'); // 1 - custom logo, 2 - app logo, 3 - hide logo

    // Используем существующий шаблон как начальное состояние
    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        category_id: 0,
        creator_id: 2,
        access_timestamp: "2025-05-15 10:01:22",
        status: 'CREATED',
        frozen: true,
        locale_id: 0,
        time_limit: 300,
        img_id: 0,
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
        const selectedValue = event.target.value;
        setLeng(selectedValue);
        setFormData(prev => ({
            ...prev,
            locale_id: selectedValue ? Number(selectedValue) : 0
        }));
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
        createNewTest({...formData, locale_id: Number(formData.locale_id)})
    };

    const handleClose = () => {
        // Если пользователь подтвердил выход без сохранения
        window.location.replace('/');
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
            } else {
                alert('Пожалуйста, выберите файл изображения');
            }
        }
    };

    const handleLogoOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setLogoOption(value);
        
        switch(value) {
            case '1': // Custom logo - keep current values
                setImageUrl('');
                setImageId(0);
                setFormData(prev => ({
                    ...prev,
                    img_id: 0
                }));
                break;
            case '2': // App logo
                setImageUrl('http://172.16.0.79/navuchai/8d6e012539204b13a507a74cde4ba50f.png');
                setImageId(31);
                setFormData(prev => ({
                    ...prev,
                    img_id: 31
                }));
                break;
            case '3': // Hide logo
                setImageUrl('');
                setImageId(0);
                setFormData(prev => ({
                    ...prev,
                    img_id: 0
                }));
                break;
        }
    };

    const handleUploadLogo = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await postData('uploadLogo', formData);
            if (response) {
                alert('Логотип успешно загружен');
                setSelectedFile(null);
                setLogoOption('1'); // Set to custom logo option when uploading
                setImageUrl(response.url);
                setImageId(response.id);
                setFormData(prev => ({
                    ...prev,
                    img_id: response.id
                }));
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке логотипа:', error);
            alert('Ошибка при загрузке логотипа');
        }
    };

    const handleCreateCategory = () => {
        setOpenDialogNewCategory(true);
    };

    const handleCloseDialogNewCategory = async () => {
        if (newCategoryName.trim()) {
            try {
                // Assuming you have a method in your store to create a new category
                postTestCategories(newCategoryName);
                // Refresh categories list
                getTestCategories();
                // Reset form
                setNewCategoryName('');
                setOpenDialogNewCategory(false);
            } catch (error) {
                console.error('Ошибка при создании категории:', error);
                alert('Ошибка при создании категории');
            }
        } else {
            alert('Пожалуйста, введите название категории');
        }
    };

    React.useEffect(() => {
        getTestCategories();
        getLocales()
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
                        onClick={handleCreateCategory}
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
                            {locales.length && locales.map((item: ILocales, index: number) => (
                                <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                            ))}
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
                            value={logoOption}
                            onChange={handleLogoOptionChange}
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="1" control={<Radio />} label="Добавить мой логотип" />
                            <FormControlLabel value="2" control={<Radio />} label="Использовать логотип приложения" />
                            <FormControlLabel value="3" control={<Radio />} label="Скрыть логотип" />
                        </RadioGroup>
                        {imageUrl && logoOption !== '3' && <img src={imageUrl} alt='логотип длля тестов' style={{
                            width: 150,
                            height: 'auto',
                            margin: 10,
                            borderRadius: 10,
                            marginLeft: 30}}/>}
                    </FormControl>
                   
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                    <Button
                        variant="outlined"
                        color='success'
                        startIcon={<DriveFolderUploadIcon />}
                        style={{ textTransform: 'none', marginTop: 40 }}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={false}
                    >
                        {selectedFile ? 'Изменить логотип' : 'Загрузить логотип'}
                    </Button>
                    {selectedFile && (
                        <>
                            <Typography variant="body2" style={{ marginTop: 10 }}>
                                Выбран файл: {selectedFile.name}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUploadLogo}
                                style={{ textTransform: 'none', marginTop: 10 }}
                            >
                                Сохранить логотип
                            </Button>
                        </>
                    )}
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
            <DialogCreateCategoryPopup 
                title='Создание новой категории'
                mainText='Для создания новой категории введите ее название в строке ввода и нажмите Сохранить'
                open={openDialogNewCategory}
                setOpen={setOpenDialogNewCategory}
                onConfirm={handleCloseDialogNewCategory}
                value={newCategoryName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategoryName(e.target.value)}
            />
        </div>
    );
})

export default GeneralSettingsTestPage;

