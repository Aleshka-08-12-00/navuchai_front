import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import styles from "./style.module.scss";

import SearchInput from "./searchInput/SearchInput";
import { useNavigate } from "react-router";
import DropDownDowload from "./dropDownDowload/dropDownDowload";
import { IUserTestResultRow } from "../../interface/interfaceStore";
import authStore from "../../store/authStore";
import resultTableStore from "../../store/resultTableStore";

type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

const columns: TableColumnsType<IUserTestResultRow> = [
  { title: "#", dataIndex: "key", sorter: (a, b) => Number(a.key) - Number(b.key) },
  { title: "Название теста", dataIndex: "test_name", sorter: (a, b) => a.test_name.localeCompare(b.test_name) },
  { title: "Имя и фамилия", dataIndex: "name" },
  { title: "Email", dataIndex: "email" },
  {
    title: "Результат",
    dataIndex: "total_score",
    render: (score: number) => {
      const color = score >= 50 ? "rgb(154, 244, 158)" : "rgb(245, 141, 142)";
      return (
        <div className={styles["box-score"]} style={{ backgroundColor: color }}>
          {score}%
        </div>
      );
    },
  },
  { title: "Дата", dataIndex: "end_date" },
  { title: "Время", dataIndex: "test_time" },
];

const ResultTable: React.FC = observer(() => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Функция загрузки данных
  const loadData = async () => {
    if (!authStore.userId) return;
    setLoading(true);
    await resultTableStore.getResultByUser(authStore.userId);
    setSelectedRowKeys([]);
    setLoading(false);
  };

  useEffect(() => {
    // Если userId нет — пробуем вызвать authMe()
    if (!authStore.userId) {
      authStore.authMe().then(() => {
        if (authStore.userId) loadData();
      });
    } else {
      loadData();
    }
  }, []);

  useEffect(() => {
    // Если userId изменился (например, после authMe), загружаем данные
    if (authStore.userId) {
      loadData();
    }
  }, [authStore.userId]);

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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button
          type="primary"
          onClick={loadData}
          disabled={loading || resultTableStore.loading}
          loading={loading || resultTableStore.loading}
        >
          Обновить
        </Button>
        {hasSelected && <span>Выделено: {selectedRowKeys.length}</span>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <DropDownDowload dataSource={filteredData} columns={columns} />
        <SearchInput onSearch={onSearch} />
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
          onClick: () => navigate(`/results/${record.key}`),
        })}
        onChange={handleTableChange}
        loading={loading || resultTableStore.loading}
      />
    </div>
  );
});

export default ResultTable;
