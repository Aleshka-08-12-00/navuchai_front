import React, { useState } from 'react';
import { Button, Flex, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import styles from './style.module.scss';
import DropDownDowload from './dropDownDowload/dropDownDowload';
import SearchInput from './searchInput/SearchInput';


type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DataType {
  key: React.Key;
  test_name: string;
  last_name: string;
  first_name: string;
  total_score: number;
  end_date: string;
  test_time: string
}

const columns: TableColumnsType<DataType> = [
  { title: '#', dataIndex: 'key', sorter: (a, b) => Number(a.key) - Number(b.key) },
  { title: 'Название теста', dataIndex: 'test_name', sorter: (a, b) => a.test_name.localeCompare(b.test_name) },
  { title: 'Фамилия', dataIndex: 'last_name', sorter: (a, b) => a.last_name.localeCompare(b.last_name) },
  { title: 'Имя', dataIndex: 'first_name', sorter: (a, b) => a.first_name.localeCompare(b.first_name) },
  { title: 'Результат', dataIndex: 'total_score', sorter: (a, b) => a.total_score - b.total_score, 
    render: (score: number) => {
      const color = score >= 50 ? 'rgb(154, 244, 158)' : 'rgb(245, 141, 142)';
      return <div className={styles["box-score"]} style={{ backgroundColor: color }}>{score}%</div>;
    }
  },
  { title: 'Дата', dataIndex: 'end_date', sorter: (a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime() },
  { title: 'Время', dataIndex: 'test_time', sorter: (a, b) => a.test_time.localeCompare(b.test_time) },
];

const dataSource = [
  { key: 1, test_name: "Математика", last_name: "Иванов", first_name: "Алексей", total_score: 85, end_date: "2025-03-25", test_time: "14:30" },
  { key: 2, test_name: "Физика", last_name: "Петров", first_name: "Дмитрий", total_score: 92, end_date: "2025-03-24", test_time: "10:15" },
  { key: 3, test_name: "Химия", last_name: "Сидоров", first_name: "Максим", total_score: 78, end_date: "2025-03-23", test_time: "12:00" },
  { key: 4, test_name: "Биология", last_name: "Козлов", first_name: "Артем", total_score: 88, end_date: "2025-03-22", test_time: "09:45" },
  { key: 5, test_name: "Информатика", last_name: "Морозов", first_name: "Иван", total_score: 95, end_date: "2025-03-21", test_time: "16:20" },
  { key: 6, test_name: "История", last_name: "Васильев", first_name: "Олег", total_score: 5, end_date: "2025-03-20", test_time: "11:10" },
  { key: 7, test_name: "География", last_name: "Зайцев", first_name: "Егор", total_score: 76, end_date: "2025-03-19", test_time: "15:40" },
  { key: 8, test_name: "Английский язык", last_name: "Новиков", first_name: "Андрей", total_score: 49, end_date: "2025-03-18", test_time: "13:25" },
  { key: 9, test_name: "Французский язык", last_name: "Белов", first_name: "Никита", total_score: 51, end_date: "2025-03-17", test_time: "08:30" },
  { key: 10, test_name: "Литература", last_name: "Романов", first_name: "Владимир", total_score: 50, end_date: "2025-03-16", test_time: "10:50" },
  { key: 11, test_name: "Экономика", last_name: "Тимофеев", first_name: "Григорий", total_score: 11, end_date: "2025-03-15", test_time: "14:00" },
  { key: 12, test_name: "Право", last_name: "Федоров", first_name: "Сергей", total_score: 87, end_date: "2025-03-14", test_time: "17:10" },
  { key: 13, test_name: "Социология", last_name: "Александров", first_name: "Роман", total_score: 70, end_date: "2025-03-13", test_time: "09:00" },
  { key: 14, test_name: "Философия", last_name: "Дмитриев", first_name: "Павел", total_score: 12, end_date: "2025-03-12", test_time: "15:30" },
  { key: 15, test_name: "Логика", last_name: "Гаврилов", first_name: "Денис", total_score: 77, end_date: "2025-03-11", test_time: "11:45" },
  { key: 16, test_name: "Психология", last_name: "Орлов", first_name: "Илья", total_score: 23, end_date: "2025-03-10", test_time: "16:55" },
  { key: 17, test_name: "Физкультура", last_name: "Крылов", first_name: "Антон", total_score: 96, end_date: "2025-03-09", test_time: "13:15" },
  { key: 18, test_name: "Черчение", last_name: "Борисов", first_name: "Виталий", total_score: 73, end_date: "2025-03-08", test_time: "12:30" },
  { key: 19, test_name: "Труд", last_name: "Макаров", first_name: "Евгений", total_score: 85, end_date: "2025-03-07", test_time: "09:50" },
  { key: 20, test_name: "Русский язык", last_name: "Николаев", first_name: "Кирилл", total_score: 88, end_date: "2025-03-06", test_time: "14:05" },
  { key: 21, test_name: "Математика", last_name: "Семенов", first_name: "Аркадий", total_score: 81, end_date: "2025-03-05", test_time: "10:35" },
  { key: 22, test_name: "Физика", last_name: "Захаров", first_name: "Вячеслав", total_score: 90, end_date: "2025-03-04", test_time: "08:20" },
  { key: 23, test_name: "Химия", last_name: "Тихонов", first_name: "Владислав", total_score: 43, end_date: "2025-03-03", test_time: "15:50" },
  { key: 24, test_name: "Биология", last_name: "Беляев", first_name: "Степан", total_score: 92, end_date: "2025-03-02", test_time: "11:25" },
  { key: 25, test_name: "Информатика", last_name: "Богданов", first_name: "Альберт", total_score: 97, end_date: "2025-03-01", test_time: "17:40" },
  { key: 26, test_name: "История", last_name: "Денисов", first_name: "Юрий", total_score: 86, end_date: "2025-02-29", test_time: "13:10" },
  { key: 27, test_name: "География", last_name: "Фомин", first_name: "Тимур", total_score: 74, end_date: "2025-02-28", test_time: "12:45" },
  { key: 28, test_name: "Английский язык", last_name: "Громов", first_name: "Константин", total_score: 91, end_date: "2025-02-27", test_time: "09:15" },
  { key: 29, test_name: "Французский язык", last_name: "Ершов", first_name: "Оскар", total_score: 87, end_date: "2025-02-26", test_time: "10:55" },
  { key: 30, test_name: "Литература", last_name: "Михайлов", first_name: "Станислав", total_score: 83, end_date: "2025-02-25", test_time: "14:45" }
]

const ResultTable: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
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

  const filteredData = dataSource.filter(item => {
    return (
      item.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.first_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Flex gap="middle" vertical>
      <Flex align="center" gap="middle">
        <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Обновить
        </Button>
        {hasSelected ? `Выделено: ${selectedRowKeys.length}` : null}
      </Flex>
      <Flex align="center" gap="middle" justify='space-between'>
        <DropDownDowload dataSource={dataSource} columns={columns}/>
        <SearchInput onSearch={onSearch} />
      </Flex>
      <Table<DataType> 
        rowSelection={rowSelection} 
        columns={columns} 
        dataSource={filteredData} 
        pagination={{
          current,
          pageSize,
          pageSizeOptions: ['10', '20', '50'],
          showSizeChanger: true,
          total: dataSource.length,
          locale: {
            items_per_page: '',
          }
        }}
        onChange={handleTableChange}
      />
    </Flex>
  );
};

export default ResultTable;