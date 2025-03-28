import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Flex, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import styles from "./style.module.scss";
import DropDownDowload from "./dropDownDowload/dropDownDowload";
import SearchInput from "./searchInput/SearchInput";
import { store } from "../../store/store"; // Импорт MobX-стора
import { useNavigate } from "react-router";

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

interface DataType {
  key: React.Key;
  test_name: string;
  last_name: string;
  first_name: string;
  total_score: number;
  end_date: string;
  test_time: string;
}

const columns: TableColumnsType<DataType> = [
  { title: "#", dataIndex: "key", sorter: (a, b) => Number(a.key) - Number(b.key) },
  { title: "Название теста", dataIndex: "test_name", sorter: (a, b) => a.test_name.localeCompare(b.test_name) },
  { title: "Фамилия", dataIndex: "last_name", sorter: (a, b) => a.last_name.localeCompare(b.last_name) },
  { title: "Имя", dataIndex: "first_name", sorter: (a, b) => a.first_name.localeCompare(b.first_name) },
  {
    title: "Результат",
    dataIndex: "total_score",
    sorter: (a, b) => a.total_score - b.total_score,
    render: (score: number) => {
      const color = score >= 50 ? "rgb(154, 244, 158)" : "rgb(245, 141, 142)";
      return (
        <div className={styles["box-score"]} style={{ backgroundColor: color }}>
          {score}%
        </div>
      );
    },
  },
  {
    title: "Дата",
    dataIndex: "end_date",
    sorter: (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime(),
  },
  { title: "Время", dataIndex: "test_time", sorter: (a, b) => a.test_time.localeCompare(b.test_time) },
];

const ResultTable: React.FC = observer(() => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const onSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Фильтрация данных по поисковому запросу
  const filteredData = store.dataSource.filter((item) =>
    Object.values(item).some((field) =>
      String(field).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Flex gap="middle" vertical>
      <Flex align="center" gap="middle">
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Обновить
        </Button>
        {hasSelected ? `Выделено: ${selectedRowKeys.length}` : null}
      </Flex>
      <Flex align="center" gap="middle" justify="space-between">
        <DropDownDowload dataSource={store.dataSource} columns={columns} />
        <SearchInput onSearch={onSearch} />
      </Flex>
      <Table<DataType>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        pagination={{
          current,
          pageSize,
          pageSizeOptions: ["10", "20", "50"],
          showSizeChanger: true,
          total: store.dataSource.length,
          locale: {
            items_per_page: "",
          },
        }}
        rowClassName={styles["clickable-row"]}
        onRow={(record) => ({
          onClick: () => {
            store.setSelectedUser(record);
            navigate(`/Results/${record.key}`)
          }
        })}
        onChange={handleTableChange}
      />
    </Flex>
  );
});

export default ResultTable;
