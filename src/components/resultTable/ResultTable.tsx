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
import { IconButton, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

const columns: TableColumnsType<IUserTestResultRow> = [
  {
    title: "#",
    dataIndex: "key",
    sorter: (a, b) => Number(a.key) - Number(b.key),
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

const ResultTable: React.FC = observer(() => {
  const { resultTableStore } = React.useContext(Context);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const loadData = async () => {
    await resultTableStore.getResults();
    setSelectedRowKeys([]);
  };

  useEffect(() => {
      loadData();
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<IUserTestResultRow> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const onSearch = (value: string) => {
    setSearchQuery(value);
    setCurrent(1);
  };

  const allResults = resultTableStore.getFormattedUserResults();

  const filteredData = allResults.filter((item: any) =>
    item.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
         <Box>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Поиск по словам..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            sx={{ minWidth: 200, background: '#fff', borderRadius: 1 }}
            InputProps={{
              endAdornment: (
                <IconButton size="small">
                  <SearchIcon />
                </IconButton>
              )
            }}
          />
        </Box>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Tooltip title="Обновить таблицу">
            <Button
              variant="outlined"
              color="primary"
              icon={<ReloadOutlined />}
              onClick={loadData}
              disabled={resultTableStore.loading}
              style={{
                borderRadius: 7,
                fontWeight: 500,
                fontSize: 14,
                textTransform: "none",
              }}
            >
              Обновить
            </Button>
          </Tooltip>
          {hasSelected && (
            <Typography.Text style={{ fontWeight: 500 }}>
              Выделено: {selectedRowKeys.length}
            </Typography.Text>
          )}
          <Tooltip title="Экспорт данных">
            <DropDownDownload columns={columns} onExport={resultTableStore.exportResultsExcel}/>
          </Tooltip>
        </Box>
      </Box>
      <Table<IUserTestResultRow>
        rowSelection={rowSelection}
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
