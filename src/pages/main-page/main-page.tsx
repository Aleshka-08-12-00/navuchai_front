

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MainCard from "../../components/MainCard";

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

import SvgIcon from '@mui/material/SvgIcon';
import React, { useState } from "react";
import { Context } from "../..";
import ContentPage from "./content-page";
import { useNavigate } from "react-router";


type FontAwesomeSvgIconProps = {
  icon: any;
};

const FontAwesomeSvgIcon = React.forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>(
  (props, ref) => {
    const { icon } = props;

    const {
      icon: [width, height, , , svgPathData],
    } = icon;

    return (
      <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
        {typeof svgPathData === 'string' ? (
          <path d={svgPathData} />
        ) : (
          svgPathData.map((d: string, i: number) => (
            <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
          ))
        )}
      </SvgIcon>
    );
  },
);



const MainPage = observer(() => {
    const [activeCard, setActiveCard] = useState(false);
    const [testId, setTestId] = useState(0);
    const { settingsStore } = React.useContext(Context);
    const navigate = useNavigate();

  const data = [
    {
      id: 1,
      status: 'активный',
      statusColor: 'success',
      createDate: '2025.03.02',
      testName: 'Тест на знание языков',
      testDescription: 'нет описания',
      procent: '56.1',
      completed: '37',
    },
    {
      id: 2,
      status: 'завершен',
      statusColor: 'warning',
      createDate: '2024.11.07',
      testName: 'Тест на Валеру',
      testDescription: 'нет описания',
      procent: '21.1',
      completed: '31',
    },
    {
      id: 3,
      status: 'настройка в процессе',
      statusColor: 'primary',
      createDate: '2025.04.04',
      testName: 'Тест по охране труда',
      testDescription: 'нет описания',
      procent: '76.1',
      completed: '69',
    },
    {
      id: 4,
      status: 'активный',
      statusColor: 'success',
      createDate: '2023.09.02',
      testName: 'Тест на знание 1С',
      testDescription: 'нет описания',
      procent: '46.1',
      completed: '28',
    },
    {
      id: 5,
      status: 'активный',
      statusColor: 'success',
      createDate: '2023.09.02',
      testName: 'Тест на знание JS',
      testDescription: 'нет описания',
      procent: '46.1',
      completed: '28',
    },
  
  ]


  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
     
        <>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>
            <Typography variant="h5">Мои тесты ({data.length})</Typography>
            <div >
              <Button
                color="success"
                style={{ textTransform: "none", marginRight: 10, backgroundColor: '#8772c1' }}
                variant="contained"
                startIcon={<AutoFixHighIcon />}
                size="large"
              >
                Генерация тестов
              </Button>
              <Button
                variant="contained"
                color="success"
                style={{ textTransform: "none", backgroundColor: '#0bc279' }}
                size="large"
                startIcon={<AddBoxIcon />}
                onClick={()=>  navigate(`/main-page/new-test`)}
              >
                Новый тест
              </Button>
            </div>
          </div>
        </Grid>
        {/* /main-page/test/:id */}
        <Grid container spacing={2}>
          {data && data.map((item: any, index: number) => (
            <Grid item xs={12} sm={6} md={6} lg={6} style={{cursor: 'pointer'}} onClick={()=>  navigate(`/main-page/test/${item.id}`)}>
              <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                <>
                  <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>

                    <Button
                      variant="outlined"
                      color={item.statusColor}
                      style={{ textTransform: 'none' }}
                      size="small"
                    >
                     {item.status}
                    </Button>
                    <Typography variant="h6" color="textSecondary" >
                      создан: {item.createDate}
                    </Typography>

                    <IconButton aria-label="Example">
                      <FontAwesomeSvgIcon icon={faEllipsisV} />
                    </IconButton>

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
                  <div
                    style={{
                      display: "flex",
                      margin: "auto",
                      justifyContent: "space-between",
                      alignItems: "center", // на случай, если нужно выровнять вертикально
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", textAlign: "left", gap: "10px" }}>
                      <Typography variant="h6" color="textSecondary">
                        <DonutLargeIcon />
                      </Typography>
                      <Typography variant="h6" >
                        {item.procent}%
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        средний результат
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        |
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        Пройдено ({item.completed})
                      </Typography>
                    </div>

                    <div style={{ flex: "1", textAlign: "right" }}>
                      <Button variant="outlined" size="small" color="secondary" style={{ textTransform: 'uppercase', }}>без категории</Button>
                    </div>
                  </div>
                </>
              </MainCard>
            </Grid>
          ))}
        </Grid>
        </>
        
    

      </Box>

    </>
  )
});
export default MainPage;
