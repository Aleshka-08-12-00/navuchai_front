import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { getCourses, enrollCourseAdmin } from 'api';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

const CourseAccessAdminPage = observer(() => {
  const { adminStore } = React.useContext(Context);
  const [courses, setCourses] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | ''>('');
  const [courseId, setCourseId] = useState<number | ''>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    adminStore.getUsers();
    (async () => {
      try {
        const c = await getCourses();
        setCourses(c);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleGrant = async () => {
    try {
      if (userId && courseId) {
        await enrollCourseAdmin(Number(courseId), Number(userId));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Доступ к курсам</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>Выдать доступ</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Выдать доступ пользователю</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="user-label">Пользователь</InputLabel>
            <Select labelId="user-label" value={userId} label="Пользователь" onChange={e => setUserId(Number(e.target.value))}>
              {adminStore.userArray.map(u => (
                <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="course-label">Курс</InputLabel>
            <Select labelId="course-label" value={courseId} label="Курс" onChange={e => setCourseId(Number(e.target.value))}>
              {courses.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleGrant} variant="contained" disabled={!userId || !courseId}>Выдать</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default CourseAccessAdminPage;
