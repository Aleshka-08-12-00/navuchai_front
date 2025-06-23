import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Progress, Table, Tooltip, Typography } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import styles from "./style.module.scss";
import { useNavigate } from "react-router";
import { IUserTestResultRow } from "../../interface/interfaceStore";
import { Context } from "../..";
import DropDownDownload from "./dropDownDowload/dropDownDowload";
import { ReloadOutlined } from "@ant-design/icons";
import { Box } from "@mui/system";
import { IconButton, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { Card, CardContent, Stack } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

const ResultTable: React.FC = observer(() => {
  const { resultTableStore, settingsNewTestStore, userStore } = React.useContext(Context);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTest, setSelectedTest] = useState('');

  const navigate = useNavigate();


  useEffect(() => {
    resultTableStore.getResults();
    settingsNewTestStore.getTestCategories();
  }, []);

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const onSearch = (value: string) => {
    setSearchQuery(value);
    setCurrent(1);
  };

  const allResults = resultTableStore.getFormattedUserResults();
  const testNames = Array.from(new Set(allResults.map(r => r.test_name))).filter(Boolean);
  const userNames = Array.from(new Set(allResults.map(r => r.name))).filter(Boolean);

  const filteredData = allResults.filter((item: any) => {
    const matchesSearch =
      item.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUser = !selectedUser || item.name === selectedUser;
    const matchesTest = !selectedTest || item.test_name === selectedTest;
    return matchesSearch && matchesUser && matchesTest;
  });

  const columns: TableColumnsType<IUserTestResultRow> = [
    {
      title: "№",
      dataIndex: "index",
      render: (_: any, __: IUserTestResultRow, index: number) => (current - 1) * pageSize + index + 1,
    },
    {
      title: "Название теста",
      dataIndex: "test_name",
      sorter: (a, b) => a.test_name.localeCompare(b.test_name),
    },
    {
      title: "Имя и фамилия",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Результат",
      dataIndex: "percentage",
      render: (score: number) => {
        const color = score >= 60 ? "#9af49e" : "#f58d8f";
        return (
          <Tooltip title={`Тест решён на: ${score}%`}>
            <Progress
              percent={score}
              className={styles.customProgressBar}
              status="active"
              strokeColor={color}
              size={[200, 20]}
              showInfo={false}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "%",
      dataIndex: "percentage",
      sorter: (a, b) => a.percentage - b.percentage,
      render: (score: number) => {
        return (
          <Tooltip>
            <Typography>
              {score}%
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      title: "Дата",
      dataIndex: "end_date",
      sorter: (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),
    },
    {
      title: "Время",
      dataIndex: "test_time",
      key: 'test_time_seconds',
      sorter: (a: IUserTestResultRow, b: IUserTestResultRow) => a.test_time_seconds - b.test_time_seconds,
    }
  ];

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Card sx={{ mb: 2, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" gap={3} flexWrap="wrap">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PeopleIcon color="primary" />
              <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 600 }}>
                Пользователь
              </Typography>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2, background: 'rgba(255,255,255,0.8)' }}
                >
                  <MenuItem value="">Все пользователи</MenuItem>
                  {userNames.map(name => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DonutLargeIcon color="primary" />
              <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 600 }}>
                Тест
              </Typography>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select
                  value={selectedTest}
                  onChange={e => setSelectedTest(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2, background: 'rgba(255,255,255,0.8)' }}
                >
                  <MenuItem value="">Все тесты</MenuItem>
                  {testNames.map(name => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
              <SearchIcon color="primary" />
              <TextField
                size="small"
                variant="outlined"
                placeholder="Поиск по словам..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                sx={{
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.8)'
                  }
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Table<IUserTestResultRow>
        columns={columns}
        dataSource={filteredData}
        pagination={{
          current,
          pageSize,
          pageSizeOptions: ["10", "20", "50"],
          showSizeChanger: true,
          total: filteredData.length,
          locale: { items_per_page: "" },
        }}
        rowClassName={styles["clickable-row"]}
        onRow={(record) => ({
          onClick: () => {
            console.log("Clicked resultId:", record.key);
            navigate(`/results/${record.key}`);
          },
        })}
        onChange={handleTableChange}
        loading={resultTableStore.loading}
      />
    </Box>
  );
});

export default ResultTable;
