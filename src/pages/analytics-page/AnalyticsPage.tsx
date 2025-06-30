import React, { useState } from 'react'
import { Table, Button, Space, Tag, Typography, Modal, Popconfirm, Select } from 'antd'
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { 
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
    TextField,
    Button as MuiButton
} from '@mui/material'
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Person as PersonIcon,
    Search as SearchIcon,
    DownloadForOfflineOutlined
} from '@mui/icons-material'

import MainCard from '../../components/MainCard'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import { IUsers, IRoles } from '../../interface/interfaceStore'

const AnalyticsPage = observer(() => {
    const { analyticsStore } = React.useContext(Context)
    const { getAnalyticsFile, analyticsViews, getAnalyticsViews, loadingViews } = analyticsStore

    // Состояния для отображения загрузки и ошибок
    const [loadingType, setLoadingType] = useState<string | null>(null)
    const [alert, setAlert] = useState<{ message: string, severity: 'success' | 'error' } | null>(null)

    React.useEffect(() => {
        getAnalyticsViews()
    }, [getAnalyticsViews])

    const handleDownload = async (type: string) => {
        setLoadingType(type)
        setAlert(null)
        try {
            await getAnalyticsFile(type, () => {
                setAlert({ message: 'Файл успешно загружен', severity: 'success' })
            })
        } catch (e) {
            setAlert({ message: 'Ошибка при скачивании файла', severity: 'error' })
        } finally {
            setLoadingType(null)
        }
    }

    return (
        <div>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MuiTypography variant="h5">Аналитика по тестам</MuiTypography>
            </Box>
            <div>
                {loadingViews ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <MuiTypography variant="body1">Загрузка видов аналитики...</MuiTypography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                            gap: 3,
                            justifyItems: 'center',
                        }}
                    >
                        {analyticsViews.map((item, idx) => (
                            <Box
                                key={item.id || idx}
                                sx={{
                                    minWidth: 220,
                                    minHeight: 220,
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    background: item.background,
                                    color: 'black',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 2,
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                    '&:hover': {
                                        transform: 'translateY(-6px) scale(1.04)',
                                        boxShadow: 6,
                                        background: item.background_hover,
                                    },
                                }}
                            >
                                <DownloadForOfflineOutlined sx={{ fontSize: 48, mb: 1, mt: 1, color: 'black' }} />
                                <MuiTypography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 1 }}>
                                    {loadingType === item.type ? 'Загрузка...' : item.name}
                                </MuiTypography>
                                {item.description && (
                                    <MuiTypography variant="body2" sx={{ opacity: 0.85, textAlign: 'center', mb: 2 }}>
                                        {item.description}
                                    </MuiTypography>
                                )}
                                <MuiButton
                                    variant="contained"
                                    color='inherit'
                                    onClick={() => handleDownload(item.type)}
                                    disabled={loadingType === item.type}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        width: '100%',
                                    }}
                                >
                                    Скачать
                                </MuiButton>
                            </Box>
                        ))}
                    </Box>
                )}
                {alert && (
                    <Snackbar
                        open={!!alert}
                        autoHideDuration={4000}
                        onClose={() => setAlert(null)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={() => setAlert(null)} severity={alert.severity} sx={{ width: '100%' }}>
                            {alert.message}
                        </Alert>
                    </Snackbar>
                )}
            </div>
        </div>
    )
})

export default AnalyticsPage
