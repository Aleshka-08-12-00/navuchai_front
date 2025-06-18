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
    Divider
} from '@mui/material';
import {
    Person as PersonIcon,
    Group as GroupIcon,
    Email as EmailIcon,
    CalendarToday as CalendarIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../../..';

const DomainAccess = observer(() => {
    const { accessTestToUserStore } = React.useContext(Context);

    const { getUsers, usersArray, getRespondentLists, respondentListsArray } = accessTestToUserStore;

    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [resultUsers, setResultUsers] = useState<any[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
    const [removedUsersNotification, setRemovedUsersNotification] = useState<{
        show: boolean;
        users: any[];
        groupName: string;
    }>({ show: false, users: [], groupName: '' });

    React.useEffect(() => {
        getUsers();
        getRespondentLists();
    }, []);

    const handleGroupChange = (event: SelectChangeEvent) => {
        setSelectedGroup(event.target.value);
    };

    const handleUserChange = (event: SelectChangeEvent) => {
        setSelectedUser(event.target.value);
    };

    const handleAddGroup = () => {
        if (selectedGroup && selectedGroupInfo) {
            // Проверяем, не добавлена ли уже эта группа
            const isAlreadyAdded = selectedGroups.some(group => group.id === selectedGroupInfo.id);
            if (!isAlreadyAdded) {
                // Получаем всех пользователей из новой группы
                const newGroupUsers = selectedGroupInfo.members.map((member: any) => {
                    const user = usersArray.find((u: any) => u.id === member.user_id);
                    return user;
                }).filter(Boolean);

                // Находим пользователей, которые будут удалены из resultUsers
                const usersToRemove = resultUsers.filter(user => 
                    newGroupUsers.some(groupUser => groupUser && groupUser.id === user.id)
                );

                // Удаляем пользователей из resultUsers, которые есть в новой группе
                const updatedResultUsers = resultUsers.filter(user => 
                    !newGroupUsers.some(groupUser => groupUser && groupUser.id === user.id)
                );

                // Показываем уведомление, если были удалены пользователи
                if (usersToRemove.length > 0) {
                    setRemovedUsersNotification({
                        show: true,
                        users: usersToRemove,
                        groupName: selectedGroupInfo.name
                    });
                    
                    // Автоматически скрываем уведомление через 10 секунд
                    setTimeout(() => {
                        setRemovedUsersNotification({ show: false, users: [], groupName: '' });
                    }, 10000);
                }

                // Обновляем состояние
                setSelectedGroups([...selectedGroups, selectedGroupInfo]);
                setResultUsers(updatedResultUsers);
                setSelectedGroup(''); // Очищаем выбор
            }
        }
    };

    const handleRemoveGroup = (groupId: number) => {
        setSelectedGroups(selectedGroups.filter(group => group.id !== groupId));
    };

    const handleCloseNotification = () => {
        setRemovedUsersNotification({ show: false, users: [], groupName: '' });
    };

    const handleAddUser = () => {
        if (selectedUser && selectedUserInfo) {
            // Проверяем, не добавлен ли уже этот пользователь
            const isAlreadyAdded = resultUsers.some(user => user.id === selectedUserInfo.id);
            if (!isAlreadyAdded) {
                setResultUsers([...resultUsers, selectedUserInfo]);
                setSelectedUser(''); // Очищаем выбор
            }
        }
    };

    const handleRemoveUser = (userId: number) => {
        setResultUsers(resultUsers.filter(user => user.id !== userId));
    };

    const handleNavigate = () => {
        navigate('/settings');
    };

    // Получаем всех пользователей из добавленных групп
    const getAllGroupUsers = () => {
        const groupUsers: any[] = [];
        selectedGroups.forEach(group => {
            group.members.forEach((member: any) => {
                const user = usersArray.find((u: any) => u.id === member.user_id);
                if (user && !groupUsers.some(gu => gu.id === user.id)) {
                    groupUsers.push(user);
                }
            });
        });
        return groupUsers;
    };

    const groupUsers = getAllGroupUsers();

    // Проверяем, добавлен ли пользователь в список или в группы
    const isUserAdded = (userId: number) => {
        return resultUsers.some(user => user.id === userId) || 
               groupUsers.some(user => user.id === userId);
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
                                    {respondentListsArray.map((group: any) => (
                                        <MenuItem key={group.id} value={group.id.toString()}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                <GroupIcon sx={{ mr: 1, fontSize: 20 }} />
                                                <Box>
                                                    <Typography variant="body1">{group.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {group.members.length} участников
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                    ))}
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
                                        disabled={selectedGroups.some(group => group.id === selectedGroupInfo.id)}
                                    >
                                        {selectedGroups.some(group => group.id === selectedGroupInfo.id) 
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
                                        const isInResultUsers = resultUsers.some(ru => ru.id === user.id);
                                        
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
                                                    <Avatar sx={{ mr: 1, width: 24, height: 24, bgcolor: 'primary.main' }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </Avatar>
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
                                                                {isInResultUsers ? 'Добавлен' : 'В группе'}
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
                                                {resultUsers.some(user => user.id === selectedUserInfo.id) 
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

                {/* Результирующая таблица пользователей */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ mr: 1 }} />
                                Выбранные пользователи
                                <Chip 
                                    label={resultUsers.length} 
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
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                                                    Пользователь
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                                                    Email
                                                </Box>
                                            </TableCell>
                                            <TableCell>Роль</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CalendarIcon sx={{ mr: 1, fontSize: 20 }} />
                                                    Дата регистрации
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {resultUsers.length > 0 ? (
                                            resultUsers.map((user: any) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                                    {user.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    ID: {user.id}
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
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {new Date(user.created_at).toLocaleDateString('ru-RU')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleRemoveUser(user.id)}
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
                                                        Выберите пользователей для добавления в список
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Таблицы выбранных групп */}
                {selectedGroups.map((group: any) => {
                    const groupMembers = group.members.map((member: any) => {
                        const user = usersArray.find((u: any) => u.id === member.user_id);
                        return {
                            ...member,
                            user: user || null
                        };
                    });

                    return (
                        <Grid item xs={12} key={group.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <GroupIcon sx={{ mr: 1 }} />
                                            Группа: {group.name}
                                            <Chip 
                                                label={groupMembers.length} 
                                                color="primary" 
                                                size="small" 
                                                sx={{ ml: 1 }}
                                            />
                                        </Typography>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleRemoveGroup(group.id)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {group.description}
                                    </Typography>

                                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                                                            Пользователь
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                                                            Email
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>Роль</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CalendarIcon sx={{ mr: 1, fontSize: 20 }} />
                                                            Дата добавления
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {groupMembers.length > 0 ? (
                                                    groupMembers.map((member: any) => (
                                                        <TableRow key={member.id}>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                                        {member.user?.name.charAt(0).toUpperCase() || '?'}
                                                                    </Avatar>
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
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {new Date(member.created_at).toLocaleDateString('ru-RU')}
                                                                </Typography>
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
                                    </TableContainer>
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
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                                                        Пользователь
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                                                        Email
                                                    </Box>
                                                </TableCell>
                                                <TableCell>Роль</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CalendarIcon sx={{ mr: 1, fontSize: 20 }} />
                                                        Дата добавления
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {groupMembers.length > 0 ? (
                                                groupMembers.map((member: any) => (
                                                    <TableRow key={member.id}>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                                    {member.user?.name.charAt(0).toUpperCase() || '?'}
                                                                </Avatar>
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
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {new Date(member.created_at).toLocaleDateString('ru-RU')}
                                                            </Typography>
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
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Кнопка сохранения */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'left' }}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        const userIds = resultUsers.map(user => user.id);
                        const groupIds = selectedGroups.map(group => group.id);
                        
                        const message = `
Выбранные данные:

Пользователи (${userIds.length}): ${userIds.length > 0 ? userIds.join(', ') : 'нет'}
Группы (${groupIds.length}): ${groupIds.length > 0 ? groupIds.join(', ') : 'нет'}

Общее количество пользователей: ${userIds.length + groupUsers.length}
                        `.trim();
                        
                        alert(message);
                    }}
                    disabled={resultUsers.length === 0 && selectedGroups.length === 0}
                    sx={{ 
                        textTransform: 'none'
                    }}
                >
                    Сохранить
                </Button>
            </Box>
        </Box>
    );
})

export default DomainAccess;
