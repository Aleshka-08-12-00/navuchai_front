import { Box, Button, IconButton, Stack, Typography, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import MainCard from "../../components/MainCard";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import React, { useState } from "react";
import { Context } from "../..";
import { useParams } from "react-router";
import RespondentListMembers from "../../components/respondentListMembers/RespondentListMembers";

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
        deleteUsersFromList,
    } = respondentsStore

    React.useEffect(() => {
        getUsers()
    }, []);

    React.useEffect(() => {
        if (id !== 'new')
            getUserGroupsById(String(id))
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
        if (selectedUserId && id && id !== 'new') {
            const groupId = parseInt(id, 10);
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
        }
    };

    const handleRemoveParticipant = async (userId: number) => {
        if (id && id !== 'new') {
            const groupId = parseInt(id, 10);
            if (isNaN(groupId)) {
                console.error('Invalid group ID');
                return;
            }
            try {
                await deleteUsersFromList(groupId, userId);
                setParticipants(participants.filter(p => p.id !== userId));
            } catch (error) {
                console.error('Failed to remove user from list:', error);
            }
        } else {
            // For new lists that haven't been saved yet, just remove from local state
            setParticipants(participants.filter(p => p.id !== userId));
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


            <div style={{ marginTop: 20 }}>
                <MainCard contentSX={{ p: 2.25, pt: 3.3, }}>
                    <Stack spacing={3}>
                        <Typography variant="body1">
                            добавление / удаление участников группы
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

                        {/* <List>
                            {participants.map((participant) => (
                                <ListItem key={participant.id}>
                                    <ListItemText
                                        primary={participant.name}
                                        secondary={participant.email}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleRemoveParticipant(participant.id)}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List> */}

                        {participants.length === 0 && (
                            <Typography variant="body2" color="text.secondary" align="center">
                                Нет добавленных участников
                            </Typography>
                        )}
                    </Stack>
                </MainCard>
            </div>

            {id !== 'new' && (
                <div style={{ marginTop: 20 }}>
                    <RespondentListMembers />
                </div>
            )}

        </>
    )
});

export default CreateRespondentsPage;


