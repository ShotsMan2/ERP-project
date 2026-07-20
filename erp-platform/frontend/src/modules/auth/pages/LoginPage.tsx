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

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful');
      navigate('/');
    } catch {
      message.error('Invalid email or password');
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
          <Title level={3} className="mb-1">Welcome Back</Title>
          <Text type="secondary">Sign in to your ERP account</Text>
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
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="you@company.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <div className="flex items-center justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="h-11">
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider plain><Text type="secondary" className="text-sm">Or continue with</Text></Divider>

        <Space direction="vertical" className="w-full" size="small">
          <Button icon={<GoogleOutlined />} block className="h-10" onClick={() => message.info('SSO not configured')}>
            Sign in with Google
          </Button>
          <Button icon={<GithubOutlined />} block className="h-10" onClick={() => message.info('SSO not configured')}>
            Sign in with GitHub
          </Button>
          <Button icon={<LinkedinOutlined />} block className="h-10" onClick={() => message.info('SSO not configured')}>
            Sign in with LinkedIn
          </Button>
        </Space>

        <div className="text-center mt-6">
          <Text type="secondary">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-600">Contact your administrator</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
