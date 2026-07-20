import { Button, Form, Input, Checkbox, Divider } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: { email: string; password: string; remember: boolean }) => {
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch {
      // Error handled by interceptor
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
        <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
      </Form.Item>
      <Form.Item>
        <div className="flex items-center justify-between">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Link to="/auth/forgot-password" className="text-sm">Forgot Password?</Link>
        </div>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">Sign In</Button>
      </Form.Item>
      <Divider>or</Divider>
      <Button block size="large">Sign In with SSO</Button>
    </Form>
  );
}
