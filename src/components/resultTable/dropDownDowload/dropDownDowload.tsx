<<<<<<< HEAD
import React from "react";
import { DownOutlined, DownloadOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Button, Space, Typography, Tooltip } from "antd";
import * as XLSX from "xlsx";
=======
import React from 'react';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Typography } from 'antd';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
>>>>>>> origin/main

interface DropDownDownloadProps {
  columns: any[];
  onExport: () => Promise<void>;
}

const DropDownDownload: React.FC<DropDownDownloadProps> = ({ onExport }) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Typography.Link onClick={onExport}>
          Экспорт в .xls
        </Typography.Link>
      ),
    },
  ];

  return (
<<<<<<< HEAD
    <Tooltip title="Экспорт данных">
      <Dropdown menu={{ items }} trigger={['click']}>
        <Button icon={<DownloadOutlined />} type="default">
          <Space>
            Экспорт <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Tooltip>
=======
    <Dropdown menu={{ items }} trigger={['click']}>
      <a onClick={(e) => e.preventDefault()}>
        <Button variant='outlined' color='inherit' endIcon={<KeyboardArrowDownIcon />}>
          Экспортировать
        </Button>
      </a>
    </Dropdown>
>>>>>>> origin/main
  );
};

export default DropDownDownload;
