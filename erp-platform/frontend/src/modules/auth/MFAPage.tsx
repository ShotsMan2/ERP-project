import { Button, Form, Input, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

export default function MFAPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginMfa } = useAuth();
  const { t } = useTranslation();
  const token = (location.state as { token?: string })?.token;

  const onFinish = async (values: { code: string }) => {
    try {
      await loginMfa(values.code, token || '');
      navigate('/');
    } catch {
      // Error handled by interceptor
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <div className="text-center mb-4">
        <Title level={5}>{t('auth.mfaPage.title')}</Title>
        <Text type="secondary">{t('auth.mfaPage.description')}</Text>
      </div>
      <Form.Item name="code" rules={[{ required: true, len: 6, message: t('auth.mfaPage.enterCompleteCode') }]}>
        <Input.OTP length={6} size="large" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">{t('auth.mfaPage.verify')}</Button>
      </Form.Item>
    </Form>
  );
}
