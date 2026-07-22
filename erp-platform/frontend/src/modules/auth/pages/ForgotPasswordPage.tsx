import { useState } from 'react';
import { Card, Typography, Form, Input, Button, Result, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmail(values.email);
      setSubmitted(true);
      message.success(t('auth.forgotPasswordPage.resetLinkSentMessage'));
    } catch {
      message.error(t('auth.forgotPasswordPage.sendFailed'));
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
            title={t('auth.forgotPasswordPage.checkEmailTitle')}
            subTitle={
              <span>
                {t('auth.forgotPasswordPage.sentTo')} <strong>{email}</strong>.
                {t('auth.forgotPasswordPage.checkInbox')}
              </span>
            }
            extra={[
              <Link to="/login" key="login">
                <Button type="primary" size="large">{t('auth.forgotPasswordPage.backToLogin')}</Button>
              </Link>,
              <Button
                key="resend"
                type="link"
                onClick={() => setSubmitted(false)}
              >
                {t('auth.forgotPasswordPage.resendEmail')}
              </Button>,
            ]}
          />
          <div className="text-center mt-4">
            <Text type="secondary" className="text-sm">
              {t('auth.forgotPasswordPage.noEmailHint')}{' '}
              <Link to="/contact-support" className="text-blue-600">{t('auth.forgotPasswordPage.contactSupport')}</Link>
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
          <Title level={3}>{t('auth.forgotPassword')}</Title>
          <Text type="secondary">
            {t('auth.forgotPasswordPage.noWorries')}
          </Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
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

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="h-11">
              {t('auth.forgotPasswordPage.sendResetLink')}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            {t('auth.forgotPasswordPage.backToLogin')}
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
