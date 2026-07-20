import { useState } from 'react';
import { Card, Typography, Form, Input, Button, Result, Progress, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;

interface ResetFormData {
  newPassword: string;
  confirmPassword: string;
}

const getPasswordStrength = (password: string): { percent: number; status: 'exception' | 'active' | 'success'; text: string } => {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  if (password.length > 0 && score < 40) return { percent: score, status: 'exception', text: 'Weak' };
  if (score < 70) return { percent: score, status: 'active', text: 'Medium' };
  return { percent: Math.min(score, 100), status: 'success', text: 'Strong' };
};

const ResetPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const onFinish = async (values: ResetFormData) => {
    if (!token) {
      message.error('Invalid or expired reset link');
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      message.success('Password has been reset successfully');
    } catch {
      message.error('Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl rounded-xl">
          <Result
            status="warning"
            title="Invalid Reset Link"
            subTitle="This password reset link is invalid or has expired. Please request a new one."
            extra={
              <Button type="primary" onClick={() => navigate('/forgot-password')}>
                Request New Link
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl rounded-xl">
          <Result
            status="success"
            title="Password Reset Complete!"
            subTitle="Your password has been successfully reset. You can now log in with your new password."
            extra={
              <Button type="primary" size="large" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <div className="text-center mb-6">
          <LockOutlined className="text-4xl text-blue-600 mb-2" />
          <Title level={4}>Reset Your Password</Title>
          <Text type="secondary">Enter your new password below</Text>
        </div>

        <Form<ResetFormData> layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          {password && (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <Text type="secondary" className="text-xs">Password strength</Text>
                <Text type="secondary" className="text-xs">{strength.text}</Text>
              </div>
              <Progress percent={strength.percent} status={strength.status} size="small" showInfo={false} />
            </div>
          )}

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="h-11">
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
