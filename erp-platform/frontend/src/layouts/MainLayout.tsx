import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Breadcrumbs from './components/Breadcrumbs';
import Footer from './components/Footer';

const { Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen premium-gradient-bg">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} className="glass-panel" />
      <Layout className="bg-transparent">
        <Header collapsed={collapsed} onCollapse={setCollapsed} className="glass-panel sticky top-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60" />
        <Content className="mx-6 my-4 transition-all duration-300">
          <Breadcrumbs />
          <div className="mt-4 glass-panel p-6 rounded-2xl min-h-[calc(100vh-180px)]">
            <Outlet />
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
