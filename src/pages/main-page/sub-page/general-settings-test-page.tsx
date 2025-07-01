import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Input,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
    Alert,
    Snackbar
} from '@mui/material';
import { Context } from '../../..';
import MainCard from '../../../components/MainCard';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { ITestCategories } from '../../../interface/interfaceStore';
import DialogPopup from '../../../components/DialogPopup';
import { postData, getTestImportTemplate, postTestImportExcel } from '../../../api';
import DialogCreateCategoryPopup from '../../../components/DialogCreateCategoryPopup';

const GeneralSettingsTestPage = observer(() => {

    const { id } = useParams<{ id: string }>();

    const { settingsNewTestStore, authStore } = React.useContext(Context);
    const {
        getTestCategories,
        testCategories,
        createNewTest,
        getLocales,
        postTestCategories,
        getTestById,
        testMainInfo,
        updateTest,
    } = settingsNewTestStore;

    const [category, setCategory] = React.useState<string>('');
    const [leng, setLeng] = React.useState('1');

    const [openDialogClose, setOpenDialogClose] = React.useState(false);
    const [openDialogSave, setOpenDialogSave] = React.useState(false);
    const [openDialogNewCategory, setOpenDialogNewCategory] = React.useState(false);
    const [newCategoryName, setNewCategoryName] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const [imageId, setImageId] = React.useState(0);

    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [logoOption, setLogoOption] = React.useState('1'); // 1 - custom logo, 2 - app logo, 3 - hide logo

    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        category_id: 0,
        creator_id: authStore?.userId ?? 2,
        access_timestamp: "2025-05-15 10:01:22",
        status: 'CREATED',
        status_id: 2,
        status_name: 'Setup in progress',
        status_name_ru: 'Настройка в процессе',
        status_color: '#a569bd',
        frozen: true,
        locale_id: 1,
        time_limit: 300,
        img_id: 0,
    });

    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

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
        console.log(formData);
        if (id) {
            // Если есть id, обновляем существующий тест
            updateTest({ ...formData, locale_id: Number(formData.locale_id) }, Number(id));
        } else {
            // Если нет id, создаем новый тест
            createNewTest({ ...formData, locale_id: Number(formData.locale_id) });
        }
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
                showAlert('Пожалуйста, выберите файл изображения', 'error');
            }
        }
    };

    const handleLogoOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setLogoOption(value);

        switch (value) {
            case '1': // Custom logo - keep current values
                setImageUrl('');
                setImageId(0);
                setFormData(prev => ({
                    ...prev,
                    img_id: 0
                }));
                break;
            case '2': // App logo
                setImageUrl('https://img.sellwingroup.com/navuchai/navuchai_logo.png');
                setImageId(31);
                setFormData(prev => ({
                    ...prev,
                    img_id: 31
                }));
                break;
            case '3': // Hide logo
                setImageUrl('https://img.sellwingroup.com/navuchai/6419cb2d2000478fa1db2da77634d625.png');
                setImageId(32);
                setFormData(prev => ({
                    ...prev,
                    img_id: 32
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
                showAlert('Логотип успешно загружен', 'success');
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
            showAlert('Ошибка при загрузке логотипа', 'error');
        }
    };

    const handleCreateCategory = () => {
        setOpenDialogNewCategory(true);
    };

    const handleCloseDialogNewCategory = async () => {
        if (newCategoryName.trim()) {
            try {
                postTestCategories(newCategoryName);
                getTestCategories();
                setNewCategoryName('');
                setOpenDialogNewCategory(false);
            } catch (error) {
                console.error('Ошибка при создании категории:', error);
                showAlert('Ошибка при создании категории', 'error');
            }
        } else {
            showAlert('Пожалуйста, введите название категории', 'error');
        }
    };

    React.useEffect(() => {
        // Если userId еще не получен, пробуем получить его через authMe
        if (!authStore.userId) {
            authStore.authMe().then(user => {
                if (user && user.id) {
                    setFormData(prev => ({ ...prev, creator_id: user.id }));
                }
            });
        } else {
            setFormData(prev => ({ ...prev, creator_id: authStore.userId! }));
        }
        getTestCategories();
        getLocales();
    }, []);

    React.useEffect(() => {
        if (id) {
            getTestById(Number(id));
        }

    }, [id]);

    React.useEffect(() => {
        if (testMainInfo && typeof testMainInfo === 'object' && Object.keys(testMainInfo).length > 0) {
            try {
                const testInfo = testMainInfo;

                setFormData({
                    title: testInfo?.title ?? '',
                    description: testInfo?.description ?? '',
                    category_id: testInfo?.category_id ?? 0,
                    creator_id: testInfo?.creator_id ?? 2,
                    access_timestamp: testInfo?.access_timestamp ?? "2025-05-15 10:01:22",
                    status: 'CREATED',
                    status_id: testInfo?.status_id ?? 2,
                    status_name: testInfo?.status_name ?? 'Setup in progress',
                    status_name_ru: testInfo?.status_name_ru ?? 'Настройка в процессе',
                    status_color: testInfo?.status_color ?? '#a569bd',
                    frozen: testInfo?.frozen ?? true,
                    locale_id: testInfo?.locale_id ?? 0,
                    time_limit: testInfo?.time_limit ?? 300,
                    img_id: testInfo?.img_id ?? 0,
                });

                // Set other state values based on test info
                setCategory(testInfo?.category_id?.toString() ?? '');
                setLeng(testInfo?.locale_id?.toString() ?? '');
                if (testInfo?.image?.path) {
                    setImageUrl(testInfo.image.path);
                    setImageId(testInfo.image.id);
                    setLogoOption('1'); // Set to custom logo if there's an image
                }
            } catch (error) {
                console.error('Error processing testMainInfo:', error);
            }
        }
    }, [testMainInfo]);


    return (
        <div >
            <Typography variant="h6" color="textSecondary" >
                {id ? 'Редактирование теста' : 'Основная информация'}
            </Typography>
            <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <>
                    <Typography variant="h5"  >
                        {id ? 'Редактирование настроек' : 'Начальные настройки'}
                    </Typography>
                    {/* Кнопки для Excel, если нет id теста */}
                    {!id && (
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={async () => {
                                    try {
                                        const response = await getTestImportTemplate();
                                        // Создаем ссылку для скачивания файла
                                        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'template.xlsx';
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                        window.URL.revokeObjectURL(url);
                                    } catch (error) {
                                        showAlert('Ошибка при скачивании шаблона', 'error');
                                    }
                                }}
                            >
                                Скачать Excel
                            </Button>
                            <input
                                id="excel-upload-input"
                                type="file"
                                accept=".xlsx,.xls"
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    try {
                                        const response = await postTestImportExcel(formData);
                                        if (response.success && response.test_id) {
                                            showAlert('Вопросы успешно импортированы', 'success');
                                            setTimeout(() => {
                                                window.location.replace(`/main-page/new-test/${response.test_id}`);
                                            }, 1000);
                                        } else {
                                            showAlert(response.message || 'Ошибка при импорте', 'error');
                                        }
                                    } catch (error) {
                                        showAlert('Ошибка при загрузке Excel', 'error');
                                    }
                                }}
                            />
                            <Button
                                variant="outlined"
                                color="success"
                                startIcon={<DriveFolderUploadIcon />}
                                style={{textTransform: 'none'}}
                                onClick={() => document.getElementById('excel-upload-input')?.click()}
                            >
                                Загрузить Excel с вопросами
                            </Button>
                        </div>
                    )}
                    <FormControl sx={{ m: 1, minWidth: '80%' }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Название теста</InputLabel>
                        <Input
                            id="standard-adornment-amount"
                            value={formData.title}
                            onChange={handleTitleChange}
                        />
                    </FormControl>
                    <div>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: '62%', mt: 1 }}>
                        <InputLabel id="demo-simple-select-standard-label">Категория</InputLabel>
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
                            {Array.isArray(testCategories) && testCategories.map((item: ITestCategories) => (
                                <MenuItem key={item.id} value={item.id.toString()}>{item.name}</MenuItem>
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

                    </div>
                   

                    <FormControl variant="standard" sx={{ m: 1, minWidth: '80%', mt: 2 }}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Добавьте описание теста для идентификации."
                            multiline
                            rows={2}
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            inputProps={{ maxLength: 100 }}
                        />
                    </FormControl>
                    {/* <FormControl variant="standard" sx={{ m: 1, minWidth: '80%', mt: 1 }}>
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
                            {Array.isArray(locales) && locales.map((item: ILocales) => (
                                <MenuItem key={item.id} value={item.id.toString()}>{item.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
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
                            <FormControlLabel defaultValue={'1'} value="1" control={<Radio />} label="Добавить мой логотип" />
                            <FormControlLabel value="2" control={<Radio />} label="Использовать логотип приложения" />
                            <FormControlLabel value="3" control={<Radio />} label="Скрыть логотип" />
                        </RadioGroup>
                        {imageUrl && logoOption !== '3' && <img src={imageUrl} alt='логотип длля тестов' style={{
                            width: 150,
                            height: 'auto',
                            margin: 10,
                            borderRadius: 10,
                            marginLeft: 30
                        }} />}
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
                {id ? 'Обновить' : 'Сохранить'}
            </Button>
            <DialogPopup
                title='Подтверждение'
                mainText={id ? 'Обновить Ваши изменения?' : 'Сохранить Ваши изменения?'}
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
            <Snackbar 
                open={alertOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </div>
    );
})

export default GeneralSettingsTestPage;

