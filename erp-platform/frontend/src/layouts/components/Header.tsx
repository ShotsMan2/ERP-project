import { useState } from 'react';
import { Layout, Input, Dropdown, Avatar, Space, Button, Select } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
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
import { useTranslation } from 'react-i18next';
import NotificationDropdown from './NotificationDropdown';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  className?: string;
}

export default function Header({ collapsed, onCollapse, className = '' }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const { theme, language, setLanguage } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();

  const userMenuItems = [
    { key: 'profile', icon: <ProfileOutlined />, label: t('nav.myProfile') },
    { key: 'settings', icon: <SettingOutlined />, label: t('nav.accountSettings') },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: t('auth.logout'), danger: true },
  ];

  const handleUserMenu = async ({ key }: { key: string }) => {
    if (key === 'logout') {
      try {
        await logout();
      } finally {
        navigate('/auth');
      }
    } else if (key === 'profile') {
      navigate('/settings/company');
    }
  };

  return (
    <AntHeader className={`flex items-center justify-between px-6 shadow-sm h-16 !bg-transparent border-b border-gray-200/50 dark:border-slate-700/50 ${className}`}>
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
        />
        <Input
          prefix={<SearchOutlined />}
          placeholder={`${t('common.search')}... (${t('common.cmdK')})`}
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
        <NotificationDropdown />
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
