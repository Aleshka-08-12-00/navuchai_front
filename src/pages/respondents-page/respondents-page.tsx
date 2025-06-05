import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import MainCard from "../../components/MainCard";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useNavigate } from "react-router";
import React from "react";
import { Context } from "../..";
import { IRespondentLists } from "../../interface/interfaceStore";
import moment from 'moment'


const RespondentsPage = observer(() => {

  const navigate = useNavigate();

  const { respondentsStore } = React.useContext(Context);

  const { respondentListsArray, getRespondentLists } = respondentsStore

  React.useEffect(() => {
    getRespondentLists()
  }, []);


  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>
            <Typography variant="h5">Список участников ({respondentListsArray.length})</Typography>
            <div >
              <Button
                variant="contained"
                color="success"
                style={{ textTransform: "none", backgroundColor: '#0bc279' }}
                size="large"
                onClick={() => navigate(`/respondents/new`)}
                startIcon={<AddBoxIcon />}
              >
                Новый список
              </Button>
            </div>
          </div>
        </Grid>
        <Grid container spacing={2}>
          {respondentListsArray && respondentListsArray.map((item: IRespondentLists, index: number) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
              <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <div onClick={() => navigate(`/respondents/${item.id}`)} style={{cursor: 'pointer'}}>
                  <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="textSecondary" >
                      создан: {moment(item.created_at).format('DD-MM-YYYY')} 
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
                      {item.name}
                    </Typography>
                  </Stack>
                  <Stack sx={{ mb: 2 }}>
                    <Typography variant="h6" color="textSecondary" >
                      ({item.description})
                    </Typography>
                  </Stack>
                </div>
              </MainCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
});
export default RespondentsPage;


