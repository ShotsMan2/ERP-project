import { useState } from 'react';
import { Layout, Input, Badge, Dropdown, Avatar, Space, Button, Select } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useUIStore } from '@/store/uiStore';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export default function Header({ collapsed, onCollapse }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const { theme, language, setLanguage } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const userMenuItems = [
    { key: 'profile', icon: <ProfileOutlined />, label: 'My Profile' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Account Settings' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
  ];

  const handleUserMenu = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/auth');
    } else if (key === 'profile') {
      navigate('/settings/company');
    }
  };

  return (
    <AntHeader className="flex items-center justify-between px-6 bg-white dark:bg-slate-800 shadow-sm dark:border-b dark:border-slate-700 h-16">
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
        />
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search... (Cmd+K)"
          className="w-64 hidden md:inline-flex"
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setSearchOpen(false)}
        />
      </Space>
      <Space size="middle">
        <Select
          value={language}
          onChange={setLanguage}
          size="small"
          className="w-20"
          options={[
            { value: 'en', label: 'EN' },
            { value: 'tr', label: 'TR' },
            { value: 'de', label: 'DE' },
          ]}
        />
        <Button
          type="text"
          icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
        />
        <Badge count={5} size="small">
          <Button type="text" icon={<BellOutlined />} />
        </Badge>
        <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenu }} placement="bottomRight">
          <Space className="cursor-pointer">
            <Avatar icon={<UserOutlined />} src={user?.avatar} />
            <span className="hidden md:inline">{user?.name} {user?.surname}</span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
