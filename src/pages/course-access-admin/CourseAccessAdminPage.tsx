import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { getCourses, enrollCourseAdmin, getUserCourses } from 'api';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

const CourseAccessAdminPage = observer(() => {
  const { adminStore } = React.useContext(Context);
  const [courses, setCourses] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | ''>('');
  const [courseId, setCourseId] = useState<number | ''>('');
  const [open, setOpen] = useState(false);
  const [userCourses, setUserCourses] = useState<{ user: any; courses: any[] }[]>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await adminStore.getUsers();
        const c = await getCourses();
        setCourses(c);
        const list = await Promise.all(
          adminStore.userArray.map(async (u) => {
            try {
              const ucs = await getUserCourses(u.id);
              const userCoursesList = c.filter((course: any) => ucs.some((uc: any) => uc.course_id === course.id));
              return { user: u, courses: userCoursesList };
            } catch (err) {
              console.error(err);
              return { user: u, courses: [] };
            }
          })
        );
        setUserCourses(list);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleGrant = async () => {
    try {
      if (userId && courseId) {
        await enrollCourseAdmin(Number(courseId), Number(userId));
        const ucs = await getUserCourses(Number(userId));
        setUserCourses((prev) =>
          prev.map((uc) =>
            uc.user.id === Number(userId)
              ? {
                  user: uc.user,
                  courses: courses.filter((c) =>
                    ucs.some((x: any) => x.course_id === c.id)
                  )
                }
              : uc
          )
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOpen(false);
    }
  };

  const handleRowClick = (event: React.MouseEvent<HTMLElement>, user: any) => {
    setSelectedUser(user);
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleGrantCourse = async (courseIdParam: number) => {
    if (!selectedUser) return;
    try {
      await enrollCourseAdmin(courseIdParam, selectedUser.id);
      const ucs = await getUserCourses(selectedUser.id);
      setUserCourses((prev) =>
        prev.map((uc) =>
          uc.user.id === selectedUser.id
            ? {
                user: uc.user,
                courses: courses.filter((c) =>
                  ucs.some((x: any) => x.course_id === c.id)
                )
              }
            : uc
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      handleCloseMenu();
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

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Пользователь</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Курсы</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userCourses.map((uc) => (
              <TableRow
                key={uc.user.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={(e) => handleRowClick(e, uc.user)}
              >
                <TableCell>{uc.user.name}</TableCell>
                <TableCell>{uc.user.email}</TableCell>
                <TableCell>
                  {uc.courses.length > 0
                    ? uc.courses.map((c) => c.title).join(', ')
                    : 'Нет'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        {courses.map((c) => {
          const hasCourse =
            selectedUser &&
            userCourses
              .find((uc) => uc.user.id === selectedUser.id)?.courses
              .some((sc) => sc.id === c.id);
          return (
            <MenuItem
              key={c.id}
              onClick={() => handleGrantCourse(c.id)}
              disabled={hasCourse}
              selected={hasCourse}
              sx={{
                fontWeight: hasCourse ? 600 : 'normal',
                opacity: hasCourse ? 0.6 : 1
              }}
            >
              {c.title}
            </MenuItem>
          );
        })
      </Menu>
    </Box>
  );
});

export default CourseAccessAdminPage;
