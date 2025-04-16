import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import MainCard from "../../components/MainCard";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';


const RespondentsPage = observer(() => {
  const data = [
    {
      createDate: '2025.03.02',
      testName: 'Список участников ТВВ',
      testDescription: 'нет описания',
    },
    {
      createDate: '2025.04.04',
      testName: 'Список участников по ГН',
      testDescription: 'нет описания',
    },
    {
      createDate: '2023.09.02',
      testName: 'Список ТБР',
      testDescription: 'нет описания',
    },
    {
      createDate: '2023.09.02',
      testName: 'Список ЛДР',
      testDescription: 'нет описания',
    },

  ]

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>
            <Typography variant="h5">Список участников ({data.length})</Typography>
            <div >
              <Button
                variant="contained"
                color="success"
                style={{ textTransform: "none", backgroundColor: '#0bc279' }}
                size="large"
                startIcon={<AddBoxIcon />}
              >
                Новый список
              </Button>
            </div>
          </div>
        </Grid>
        <Grid container spacing={2}>
          {data && data.map((item: any, index: number) => (
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <>
                  <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="textSecondary" >
                      создан: {item.createDate}
                    </Typography>
                    <span>
                      <IconButton aria-label="delete">
                        <DeleteOutlineIcon />
                      </IconButton>
                      <IconButton aria-label="Example">
                        <LibraryAddIcon />
                      </IconButton>
                    </span>
                  </div>
                  <Stack sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="h4"  >
                      {item.testName}
                    </Typography>
                  </Stack>
                  <Stack sx={{ mb: 2 }}>
                    <Typography variant="h6" color="textSecondary" >
                      ({item.testDescription})
                    </Typography>
                  </Stack>
                </>
              </MainCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
});
export default RespondentsPage;


