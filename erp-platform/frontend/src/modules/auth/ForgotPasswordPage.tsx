import { Button, Form, Input, Result } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const { t } = useTranslation();

  const onFinish = () => {
    setSent(true);
  };

  if (sent) {
    return (
      <Result
        status="success"
        title={t('auth.forgotPasswordPage.resetLinkSent')}
        subTitle={t('auth.forgotPasswordPage.checkEmail')}
        extra={
          <Button type="primary" onClick={() => navigate('/auth')}>
            {t('auth.forgotPasswordPage.backToLogin')}
          </Button>
        }
      />
    );
  }

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <p className="text-gray-500 text-sm mb-4">{t('auth.forgotPasswordPage.description')}</p>
      <Form.Item name="email" rules={[{ required: true, type: 'email', message: t('validation.email') }]}>
        <Input prefix={<MailOutlined />} placeholder={t('auth.emailAddress')} size="large" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">{t('auth.forgotPasswordPage.sendResetLink')}</Button>
      </Form.Item>
      <div className="text-center">
        <Link to="/auth" className="text-sm">{t('auth.forgotPasswordPage.backToLogin')}</Link>
      </div>
    </Form>
  );
}
