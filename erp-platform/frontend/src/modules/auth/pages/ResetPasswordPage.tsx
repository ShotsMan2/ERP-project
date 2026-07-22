import { useState } from 'react';
import { Card, Typography, Form, Input, Button, Result, Progress, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface ResetFormData {
  newPassword: string;
  confirmPassword: string;
}

const getPasswordStrength = (password: string, t: (key: string) => string): { percent: number; status: 'exception' | 'active' | 'success'; text: string } => {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[a-z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  if (password.length > 0 && score < 40) return { percent: score, status: 'exception', text: t('auth.resetPasswordPage.weak') };
  if (score < 70) return { percent: score, status: 'active', text: t('auth.resetPasswordPage.medium') };
  return { percent: Math.min(score, 100), status: 'success', text: t('auth.resetPasswordPage.strong') };
};

const ResetPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const token = searchParams.get('token');

  const onFinish = async (values: ResetFormData) => {
    if (!token) {
      message.error(t('auth.resetPasswordPage.invalidLink'));
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      message.success(t('auth.resetPasswordPage.resetSuccess'));
    } catch {
      message.error(t('auth.resetPasswordPage.resetFailed'));
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
            title={t('auth.resetPasswordPage.invalidResetLink')}
            subTitle={t('auth.resetPasswordPage.invalidResetLinkDescription')}
            extra={
              <Button type="primary" onClick={() => navigate('/forgot-password')}>
                {t('auth.resetPasswordPage.requestNewLink')}
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
            title={t('auth.resetPasswordPage.resetComplete')}
            subTitle={t('auth.resetPasswordPage.resetCompleteDescription')}
            extra={
              <Button type="primary" size="large" onClick={() => navigate('/login')}>
                {t('auth.resetPasswordPage.goToLogin')}
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const strength = getPasswordStrength(password, t);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <div className="text-center mb-6">
          <LockOutlined className="text-4xl text-blue-600 mb-2" />
          <Title level={4}>{t('auth.resetPasswordPage.title')}</Title>
          <Text type="secondary">{t('auth.resetPasswordPage.enterNewPassword')}</Text>
        </div>

        <Form<ResetFormData> layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="newPassword"
            label={t('auth.resetPasswordPage.newPassword')}
            rules={[
              { required: true, message: t('auth.resetPasswordPage.enterPassword') },
              { min: 8, message: t('auth.resetPasswordPage.passwordMinLength') },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('auth.resetPasswordPage.enterNewPasswordPlaceholder')}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          {password && (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <Text type="secondary" className="text-xs">{t('auth.resetPasswordPage.passwordStrength')}</Text>
                <Text type="secondary" className="text-xs">{strength.text}</Text>
              </div>
              <Progress percent={strength.percent} status={strength.status} size="small" showInfo={false} />
            </div>
          )}

          <Form.Item
            name="confirmPassword"
            label={t('auth.resetPasswordPage.confirmPassword')}
            dependencies={['newPassword']}
            rules={[
              { required: true, message: t('auth.resetPasswordPage.confirmPasswordValidation') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('auth.resetPasswordPage.passwordsDoNotMatch')));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('auth.resetPasswordPage.confirmNewPasswordPlaceholder')} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block className="h-11">
              {t('auth.resetPasswordPage.resetPassword')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
