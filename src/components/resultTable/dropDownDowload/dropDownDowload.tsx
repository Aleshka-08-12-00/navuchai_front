import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Typography } from 'antd';
import * as XLSX from 'xlsx';

interface DropDownDownloadProps {
  dataSource: any[];
  columns: any[];
}

const DropDownDownload: React.FC<DropDownDownloadProps> = ({ dataSource }) => {

  //экспорт в XLS
  const exportToXLS = () => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Таблица');
    XLSX.writeFile(wb, 'table_data.xlsx');
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Typography.Link onClick={exportToXLS}>
          Экспорт в .xls
        </Typography.Link>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          Экспорт
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default DropDownDownload;
