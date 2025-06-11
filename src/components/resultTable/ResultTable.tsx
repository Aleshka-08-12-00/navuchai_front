// ResultTable.tsx
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Progress, Table, Tooltip, Typography } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import styles from "./style.module.scss";

import SearchInput from "./searchInput/SearchInput";
import { useNavigate } from "react-router";
import { IUserTestResultRow } from "../../interface/interfaceStore";
import authStore from "../../store/authStore";
import { Context } from "../..";
import DropDownDownload from "./dropDownDowload/dropDownDowload";
import { ReloadOutlined } from "@ant-design/icons";
import { Box } from "@mui/system";

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
    sorter: (a, b) => a.percentage - b.percentage,
    render: (score: number) => {
      const color = score >= 60 ? "#9af49e" : "#f58d8f";
      return (
        <Tooltip title={`Процент прохождения: ${score}%`}>
          <Progress
            percent={score}
            className={styles.customProgressBar}
            status="active"
            strokeColor={color}
            showInfo
            size={[200, 20]}
          />
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
    sorter: (a, b) => {
      // Предположим, что test_time в формате "HH:MM:SS"
      const toSeconds = (t: string) => {
        const [h, m, s] = t.split(":").map(Number);
        return h * 3600 + m * 60 + s;
      };
      return toSeconds(a.test_time) - toSeconds(b.test_time);
    },
  },
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
    // if (!authStore.userId) {
    //   authStore.authMe().then(() => {
    //     if (authStore.userId) loadData();
    //   });

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

  const filteredData = allResults.filter((item) =>
    Object.values(item).some((field) =>
      String(field).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
        <Box>
          <SearchInput onSearch={onSearch} />
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
