import { Layout, Space } from 'antd';
import { CopyrightOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;

export default function Footer() {
  return (
    <AntFooter className="flex items-center justify-between px-6 bg-white border-t border-gray-200">
      <Space>
        <CopyrightOutlined />
        <span>{new Date().getFullYear()} ERP Platform. All rights reserved.</span>
      </Space>
      <Space>
        <span className="text-gray-400 text-sm">v1.0.0</span>
        <span className="text-gray-300">|</span>
        <a href="/support" className="text-gray-500 hover:text-primary-500 text-sm flex items-center gap-1">
          <QuestionCircleOutlined />
          Support
        </a>
      </Space>
    </AntFooter>
  );
}
