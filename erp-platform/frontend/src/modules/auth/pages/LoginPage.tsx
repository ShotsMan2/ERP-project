import { useState } from 'react';
import { Form, Input, Button, Checkbox, Divider, Typography, Space, Card, message } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
  LinkedinOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success(t('auth.success'));
      navigate('/');
    } catch {
      message.error(t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">E</span>
            </div>
          </div>
          <Title level={3} className="mb-1">{t('auth.welcomeBack', { name: '' })}</Title>
          <Text type="secondary">{t('auth.signInSubtitle')}</Text>
        </div>

        <Form<LoginFormData>
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ remember: true }}
          size="large"
        >
          <Form.Item
            name="email"
            label={t('auth.emailAddress')}
            rules={[
              { required: true, message: t('auth.enterEmail') },
              { type: 'email', message: t('validation.email') },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="you@company.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('auth.password')}
            rules={[{ required: true, message: t('auth.enterPassword') }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('auth.enterPasswordPlaceholder')}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <div className="flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>{t('auth.rememberMe')}</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="h-11">
              {t('auth.signIn')}
            </Button>
          </Form.Item>
        </Form>

        <Divider plain><Text type="secondary" className="text-sm">{t('auth.orContinueWith')}</Text></Divider>

        <Space direction="vertical" className="w-full" size="small">
          <Button icon={<GoogleOutlined />} block className="h-10" onClick={() => message.info(t('auth.ssoNotConfigured'))}>
            {t('auth.signInWithGoogle')}
          </Button>
          <Button icon={<GithubOutlined />} block className="h-10" onClick={() => message.info(t('auth.ssoNotConfigured'))}>
            {t('auth.signInWithGitHub')}
          </Button>
          <Button icon={<LinkedinOutlined />} block className="h-10" onClick={() => message.info(t('auth.ssoNotConfigured'))}>
            {t('auth.signInWithLinkedIn')}
          </Button>
        </Space>

        <div className="text-center mt-6">
          <Text type="secondary">
            {t('auth.noAccount')}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
