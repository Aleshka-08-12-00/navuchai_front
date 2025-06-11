// ResultTable.tsx
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import styles from "./style.module.scss";
import { useNavigate } from "react-router";
import DropDownDowload from "./dropDownDowload/dropDownDowload";
import { IUserTestResultRow } from "../../interface/interfaceStore";
import authStore from "../../store/authStore";
import { Context } from "../..";
import {
  Box,
  Button,
  IconButton,
  TextField,
  CircularProgress
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

const columns: TableColumnsType<IUserTestResultRow> = [
  { title: "id", dataIndex: "key", sorter: (a, b) => Number(a.key) - Number(b.key) },
  { title: "Название теста", dataIndex: "test_name", sorter: (a, b) => a.test_name.localeCompare(b.test_name) },
  { title: "ФИО", dataIndex: "name" },
  { title: "Email", dataIndex: "email" },
  {
    title: "Результат",
    dataIndex: "total_score",
    render: (score: number) => {
      const color = score >= 50 ? "#9af49e" : "#f58d8f";
      return (
        <div className={styles["box-score"]} style={{ 
          backgroundColor: "#e0e0e0", 
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: `${score}%`,
            backgroundColor: color,
            transition: "width 0.3s ease"
          }} />
          <span style={{ position: "relative", zIndex: 1 }}>
            {score}%
          </span>
        </div>
      );
    },
  },
  { title: "Дата", dataIndex: "end_date" },
  { title: "Время", dataIndex: "test_time" },
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
    if (!authStore.userId) {
      authStore.authMe().then(() => {
        if (authStore.userId) loadData();
      });
    } else {
      loadData();
    }
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

  const filteredData = allResults.filter((item) =>
    item.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {hasSelected && <span>Выделено: {selectedRowKeys.length}</span>}
      </div>

      <div style={{
         display: "flex",
         justifyContent: "space-between",
         gap: 12 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
           <Button
            variant='outlined'
            color='primary'
            onClick={loadData}
            disabled={resultTableStore.loading}
            startIcon={resultTableStore.loading ? <CircularProgress size={16} /> : null}
          >
             Обновить
          </Button>
          <DropDownDowload dataSource={filteredData} columns={columns} />
        </div>
      </div>

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
            console.log('Clicked resultId:', record.key);
            navigate(`/results/${record.key}`);
          }
        })}
        onChange={handleTableChange}
        loading={resultTableStore.loading}
      />
    </div>
  );
});

export default ResultTable;
