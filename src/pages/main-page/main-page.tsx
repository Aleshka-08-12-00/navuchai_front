import { Box, Button, IconButton, Stack, Typography, FormControl, Select, MenuItem, TextField, SelectChangeEvent } from "@mui/material";
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
import { Menu } from '@mui/material';
import { InterfaceTests } from "../../interface/interfaceStore";


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
  const { mainPageStore } = React.useContext(Context);
  const {getTests, testsArray} = mainPageStore

   React.useEffect(() => {
    getTests()
  }, []);

  const navigate = useNavigate();


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleCopy = () => {
        alert("Удалить выбрано");
        handleCloseMenu();
    };

    const handleDuplicate = () => {
        alert("Дублировать выбрано");
        handleCloseMenu();
    };

  const data = [
    {}
  ]

  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // Фильтрация по поиску
  const filteredTests = testsArray.filter((item: InterfaceTests) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

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
                  onClick={() => navigate(`/main-page/new-test`)}
                >
                  Новый тест
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#f6f8fa', borderRadius: 8, padding: '12px 20px', minHeight: 56 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" color="textSecondary" sx={{ mr: 1 }}>Category</Typography>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={category}
                    onChange={handleCategoryChange}
                    displayEmpty
                  >
                    <MenuItem value="all">All categories</MenuItem>
                    <MenuItem value="cat1">Category 1</MenuItem>
                    <MenuItem value="cat2">Category 2</MenuItem>
                  </Select>
                </FormControl>
                <IconButton size="small" sx={{ ml: 1 }}>
                  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14.5A6.5 6.5 0 1 1 10 3.5a6.5 6.5 0 0 1 0 13Zm.75-10.25h-1.5v5.5l4.75 2.85.75-1.23-4-2.37V6.25Z" fill="#757575"/></svg>
                </IconButton>
                <Button variant="text" size="small" startIcon={<svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 13.75A6.25 6.25 0 1 1 9 2.75a6.25 6.25 0 0 1 0 12.5Zm2.47-7.97-2.47 2.47-2.47-2.47-.88.88 3.35 3.35 3.35-3.35-.88-.88Z" fill="#757575"/></svg>} sx={{ textTransform: 'none', color: '#757575', ml: 1 }}>
                  Manage categories
                </Button>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" color="textSecondary" sx={{ mr: 1 }}>Status</Typography>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    displayEmpty
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Search"
                  value={search}
                  onChange={handleSearchChange}
                  sx={{ minWidth: 200, background: '#fff', borderRadius: 1 }}
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small">
                        <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" stroke="#757575" strokeWidth="2"/><path d="M15 15l-3-3" stroke="#757575" strokeWidth="2" strokeLinecap="round"/></svg>
                      </IconButton>
                    )
                  }}
                />
              </Box>
            </div>
          </Grid>
        
          <Grid container spacing={2}>
            {filteredTests && filteredTests.map((item: InterfaceTests, index: number) => (
              <Grid item xs={12} sm={6} md={6} lg={6} 
             key={index}
               >
                <MainCard contentSX={{ p: 2.25, pt: 3.3 }}>
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', margin: 'auto', justifyContent: 'space-between' }}>

                      <Button
                        variant="outlined"
                        style={{ 
                          textTransform: 'none', 
                          color: item.status_color,
                          borderColor: item.status_color 
                        }}
                        size="small"
                      >
                        {item.status_name_ru}
                      </Button>
                      <Typography variant="h6" color="textSecondary" >
                        создан: {item.access_timestamp}
                      </Typography>
                      <Box>
                        <IconButton aria-label="Example" onClick={handleOpenMenu}>
                          <FontAwesomeSvgIcon icon={faEllipsisV} />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleCloseMenu}
                          PaperProps={{
                            style: {
                              border: '1px solid gray', // Серая рамка
                              borderRadius: '8px',
                              padding: '5px',
                            },
                          }}
                        >
                          <MenuItem onClick={handleCopy}>Удалить</MenuItem>
                          <MenuItem onClick={handleDuplicate}>Дублировать</MenuItem>
                        </Menu>
                      </Box>
                      {/* <IconButton aria-label="Example">
                      <FontAwesomeSvgIcon icon={faEllipsisV} />
                    </IconButton> */}

                    </div>

                    <Stack sx={{ mt: 2, mb: 2 }} style={{ cursor: 'pointer' }}  onClick={() => navigate(`/main-page/test/${item.id}`)}>
                      <Typography variant="h4"  >
                        {item.title}
                      </Typography>
                    </Stack>
                    <Stack sx={{ mb: 2 }} style={{ cursor: 'pointer' }}  onClick={() => navigate(`/main-page/test/${item.id}`)}>
                      <Typography variant="h6" color="textSecondary" >
                        ({item.description})
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
                          {item.percent}%
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
                        <Button variant="outlined" size="small" color="secondary" style={{ textTransform: 'uppercase', }}>{item.category_name}</Button>
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
