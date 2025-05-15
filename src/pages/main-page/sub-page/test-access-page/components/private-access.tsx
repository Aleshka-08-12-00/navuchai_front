import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, Box, Switch, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { testAccessStore } from '../../../../../store/privateAccessStore';


const PrivateAccess = observer(() => {
  const [requireCode, setRequireCode] = React.useState(false);

  useEffect(() => {
    testAccessStore.generateGroupMembers(5); // например, 5 респондентов
  }, []);

  return (
    <Box mt={2}>
      <Typography>
        Требуется приватный код доступа для прохождения теста.
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={requireCode}
            onChange={(e) => setRequireCode(e.target.checked)}
          />
        }
        label="Запрашивать код доступа перед началом теста"
        sx={{ mt: 2 }}
      />
      {requireCode && (
        <>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Перед началом теста респонденту потребуется ввести свой адрес электронной почты,
            на который будет отправлен код доступа.
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Отправить код</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testAccessStore.groupMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={member.send_code}
                        onChange={(e) =>
                          testAccessStore.setSendCode(member.id, e.target.checked)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
});

export default PrivateAccess;
