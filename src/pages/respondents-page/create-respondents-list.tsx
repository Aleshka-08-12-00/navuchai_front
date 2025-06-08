import { Box, Button, IconButton, Stack, Typography, TextField,  Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { observer } from "mobx-react-lite";
import AddBoxIcon from '@mui/icons-material/AddBox';
import MainCard from "../../components/MainCard";
import React, { useState } from "react";
import { Context } from "../..";
import { useParams } from "react-router";
import RespondentListMembers from "./components/RespondentListMembers";

interface Participant {
    id: number;
    email: string;
    name: string;
}

const CreateRespondentsPage = observer(() => {
    const { id } = useParams<{ id: string }>();
    const { respondentsStore } = React.useContext(Context);

    const {
        getUsers,
        usersArray,
        getUserGroupsById,
        respondentListInfo,
        postUsersIntoList,
        putUserGroupsById,
        postUserGroups,
    } = respondentsStore

    React.useEffect(() => {
        getUsers()
    }, []);

    React.useEffect(() => {
        if (id !== 'new'){
            getUserGroupsById(String(id))
        }else if (id === 'new'){

            setTitle('')
            setDescription('')
        }
    }, [id]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');

    React.useEffect(() => {
        if (respondentListInfo) {
            const list = respondentListInfo;
            setTitle(list.name);
            setDescription(list.description);
        }
    }, [respondentListInfo]);

    const handleAddParticipant = async () => {
        if (!selectedUserId || !respondentListInfo?.id) return;
        
        const groupId = id !== 'new' ? parseInt(id, 10) : parseInt(String(respondentListInfo.id), 10);
        if (isNaN(groupId)) {
            console.error('Invalid group ID');
            return;
        }
        const user = usersArray.find(u => u.id === selectedUserId);
        if (user && !participants.some(p => p.id === user.id)) {
            try {
                await postUsersIntoList(groupId, user.id);
                setParticipants([...participants, {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }]);
                setSelectedUserId('');
            } catch (error) {
                console.error('Failed to add user to list:', error);
            }
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !description.trim()) {
            console.error('Title and description cannot be empty');
            return;
        }

        try {
            const data = {
                name: title,
                description: description
            };

            if (id === 'new') {
                await postUserGroups(data);
            } else if (id !== 'new') {
                await putUserGroupsById(data, String(id));
            } else {
                console.error('Invalid ID');
                return;
            }
        } catch (error) {
            console.error('Failed to save respondent list:', error);
        }
    };

    return (
        <>
            <MainCard contentSX={{ p: 2.25, pt: 3.3, }}>
                <Stack spacing={3}>
                    <Typography variant="body1">
                        Основная информация
                    </Typography>

                    <TextField
                        fullWidth
                        label="Заголовок"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Описание"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={4}
                    />
                </Stack>
            </MainCard>

            {(id !== 'new' || respondentListInfo?.id) && (
                <div style={{ marginTop: 20 }}>
                    <MainCard contentSX={{ p: 2.25, pt: 3.3, }}>
                        <Stack spacing={3}>
                            <Typography variant="body1">
                                добавление участника в группу
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="user-select-label">Выберите участника</InputLabel>
                                    <Select
                                        labelId="user-select-label"
                                        value={selectedUserId}
                                        label="Выберите участника"
                                        onChange={(e: SelectChangeEvent<number | ''>) => {
                                            setSelectedUserId(Number(e.target.value) || '');
                                        }}
                                    >
                                        {usersArray.map((user) => (
                                            <MenuItem
                                                key={user.id}
                                                value={user.id}
                                                disabled={participants.some(p => p.id === user.id)}
                                            >
                                                {user.name} ({user.email})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <IconButton
                                    color="primary"
                                    onClick={handleAddParticipant}
                                    disabled={!selectedUserId}
                                >
                                    <AddBoxIcon />
                                </IconButton>
                            </Box>
                        </Stack>
                    </MainCard>
                </div>
            )}

            {(id !== 'new' || respondentListInfo?.id) && (
                <div style={{ marginTop: 20 }}>
                    <RespondentListMembers/>
                </div>
            )}
            <Button
                variant='contained'
                color='success'
                style={{ textTransform: 'none', marginTop: 10 }}
                onClick={handleSave}
                disabled={!title.trim() || !description.trim()}
            >
                сохранить
            </Button>

        </>
    )
});

export default CreateRespondentsPage;


