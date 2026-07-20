import { useState } from 'react';
import { Card, Typography, Form, Input, Button, Result, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmail(values.email);
      setSubmitted(true);
      message.success('Reset link sent to your email');
    } catch {
      message.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl rounded-xl">
          <Result
            status="success"
            title="Check Your Email"
            subTitle={
              <span>
                We&apos;ve sent a password reset link to <strong>{email}</strong>.
                Please check your inbox and follow the instructions.
              </span>
            }
            extra={[
              <Link to="/login" key="login">
                <Button type="primary" size="large">Back to Login</Button>
              </Link>,
              <Button
                key="resend"
                type="link"
                onClick={() => setSubmitted(false)}
              >
                Resend email
              </Button>,
            ]}
          />
          <div className="text-center mt-4">
            <Text type="secondary" className="text-sm">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <Link to="/contact-support" className="text-blue-600">contact support</Link>
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">E</span>
            </div>
          </div>
          <Title level={3}>Forgot Password?</Title>
          <Text type="secondary">
            No worries! Enter your email and we&apos;ll send you a reset link.
          </Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
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

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="h-11">
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
