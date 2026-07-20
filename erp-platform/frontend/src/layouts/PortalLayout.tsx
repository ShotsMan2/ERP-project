import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Button, Space } from 'antd';
import { LogoutOutlined, HomeOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

export default function PortalLayout() {
  const navigate = useNavigate();

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between px-6 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="ERP Platform" className="h-8" />
          <span className="text-lg font-semibold">Customer Portal</span>
        </div>
        <Space>
          <Button icon={<HomeOutlined />} onClick={() => navigate('/portal')}>
            Dashboard
          </Button>
          <Button icon={<LogoutOutlined />} type="text">
            Logout
          </Button>
        </Space>
      </Header>
      <Content className="p-6 bg-gray-50">
        <Outlet />
      </Content>
      <Footer className="text-center text-gray-400 text-sm">
        ERP Platform Portal ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}
