import React from "react";
import { DownOutlined, DownloadOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Button, Space, Typography, Tooltip } from "antd";
import * as XLSX from "xlsx";

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
    <Tooltip title="Экспорт данных">
      <Dropdown menu={{ items }} trigger={['click']}>
        <Button icon={<DownloadOutlined />} type="default">
          <Space>
            Экспорт <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Tooltip>
  );
};

export default DropDownDownload;
