import { Button, Form, Input, Result } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);

  const onFinish = () => {
    setSent(true);
  };

  if (sent) {
    return (
      <Result
        status="success"
        title="Reset Link Sent"
        subTitle="Check your email for the password reset link."
        extra={
          <Button type="primary" onClick={() => navigate('/auth')}>
            Back to Login
          </Button>
        }
      />
    );
  }

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <p className="text-gray-500 text-sm mb-4">Enter your email address and we'll send you a link to reset your password.</p>
      <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
        <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">Send Reset Link</Button>
      </Form.Item>
      <div className="text-center">
        <Link to="/auth" className="text-sm">Back to Login</Link>
      </div>
    </Form>
  );
}
