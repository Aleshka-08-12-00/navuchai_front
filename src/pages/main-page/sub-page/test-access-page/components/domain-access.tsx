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
            // Проверяем, не добавлена ли уже эта группа
            const isAlreadyAdded = accessGroupsArray.some((group: any) => group.group_id === selectedGroupInfo.id);
            if (!isAlreadyAdded) {
                await postGroupToTest(Number(id), selectedGroupInfo.id);
                setSelectedGroup(''); // Очищаем выбор
            }
        }
    };

    const handleRemoveGroup = async (groupId: number) => {
        if (id && window.confirm('Вы уверены, что хотите удалить эту группу из теста?')) {
            await deleteGroupFromTest(Number(id), groupId);
        }
    };

    const handleCloseNotification = () => {
        setRemovedUsersNotification({ show: false, users: [], groupName: '' });
    };

    const handleAddUser = async () => {
        if (selectedUser && selectedUserInfo && id) {
            // Проверяем, не добавлен ли уже этот пользователь
            const isUserAlreadyAdded = accessUsersArray.some((user: any) => user.user_id === selectedUserInfo.id);
            if (!isUserAlreadyAdded) {
                await postUserToTest(Number(id), selectedUserInfo.id);
                setSelectedUser(''); // Очищаем выбор
            }
        }
    };

    const handleRemoveUser = async (userId: number) => {
        if (id && window.confirm('Вы уверены, что хотите удалить этого пользователя из теста?')) {
            await deleteUserFromTest(Number(id), userId);
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
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ mr: 1 }} />
                                Пользователи с доступом к тесту
                                <Chip 
                                    label={accessUsersArray.length} 
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
                                        {accessUsersArray.length > 0 ? (
                                            accessUsersArray.map((user: any) => (
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
                                                            onClick={() => handleRemoveUser(user.user_id)}
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
                            </TableContainer>
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
                                            onClick={() => handleRemoveGroup(group.group_id)}
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
        </Box>
    );
})

export default DomainAccess;
