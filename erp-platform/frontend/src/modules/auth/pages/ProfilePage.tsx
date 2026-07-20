import { useState } from 'react';
import {
  Card, Typography, Tabs, Form, Input, Button, Avatar, Upload, Row, Col,
  Descriptions, message, Switch, Space, Divider, Modal, InputNumber, Select, Tag,
} from 'antd';
import {
  UserOutlined, LockOutlined, SettingOutlined, UploadOutlined,
  KeyOutlined, SafetyOutlined, BellOutlined, GlobalOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import PageHeader from '@/components/ui/PageHeader';

const { Title, Text } = Typography;

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  timezone: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || '');
  const [mfaModalOpen, setMfaModalOpen] = useState(false);

  const handleProfileSave = async (values: ProfileFormData) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      message.success('Profile updated successfully');
    } catch {
      message.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (values: PasswordFormData) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch {
      message.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (info: { file: UploadFile }) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response?.url || URL.createObjectURL(info.file.originFileObj as Blob));
      message.success('Avatar updated');
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="My Profile"
        subtitle="Manage your account settings and preferences"
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6}>
          <Card>
            <div className="text-center">
              <Avatar
                size={120}
                src={avatarUrl}
                icon={<UserOutlined />}
                className="mb-4"
              />
              <Upload
                showUploadList={false}
                onChange={handleAvatarChange}
                action="/api/v1/upload/avatar"
              >
                <Button icon={<UploadOutlined />}>Change Photo</Button>
              </Upload>
              <Divider />
              <Title level={5}>{user ? `${user.name} ${user.surname}` : 'User'}</Title>
              <Text type="secondary">{user?.email}</Text>
              <div className="mt-2">
                <Text type="secondary" className="text-sm">{user?.roles?.[0] || 'Employee'}</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={18}>
          <Card>
            <Tabs
              defaultActiveKey="profile"
              items={[
                {
                  key: 'profile',
                  label: <span><UserOutlined /> Profile</span>,
                  children: (
                    <Form<ProfileFormData>
                      form={profileForm}
                      layout="vertical"
                      initialValues={{
                        firstName: user?.name || '',
                        lastName: user?.surname || '',
                        email: user?.email || '',
                        phone: '',
                        language: 'en',
                        timezone: 'UTC',
                      }}
                      onFinish={handleProfileSave}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                            <Input disabled />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Phone" name="phone">
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Language" name="language">
                            <Select>
                              <Select.Option value="en">English</Select.Option>
                              <Select.Option value="tr">Türkçe</Select.Option>
                              <Select.Option value="de">Deutsch</Select.Option>
                              <Select.Option value="fr">Français</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Timezone" name="timezone">
                            <Select>
                              <Select.Option value="UTC">UTC</Select.Option>
                              <Select.Option value="US/Eastern">US/Eastern</Select.Option>
                              <Select.Option value="Europe/Istanbul">Europe/Istanbul</Select.Option>
                              <Select.Option value="Europe/London">Europe/London</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Button type="primary" htmlType="submit" loading={saving}>
                        Save Changes
                      </Button>
                    </Form>
                  ),
                },
                {
                  key: 'security',
                  label: <span><SafetyOutlined /> Security</span>,
                  children: (
                    <div>
                      <Title level={5}>Change Password</Title>
                      <Form<PasswordFormData>
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handlePasswordChange}
                        style={{ maxWidth: 480 }}
                      >
                        <Form.Item
                          label="Current Password"
                          name="currentPassword"
                          rules={[{ required: true, message: 'Please enter your current password' }]}
                        >
                          <Input.Password />
                        </Form.Item>
                        <Form.Item
                          label="New Password"
                          name="newPassword"
                          rules={[
                            { required: true, message: 'Please enter a new password' },
                            { min: 8, message: 'Minimum 8 characters' },
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                        <Form.Item
                          label="Confirm New Password"
                          name="confirmPassword"
                          dependencies={['newPassword']}
                          rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                                return Promise.reject(new Error('Passwords do not match'));
                              },
                            }),
                          ]}
                        >
                          <Input.Password />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={saving}>
                          Update Password
                        </Button>
                      </Form>

                      <Divider />
                      <Title level={5}>Multi-Factor Authentication</Title>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Status">
                          <Tag color={'default'}>
                            {'Disabled'}
                          </Tag>
                        </Descriptions.Item>
                      </Descriptions>
                      <Button
                        icon={<KeyOutlined />}
                        className="mt-2"
                        onClick={() => setMfaModalOpen(true)}
                      >
                        {'Set Up MFA'}
                      </Button>
                    </div>
                  ),
                },
                {
                  key: 'preferences',
                  label: <span><SettingOutlined /> Preferences</span>,
                  children: (
                    <div>
                      <Title level={5}>Notifications</Title>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Text>Email Notifications</Text>
                            <br />
                            <Text type="secondary" className="text-sm">Receive notifications via email</Text>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Text>Push Notifications</Text>
                            <br />
                            <Text type="secondary" className="text-sm">Receive notifications in browser</Text>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Text>SMS Notifications</Text>
                            <br />
                            <Text type="secondary" className="text-sm">Receive notifications via SMS</Text>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <Divider />
                      <Title level={5}>Display</Title>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Text>Compact Mode</Text>
                            <br />
                            <Text type="secondary" className="text-sm">Use compact layout</Text>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Text>Dark Mode</Text>
                            <br />
                            <Text type="secondary" className="text-sm">Use dark color theme</Text>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <Divider />
                      <Title level={5}>Regional</Title>
                      <div className="space-y-4 max-w-md">
                        <div className="flex items-center justify-between">
                          <Text>Date Format</Text>
                          <Select defaultValue="MM/DD/YYYY" style={{ width: 160 }}>
                            <Select.Option value="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
                            <Select.Option value="DD/MM/YYYY">DD/MM/YYYY</Select.Option>
                            <Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <Text>Time Format</Text>
                          <Select defaultValue="12h" style={{ width: 160 }}>
                            <Select.Option value="12h">12-hour</Select.Option>
                            <Select.Option value="24h">24-hour</Select.Option>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <Text>First Day of Week</Text>
                          <Select defaultValue="monday" style={{ width: 160 }}>
                            <Select.Option value="monday">Monday</Select.Option>
                            <Select.Option value="sunday">Sunday</Select.Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Set Up Multi-Factor Authentication"
        open={mfaModalOpen}
        onCancel={() => setMfaModalOpen(false)}
        footer={null}
      >
        <div className="text-center py-4">
          <SafetyOutlined className="text-5xl text-blue-600 mb-4" />
          <Title level={5}>Scan this QR code with your authenticator app</Title>
          <div className="bg-gray-100 w-48 h-48 mx-auto mb-4 flex items-center justify-center rounded-lg">
            <Text type="secondary">QR Code Placeholder</Text>
          </div>
          <Text type="secondary">Or enter this key manually:</Text>
          <Input.TextArea
            readOnly
            value="JBSWY3DPEHPK3PXP"
            className="text-center font-mono mt-2"
            rows={2}
          />
          <div className="mt-4">
            <Button type="primary" onClick={() => { message.success('MFA enabled'); setMfaModalOpen(false); }}>
              Confirm Setup
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
