import React, { useState } from 'react'
import { Table, Button, Space, Tag, Typography, Modal, Popconfirm, Select } from 'antd'
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { 
    Button as MuiButton, 
    Chip, 
    Typography as MuiTypography, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    IconButton,
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    Box,
    Alert,
    Snackbar,
    TextField
} from '@mui/material'
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Person as PersonIcon,
    Search as SearchIcon
} from '@mui/icons-material'

import MainCard from '../../components/MainCard'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import { IUsers, IRoles } from '../../interface/interfaceStore'

const { Title } = Typography
const { Option } = Select

const AdminPage = observer(() => {
    const { adminStore } = React.useContext(Context)
    const [selectedUser, setSelectedUser] = useState<IUsers | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedRoleCode, setSelectedRoleCode] = useState<string>('')
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
    const [search, setSearch] = useState('')

    const {
        getUsers,
        userArray,
        deleteUserById,
        putUserRoleById,
        getRoles,
        rolesArray,
        loading,
    } = adminStore

    React.useEffect(() => {
        getUsers();
        getRoles();
    }, [])

    React.useEffect(() => {
        console.log('userArray:', userArray)
        console.log('rolesArray:', rolesArray)
    }, [userArray, rolesArray])

    const showAlert = (message: string, severity: 'success' | 'error') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await deleteUserById(id)
            showAlert('Пользователь успешно удален', 'success')
        } catch (error) {
            showAlert('Ошибка при удалении пользователя', 'error')
        }
    }

    const handleChangeRole = async (id: number, newRoleCode: string) => {
        console.log('Changing role for user:', id, 'to role:', newRoleCode)
        try {
            await putUserRoleById(id, newRoleCode)
            showAlert('Роль пользователя изменена', 'success')
            setIsModalVisible(false)
            setSelectedUser(null)
            setSelectedRoleCode('')
        } catch (error) {
            console.error('Error changing role:', error)
            showAlert('Ошибка при изменении роли', 'error')
        }
    }

    const getRoleColor = (roleCode: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
        switch (roleCode) {
            case 'admin':
                return 'error'
            case 'moderator':
                return 'warning'
            case 'user':
                return 'success'
            default:
                return 'primary'
        }
    }

    const showUserDetails = (user: IUsers) => {
        console.log('Opening user details for:', user)
        setSelectedUser(user)
        setSelectedRoleCode(user.role.code)
        setIsModalVisible(true)
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Фильтрация пользователей по поиску
    const filteredUsers = userArray.filter((user) => {
        const searchLower = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.username.toLowerCase().includes(searchLower)
        );
    });

    const columns: ColumnsType<IUsers> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <Space>
                    <UserOutlined />
                    {text}
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Логин',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: 'Роль',
            dataIndex: 'role',
            key: 'role',
            sorter: (a, b) => a.role.name.localeCompare(b.role.name),
            render: (role) => (
                <Tag color={getRoleColor(role.code)}>
                    {role.name}
                </Tag>
            ),
        },
        {
            title: 'Дата создания',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
            render: (date) => new Date(date).toLocaleDateString('ru-RU'),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => showUserDetails(record)}
                        title="Изменить"
                    >
                        <EditIcon style={{width: 15, height: 15}} />
                    </IconButton>
                    <Popconfirm
                        title="Удалить пользователя?"
                        description="Это действие нельзя отменить"
                        onConfirm={() => handleDeleteUser(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <IconButton
                            color="error"
                            size="small"
                            title="Удалить"
                        >
                            <DeleteIcon style={{width: 15, height: 15}} />
                        </IconButton>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MuiTypography variant="h5">Администрирование пользователей</MuiTypography>
                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Поиск по имени, email или логину..."
                    value={search}
                    onChange={handleSearchChange}
                    sx={{ minWidth: 300, background: '#fff', borderRadius: 1 }}
                    InputProps={{
                        endAdornment: (
                            <IconButton size="small">
                                <SearchIcon />
                            </IconButton>
                        )
                    }}
                />
            </Box>
            <MainCard>
              
                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} из ${total} пользователей`,
                    }}
                    loading={loading}
                    scroll={{ x: 1200 }}
                />
            </MainCard>

            <Dialog
                open={isModalVisible}
                onClose={() => {
                    setIsModalVisible(false)
                    setSelectedUser(null)
                    setSelectedRoleCode('')
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Изменение данных пользователя</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ pt: 2 }}>
                            <Box sx={{ mb: 3 }}>
                                <MuiTypography variant="body1" sx={{ mb: 1 }}>
                                    <strong>ID:</strong> {selectedUser.id}
                                </MuiTypography>
                                <MuiTypography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Имя:</strong> {selectedUser.name}
                                </MuiTypography>
                                <MuiTypography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Email:</strong> {selectedUser.email}
                                </MuiTypography>
                                <MuiTypography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Логин:</strong> {selectedUser.username}
                                </MuiTypography>
                                <MuiTypography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Текущая роль:</strong>
                                    <Chip 
                                        label={selectedUser.role.name}
                                        color={getRoleColor(selectedUser.role.code)}
                                        size="small"
                                        sx={{ 
                                            ml: 1,
                                            fontWeight: 'bold',
                                            '&.MuiChip-colorInfo': {
                                                backgroundColor: '#2196f3',
                                                color: 'white'
                                            },
                                            '&.MuiChip-colorPrimary': {
                                                backgroundColor: '#1976d2',
                                                color: 'white'
                                            }
                                        }}
                                    />
                                </MuiTypography>
                            </Box>
                            
                            <Box sx={{ mb: 3 }}>
                                <MuiTypography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Изменить роль:</strong>
                                </MuiTypography>
                                <FormControl fullWidth>
                                    <InputLabel>Выберите новую роль</InputLabel>
                                    <MuiSelect
                                        value={selectedRoleCode}
                                        onChange={(e) => setSelectedRoleCode(e.target.value)}
                                        label="Выберите новую роль"
                                    >
                                        {rolesArray.map((role: IRoles) => (
                                            <MenuItem key={role.code} value={role.code}>
                                                <Chip 
                                                    label={role.name}
                                                    color={getRoleColor(role.code)}
                                                    size="small"
                                                    sx={{ 
                                                        mr: 1,
                                                        fontWeight: 'bold',
                                                        '&.MuiChip-colorInfo': {
                                                            backgroundColor: '#2196f3',
                                                            color: 'white'
                                                        },
                                                        '&.MuiChip-colorPrimary': {
                                                            backgroundColor: '#1976d2',
                                                            color: 'white'
                                                        }
                                                    }}
                                                />
                                            </MenuItem>
                                        ))}
                                    </MuiSelect>
                                </FormControl>
                            </Box>

                            <Box>
                                <MuiTypography variant="body1" sx={{ mb: 1 }}>
                                    <strong>Дата создания:</strong> {new Date(selectedUser.created_at).toLocaleString('ru-RU')}
                                </MuiTypography>
                                <MuiTypography variant="body1">
                                    <strong>Последнее обновление:</strong> {new Date(selectedUser.updated_at).toLocaleString('ru-RU')}
                                </MuiTypography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <MuiButton 
                        variant='outlined'
                        color='secondary'
                        onClick={() => {
                            setIsModalVisible(false)
                            setSelectedUser(null)
                            setSelectedRoleCode('')
                        }}
                    >
                        Отмена
                    </MuiButton>
                    <MuiButton 
                        variant='outlined'
                        color='success'
                        style={{textTransform: 'none'}}
                        onClick={() => {
                            if (selectedUser && selectedRoleCode) {
                                handleChangeRole(selectedUser.id, selectedRoleCode)
                            } else {
                                showAlert('Выберите роль для изменения', 'error')
                            }
                        }}
                        disabled={!selectedRoleCode}
                    >
                        Сохранить
                    </MuiButton>
                </DialogActions>
            </Dialog>

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
    )
})

export default AdminPage
