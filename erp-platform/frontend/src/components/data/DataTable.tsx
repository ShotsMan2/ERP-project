import { useState, useMemo, ReactNode } from 'react';
import { Table, Input, Button, Space, Dropdown, Checkbox, Tag } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  SearchOutlined,
  DownloadOutlined,
  SettingOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { SorterResult } from 'antd/es/table/interface';

interface DataTableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  rowKey?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  exportable?: boolean;
  onExport?: () => void;
  onRefresh?: () => void;
  selectable?: boolean;
  onBulkAction?: (keys: React.Key[], action: string) => void;
  bulkActions?: { key: string; label: string; danger?: boolean }[];
  pagination?: TablePaginationConfig | false;
  onChange?: (pagination: TablePaginationConfig, filters: any, sorter: SorterResult<T> | SorterResult<T>[]) => void;
  toolbarExtra?: ReactNode;
  title?: string;
}

export function DataTable<T extends object>({
  columns,
  dataSource,
  loading,
  rowKey = 'id',
  searchable = true,
  searchPlaceholder = 'Search...',
  onSearch,
  exportable = true,
  onExport,
  onRefresh,
  selectable = false,
  onBulkAction,
  bulkActions,
  pagination,
  onChange,
  toolbarExtra,
}: DataTableProps<T>) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => (col as any).dataIndex || (col as any).key)
  );

  const filteredColumns = useMemo(
    () => columns.filter((col) => visibleColumns.includes((col as any).dataIndex || (col as any).key)),
    [columns, visibleColumns]
  );

  const columnToggleItems = {
    items: columns.map((col) => {
      const key = (col as any).dataIndex || (col as any).key;
      return {
        key,
        label: (
          <Checkbox
            checked={visibleColumns.includes(key)}
            onChange={(e) => {
              if (e.target.checked) {
                setVisibleColumns([...visibleColumns, key]);
              } else {
                setVisibleColumns(visibleColumns.filter((k) => k !== key));
              }
            }}
          >
            {(col as any).title as string}
          </Checkbox>
        ),
      };
    }),
  };

  const rowSelection = selectable
    ? {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
      }
    : undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Space>
          {searchable && (
            <Input.Search
              placeholder={searchPlaceholder}
              prefix={<SearchOutlined />}
              allowClear
              onSearch={onSearch}
              className="w-64"
            />
          )}
          {toolbarExtra}
        </Space>
        <Space>
          {selectedRowKeys.length > 0 && bulkActions && (
            <Dropdown
              menu={{
                items: bulkActions.map((action) => ({
                  key: action.key,
                  label: action.label,
                  danger: action.danger,
                  onClick: () => onBulkAction?.(selectedRowKeys, action.key),
                })),
              }}
            >
              <Button>
                Bulk Actions ({selectedRowKeys.length})
              </Button>
            </Dropdown>
          )}
          {onRefresh && <Button icon={<ReloadOutlined />} onClick={onRefresh} />}
          <Dropdown menu={columnToggleItems} trigger={['click']}>
            <Button icon={<SettingOutlined />}>Columns</Button>
          </Dropdown>
          {exportable && (
            <Button icon={<DownloadOutlined />} onClick={onExport}>
              Export
            </Button>
          )}
        </Space>
      </div>
      <Table
        columns={filteredColumns}
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey}
        rowSelection={rowSelection}
        pagination={
          pagination === false
            ? false
            : {
                pageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
                ...pagination,
              }
        }
        onChange={onChange}
        scroll={{ x: 'max-content' }}
        size="middle"
        className="shadow-sm"
      />
    </div>
  );
}

export default DataTable;
