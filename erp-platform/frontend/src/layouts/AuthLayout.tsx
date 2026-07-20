import { Outlet } from 'react-router-dom';
import { Layout, Card } from 'antd';

export default function AuthLayout() {
  return (
    <Layout className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <div className="mb-8 text-center">
          <img src="/logo.svg" alt="ERP Platform" className="h-10 mx-auto mb-2" />
          <h1 className="text-xl font-semibold text-gray-800">ERP Platform</h1>
        </div>
        <Outlet />
      </Card>
    </Layout>
  );
}
