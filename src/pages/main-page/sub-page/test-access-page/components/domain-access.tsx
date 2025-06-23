import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Typography, 
    Box, 
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Card,
    CardContent,
    Chip,
    Avatar,
    IconButton,
    Divider,
    TablePagination,
    TableSortLabel,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Person as PersonIcon,
    Group as GroupIcon,
    Email as EmailIcon,
    CalendarToday as CalendarIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Check as CheckIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../../..';
import { useParams } from "react-router";

const DomainAccess = observer(() => {
    const { accessTestToUserStore } = React.useContext(Context);

    const { 
        getUsers,
        usersArray,
        getRespondentLists,
        respondentListsArray,
        postGroupToTest,
        postUserToTest,
        deleteUserFromTest,
        deleteGroupFromTest,
        getAccessGroups,
        getAccessUsers,
        accessGroupsArray,
        accessUsersArray,
     } = accessTestToUserStore;

    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [removedUsersNotification, setRemovedUsersNotification] = useState<{
        show: boolean;
        users: any[];
        groupName: string;
    }>({ show: false, users: [], groupName: '' });
    const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

    // Сортировка и пагинация для accessUsersArray
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Сортировка и пагинация для таблиц участников групп
    const [groupOrder, setGroupOrder] = useState<Record<number, 'asc' | 'desc'>>({});
    const [groupOrderBy, setGroupOrderBy] = useState<Record<number, string>>({});
    const [groupPage, setGroupPage] = useState<Record<number, number>>({});
    const [groupRowsPerPage, setGroupRowsPerPage] = useState<Record<number, number>>({});

    // Для превью выбранной группы
    const [previewOrder, setPreviewOrder] = useState<'asc' | 'desc'>('asc');
    const [previewOrderBy, setPreviewOrderBy] = useState<string>('name');
    const [previewPage, setPreviewPage] = useState(0);
    const [previewRowsPerPage, setPreviewRowsPerPage] = useState(10);

    const [openAccessUsersTable, setOpenAccessUsersTable] = useState(true);

    // --- ALERT STATE ---
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error' | 'info'>('success');

    // --- DELETE DIALOG STATE ---
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'user' | 'group'; id: number | null }>({ type: 'user', id: null });

    const showAlert = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };
    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const openDeleteDialog = (type: 'user' | 'group', id: number) => {
        setDeleteTarget({ type, id });
        setDeleteDialogOpen(true);
    };
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeleteTarget({ type: 'user', id: null });
    };
    const handleConfirmDelete = async () => {
        if (!id || deleteTarget.id == null) return;
        if (deleteTarget.type === 'user') {
            try {
                await deleteUserFromTest(Number(id), deleteTarget.id);
                showAlert('Пользователь успешно удален', 'success');
            } catch (e) {
                showAlert('Ошибка при удалении пользователя', 'error');
            }
        } else if (deleteTarget.type === 'group') {
            try {
                await deleteGroupFromTest(Number(id), deleteTarget.id);
                showAlert('Группа успешно удалена', 'success');
            } catch (e) {
                showAlert('Ошибка при удалении группы', 'error');
            }
        }
        setDeleteDialogOpen(false);
        setDeleteTarget({ type: 'user', id: null });
    };

    React.useEffect(() => {
        getUsers();
        getRespondentLists();
        if (id) {
            getAccessGroups(Number(id));
            getAccessUsers(Number(id));
        }
    }, [id]);

    const handleGroupChange = (event: SelectChangeEvent) => {
        setSelectedGroup(event.target.value);
    };

    const handleUserChange = (event: SelectChangeEvent) => {
        setSelectedUser(event.target.value);
    };

    const handleAddGroup = async () => {
        if (selectedGroup && selectedGroupInfo && id) {
            const isAlreadyAdded = accessGroupsArray.some((group: any) => group.group_id === selectedGroupInfo.id);
            if (!isAlreadyAdded) {
                try {
                    await postGroupToTest(Number(id), selectedGroupInfo.id);
                    showAlert('Группа успешно добавлена', 'success');
                } catch (e) {
                    showAlert('Ошибка при добавлении группы', 'error');
                }
                setSelectedGroup('');
            }
        }
    };

    const handleRemoveGroup = async (groupId: number) => {
        if (id && window.confirm('Вы уверены, что хотите удалить эту группу из теста?')) {
            try {
                await deleteGroupFromTest(Number(id), groupId);
                showAlert('Группа успешно удалена', 'success');
            } catch (e) {
                showAlert('Ошибка при удалении группы', 'error');
            }
        }
    };

    const handleCloseNotification = () => {
        setRemovedUsersNotification({ show: false, users: [], groupName: '' });
    };

    const handleAddUser = async () => {
        if (selectedUser && selectedUserInfo && id) {
            const isUserAlreadyAdded = accessUsersArray.some((user: any) => user.user_id === selectedUserInfo.id);
            if (!isUserAlreadyAdded) {
                try {
                    await postUserToTest(Number(id), selectedUserInfo.id);
                    showAlert('Пользователь успешно добавлен', 'success');
                } catch (e) {
                    showAlert('Ошибка при добавлении пользователя', 'error');
                }
                setSelectedUser('');
            }
        }
    };

    const handleRemoveUser = async (userId: number) => {
        if (id && window.confirm('Вы уверены, что хотите удалить этого пользователя из теста?')) {
            try {
                await deleteUserFromTest(Number(id), userId);
                showAlert('Пользователь успешно удален', 'success');
            } catch (e) {
                showAlert('Ошибка при удалении пользователя', 'error');
            }
        }
    };

    const handleNavigate = () => {
        navigate('/settings');
    };

    // Получаем всех пользователей из добавленных групп
    const getAllGroupUsers = () => {
        const groupUsers: any[] = [];
        accessGroupsArray.forEach((group: any) => {
            if (group.members) {
                group.members.forEach((member: any) => {
                    const user = usersArray.find((u: any) => u.id === member.user_id);
                    if (user && !groupUsers.some(gu => gu.id === user.id)) {
                        groupUsers.push(user);
                    }
                });
            }
        });
        return groupUsers;
    };

    const groupUsers = getAllGroupUsers();

    // Проверяем, добавлен ли пользователь в список или в группы
    const isUserAdded = (userId: number) => {
        return accessUsersArray.some((user: any) => user.user_id === userId) || 
               groupUsers.some((user: any) => user.id === userId);
    };

    // Получаем пользователей выбранной группы
    const getGroupMembers = () => {
        if (!selectedGroup) return [];
        
        const group = respondentListsArray.find((g: any) => g.id.toString() === selectedGroup);
        if (!group) return [];

        return group.members.map((member: any) => {
            const user = usersArray.find((u: any) => u.id === member.user_id);
            return {
                ...member,
                user: user || null
            };
        });
    };

    const groupMembers = getGroupMembers();

    // Получаем информацию о выбранной группе
    const selectedGroupInfo = respondentListsArray.find((g: any) => g.id.toString() === selectedGroup);

    // Получаем информацию о выбранном пользователе
    const selectedUserInfo = usersArray.find((u: any) => u.id.toString() === selectedUser);

    const getRoleColor = (roleCode: string) => {
        switch (roleCode) {
            case 'admin':
                return 'error';
            case 'moderator':
                return 'warning';
            case 'user':
                return 'success';
            case 'guest':
                return 'default';
            default:
                return 'primary';
        }
    };

    // Функция для склонения слова "участник"
    function getParticipantsWord(count: number) {
        const mod10 = count % 10;
        const mod100 = count % 100;
        if (mod10 === 1 && mod100 !== 11) return 'участник';
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'участника';
        return 'участников';
    }

    const handleToggleGroup = (groupId: number) => {
        setOpenGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    // Сортировка и пагинация для accessUsersArray
    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator<Key extends keyof any>(order: 'asc' | 'desc', orderBy: Key): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
        const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const handleGroupRequestSort = (groupId: number, property: string) => {
        setGroupOrder(prev => ({
            ...prev,
            [groupId]: groupOrderBy[groupId] === property && groupOrder[groupId] === 'asc' ? 'desc' : 'asc'
        }));
        setGroupOrderBy(prev => ({
            ...prev,
            [groupId]: property
        }));
    };
    const handleGroupChangePage = (groupId: number, event: unknown, newPage: number) => {
        setGroupPage(prev => ({ ...prev, [groupId]: newPage }));
    };
    const handleGroupChangeRowsPerPage = (groupId: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setGroupRowsPerPage(prev => ({ ...prev, [groupId]: parseInt(event.target.value, 10) }));
        setGroupPage(prev => ({ ...prev, [groupId]: 0 }));
    };

    const handlePreviewRequestSort = (property: string) => {
        const isAsc = previewOrderBy === property && previewOrder === 'asc';
        setPreviewOrder(isAsc ? 'desc' : 'asc');
        setPreviewOrderBy(property);
    };
    const handlePreviewChangePage = (event: unknown, newPage: number) => {
        setPreviewPage(newPage);
    };
    const handlePreviewChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPreviewRowsPerPage(parseInt(event.target.value, 10));
        setPreviewPage(0);
    };

    return (
        <Box mt={2}>
            <Typography sx={{ mb: 2 }}>
                Предоставлять доступ тесту только членам группы вашего домена
            </Typography>

            {/* Уведомление об удаленных пользователях */}
            {removedUsersNotification.show && (
                <Card sx={{ mb: 3, bgcolor: 'info.light', border: '1px solid', borderColor: 'info.main' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h6" color="info.dark" sx={{ mb: 1 }}>
                                    Пользователи автоматически удалены
                                </Typography>
                                <Typography variant="body2" color="info.dark" sx={{ mb: 1 }}>
                                    При добавлении группы "{removedUsersNotification.groupName}" следующие пользователи были автоматически удалены из списка (они уже присутствуют в группе):
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {removedUsersNotification.users.map((user: any) => (
                                        <Chip
                                            key={user.id}
                                            label={`${user.name} (${user.email})`}
                                            size="small"
                                            color="info"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={handleCloseNotification}
                                sx={{ color: 'info.dark' }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Grid container spacing={3}>
                {/* Выпадающие списки */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <GroupIcon sx={{ mr: 1 }} />
                                Выбор группы
                            </Typography>
                            
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="group-select-label">Выберите группу</InputLabel>
                                <Select
                                    labelId="group-select-label"
                                    value={selectedGroup}
                                    label="Выберите группу"
                                    onChange={handleGroupChange}
                                >
                                    {respondentListsArray.map((group: any) => {
                                        const isAdded = accessGroupsArray.some((ag: any) => ag.group_id === group.id);
                                        return (
                                            <MenuItem 
                                                key={group.id} 
                                                value={group.id.toString()}
                                                disabled={isAdded}
                                                sx={{
                                                    opacity: isAdded ? 0.6 : 1,
                                                    '&.Mui-disabled': {
                                                        opacity: 0.6
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <GroupIcon sx={{ mr: 1, fontSize: 20 }} />
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="body1">{group.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {group.members.length} участников
                                                        </Typography>
                                                    </Box>
                                                    {isAdded && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                                            <CheckIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                                                            <Typography variant="caption" color="success.main">
                                                                Добавлена
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                            {selectedGroupInfo && (
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Информация о группе:
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        <strong>Название:</strong> {selectedGroupInfo.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        <strong>Описание:</strong> {selectedGroupInfo.description}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        <strong>Участников:</strong> {selectedGroupInfo.members.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Создана:</strong> {new Date(selectedGroupInfo.created_at).toLocaleDateString('ru-RU')}
                                    </Typography>
                                    
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddGroup}
                                        fullWidth
                                        disabled={accessGroupsArray.some((group: any) => group.group_id === selectedGroupInfo.id)}
                                    >
                                        {accessGroupsArray.some((group: any) => group.group_id === selectedGroupInfo.id) 
                                            ? 'Группа уже добавлена' 
                                            : 'Добавить группу'
                                        }
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ mr: 1 }} />
                                Выбор пользователя
                            </Typography>
                            
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="user-select-label">Выберите пользователя</InputLabel>
                                <Select
                                    labelId="user-select-label"
                                    value={selectedUser}
                                    label="Выберите пользователя"
                                    onChange={handleUserChange}
                                >
                                    {usersArray.map((user: any) => {
                                        const isAdded = isUserAdded(user.id);
                                        const isInGroups = groupUsers.some(gu => gu.id === user.id);
                                        const isInAccessUsers = accessUsersArray.some((au: any) => au.user_id === user.id);
                                        
                                        return (
                                            <MenuItem 
                                                key={user.id} 
                                                value={user.id.toString()}
                                                disabled={isAdded}
                                                sx={{
                                                    opacity: isAdded ? 0.6 : 1,
                                                    '&.Mui-disabled': {
                                                        opacity: 0.6
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    {/* <Avatar sx={{ mr: 1, width: 24, height: 24, bgcolor: 'primary.main' }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </Avatar> */}
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="body1">{user.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {user.email}
                                                        </Typography>
                                                    </Box>
                                                    {isAdded && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                                            <CheckIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                                                            <Typography variant="caption" color="success.main">
                                                                {isInAccessUsers ? 'Добавлен' : 'В группе'}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                            {selectedUserInfo && (
                                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Информация о пользователе:
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        <strong>Имя:</strong> {selectedUserInfo.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        <strong>Email:</strong> {selectedUserInfo.email}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                        <strong>Логин:</strong> {selectedUserInfo.username}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <strong>Роль:</strong> 
                                        <Chip 
                                            label={selectedUserInfo.role.name} 
                                            color={getRoleColor(selectedUserInfo.role.code)}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        <strong>Зарегистрирован:</strong> {new Date(selectedUserInfo.created_at).toLocaleDateString('ru-RU')}
                                    </Typography>
                                    
                                    {isUserAdded(selectedUserInfo.id) ? (
                                        <Box sx={{ p: 1, bgcolor: 'warning.light', borderRadius: 1, mb: 2 }}>
                                            <Typography variant="body2" color="warning.dark">
                                                {accessUsersArray.some((user: any) => user.user_id === selectedUserInfo.id) 
                                                    ? 'Пользователь уже добавлен в список' 
                                                    : 'Пользователь уже присутствует в добавленных группах'
                                                }
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            onClick={handleAddUser}
                                            fullWidth
                                        >
                                            Добавить в список
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Таблица пользователей с доступом к тесту */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <IconButton onClick={() => setOpenAccessUsersTable((prev) => !prev)} size="small">
                                    {openAccessUsersTable ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                                <Typography variant="h6" sx={{ mb: 0, display: 'flex', alignItems: 'center', ml: 1 }}>
                                    <PersonIcon sx={{ mr: 1 }} />
                                    Пользователи с доступом к тесту ({accessUsersArray.length} {getParticipantsWord(accessUsersArray.length)})
                                    {/* <Chip 
                                        label={accessUsersArray.length} 
                                        color="primary" 
                                        size="small" 
                                        sx={{ ml: 1 }}
                                    /> */}
                                </Typography>
                            </Box>
                            {openAccessUsersTable && (
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={orderBy === 'name'}
                                                        direction={orderBy === 'name' ? order : 'asc'}
                                                        onClick={() => handleRequestSort('name')}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                                                            Пользователь
                                                        </Box>
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={orderBy === 'email'}
                                                        direction={orderBy === 'email' ? order : 'asc'}
                                                        onClick={() => handleRequestSort('email')}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                                                            Email
                                                        </Box>
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={orderBy === 'role'}
                                                        direction={orderBy === 'role' ? order : 'asc'}
                                                        onClick={() => handleRequestSort('role')}
                                                    >
                                                        Роль
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell align="center">Действия</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {accessUsersArray.length > 0 ? (
                                                stableSort(accessUsersArray, getComparator(order, orderBy === 'role' ? 'role.name' : orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: any) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box>
                                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                                        {user.name}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {user.email}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={user.role.name} 
                                                                color={getRoleColor(user.role.code)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => openDeleteDialog('user', user.user_id)}
                                                                size="small"
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center">
                                                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                                            Пользователи с доступом к тесту не найдены
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={accessUsersArray.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Таблицы групп с доступом к тесту */}
                {accessGroupsArray.map((group: any) => {
                    const groupMembers = group.members ? group.members.map((member: any) => {
                        const user = usersArray.find((u: any) => u.id === member.user_id);
                        return {
                            ...member,
                            user: user || null
                        };
                    }) : [];

                    const isOpen = openGroups[group.id] || false;

                    return (
                        <Grid item xs={12} key={group.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton onClick={() => handleToggleGroup(group.id)} size="small">
                                                {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                                <GroupIcon sx={{ mr: 1 }} />
                                                Группа: {group.name} ({groupMembers.length} {getParticipantsWord(groupMembers.length)})
                                                {/* <Chip 
                                                    label={groupMembers.length} 
                                                    color="primary" 
                                                    size="small" 
                                                    sx={{ ml: 1 }}
                                                /> */}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            color="error"
                                            onClick={() => openDeleteDialog('group', group.group_id)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                    {isOpen && (
                                        <>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {group.description}
                                            </Typography>

                                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>
                                                                <TableSortLabel
                                                                    active={groupOrderBy[group.id] === 'name'}
                                                                    direction={groupOrderBy[group.id] === 'name' ? groupOrder[group.id] || 'asc' : 'asc'}
                                                                    onClick={() => handleGroupRequestSort(group.id, 'name')}
                                                                >
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                                                                        Пользователь
                                                                    </Box>
                                                                </TableSortLabel>
                                                            </TableCell>
                                                            <TableCell>
                                                                <TableSortLabel
                                                                    active={groupOrderBy[group.id] === 'email'}
                                                                    direction={groupOrderBy[group.id] === 'email' ? groupOrder[group.id] || 'asc' : 'asc'}
                                                                    onClick={() => handleGroupRequestSort(group.id, 'email')}
                                                                >
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                                                                        Email
                                                                    </Box>
                                                                </TableSortLabel>
                                                            </TableCell>
                                                            <TableCell>
                                                                <TableSortLabel
                                                                    active={groupOrderBy[group.id] === 'role'}
                                                                    direction={groupOrderBy[group.id] === 'role' ? groupOrder[group.id] || 'asc' : 'asc'}
                                                                    onClick={() => handleGroupRequestSort(group.id, 'role')}
                                                                >
                                                                    Роль
                                                                </TableSortLabel>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {groupMembers.length > 0 ? (
                                                            stableSort(groupMembers, getComparator(groupOrder[group.id] || 'asc', groupOrderBy[group.id] === 'role' ? 'user.role.name' : groupOrderBy[group.id] || 'name')).slice((groupPage[group.id] || 0) * (groupRowsPerPage[group.id] || 10), (groupPage[group.id] || 0) * (groupRowsPerPage[group.id] || 10) + (groupRowsPerPage[group.id] || 10)).map((member: any) => (
                                                                <TableRow key={member.id}>
                                                                    <TableCell>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            {/* <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                                                {member.user?.name.charAt(0).toUpperCase() || '?'}
                                                                            </Avatar> */}
                                                                            <Box>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                                                    {member.user?.name || 'Неизвестный пользователь'}
                                                                                </Typography>
                                                                                {/* <Typography variant="caption" color="text.secondary">
                                                                                    ID: {member.user_id}
                                                                                </Typography> */}
                                                                            </Box>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography variant="body2">
                                                                            {member.user?.email || 'Неизвестно'}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {member.user?.role ? (
                                                                            <Chip 
                                                                                label={member.user.role.name} 
                                                                                color={getRoleColor(member.user.role.code)}
                                                                                size="small"
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                Неизвестно
                                                                            </Typography>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={4} align="center">
                                                                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                                                        В этой группе пока нет участников
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                                <TablePagination
                                                    rowsPerPageOptions={[5, 10, 25]}
                                                    component="div"
                                                    count={groupMembers.length}
                                                    rowsPerPage={groupRowsPerPage[group.id] || 10}
                                                    page={groupPage[group.id] || 0}
                                                    onPageChange={(e, newPage) => handleGroupChangePage(group.id, e, newPage)}
                                                    onRowsPerPageChange={e => handleGroupChangeRowsPerPage(group.id, e)}
                                                />
                                            </TableContainer>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}

                {/* Таблица пользователей выбранной группы (предварительный просмотр) */}
                {selectedGroup && (
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon sx={{ mr: 1 }} />
                                    Предварительный просмотр: Участники группы "{selectedGroupInfo?.name}"
                                    <Chip 
                                        label={groupMembers.length} 
                                        color="primary" 
                                        size="small" 
                                        sx={{ ml: 1 }}
                                    />
                                </Typography>

                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={previewOrderBy === 'name'}
                                                        direction={previewOrderBy === 'name' ? previewOrder : 'asc'}
                                                        onClick={() => handlePreviewRequestSort('name')}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                                                            Пользователь
                                                        </Box>
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={previewOrderBy === 'email'}
                                                        direction={previewOrderBy === 'email' ? previewOrder : 'asc'}
                                                        onClick={() => handlePreviewRequestSort('email')}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                                                            Email
                                                        </Box>
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={previewOrderBy === 'role'}
                                                        direction={previewOrderBy === 'role' ? previewOrder : 'asc'}
                                                        onClick={() => handlePreviewRequestSort('role')}
                                                    >
                                                        Роль
                                                    </TableSortLabel>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {groupMembers.length > 0 ? (
                                                stableSort(groupMembers, getComparator(previewOrder, previewOrderBy === 'role' ? 'user.role.name' : previewOrderBy)).slice(previewPage * previewRowsPerPage, previewPage * previewRowsPerPage + previewRowsPerPage).map((member: any) => (
                                                    <TableRow key={member.id}>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box>
                                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                                        {member.user?.name || 'Неизвестный пользователь'}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        ID: {member.user_id}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {member.user?.email || 'Неизвестно'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {member.user?.role ? (
                                                                <Chip 
                                                                    label={member.user.role.name} 
                                                                    color={getRoleColor(member.user.role.code)}
                                                                    size="small"
                                                                />
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Неизвестно
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center">
                                                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                                            В этой группе пока нет участников
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={groupMembers.length}
                                        rowsPerPage={previewRowsPerPage}
                                        page={previewPage}
                                        onPageChange={handlePreviewChangePage}
                                        onRowsPerPageChange={handlePreviewChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Кнопка сохранения */}
            {/* <Box sx={{ mt: 4, display: 'flex', justifyContent: 'left' }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        const userIds = accessUsersArray.map((user: any) => user.id);
                        const groupIds = accessGroupsArray.map((group: any) => group.id);
                        
                        const message = `
Текущие данные доступа к тесту:

Пользователи (${userIds.length}): ${userIds.length > 0 ? userIds.join(', ') : 'нет'}
Группы (${groupIds.length}): ${groupIds.length > 0 ? groupIds.join(', ') : 'нет'}

Общее количество пользователей: ${userIds.length + groupUsers.length}
                        `.trim();
                        
                        alert(message);
                    }}
                    disabled={accessUsersArray.length === 0 && accessGroupsArray.length === 0}
                    sx={{ 
                        textTransform: 'none'
                    }}
                >
                    Показать текущие данные
                </Button>
            </Box> */}
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

            {/* Диалог подтверждения удаления */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {deleteTarget.type === 'user' ? 'Удалить пользователя' : 'Удалить группу'}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {deleteTarget.type === 'user'
                            ? 'Вы уверены, что хотите удалить этого пользователя из теста?'
                            : 'Вы уверены, что хотите удалить эту группу из теста?'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} variant="outlined" color="inherit">
                        Отмена
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="outlined">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
})

export default DomainAccess;
