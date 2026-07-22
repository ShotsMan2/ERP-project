import { Button, Form, Input, Checkbox, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, WindowsOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import '@/styles/auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { email: string; password: string; remember: boolean }) => {
    try {
      await login(values.email, values.password);
      messageApi.success(t('auth.success'));
      navigate('/app');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg === 'MFA_REQUIRED') {
        navigate('/auth/mfa');
      } else if (errorMsg.includes('401') || errorMsg.includes('Invalid')) {
        messageApi.error(t('auth.invalidCredentials'));
      } else {
        messageApi.error(errorMsg || t('auth.invalidCredentials'));
      }
    }
  };

  return (
    <div className="auth-form-container">
      {contextHolder}
      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item 
          name="email" 
          rules={[{ required: true, message: t('auth.enterEmail') }, { type: 'email', message: t('validation.email') }]}
        >
          <Input 
            prefix={<MailOutlined className="text-slate-400" />} 
            placeholder={t('auth.emailAddress')} 
            size="large"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item 
          name="password" 
          rules={[{ required: true, message: t('auth.enterPassword') }]}
        >
          <Input.Password 
            prefix={<LockOutlined className="text-slate-400" />} 
            placeholder={t('auth.password')} 
            size="large"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item className="mb-6">
          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-slate-300 hover:text-white transition-colors">
                <span className="text-sm font-medium">{t('auth.rememberMe')}</span>
              </Checkbox>
            </Form.Item>
            <Link to="/auth/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              {t('auth.forgotPassword')}
            </Link>
          </div>
        </Form.Item>

        <Form.Item className="mb-4">
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large"
            className="h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 border-0 font-semibold text-base shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
          >
            {t('auth.signInToConsole')}
          </Button>
        </Form.Item>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-medium uppercase tracking-widest">{t('auth.orContinueWith')}</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <Button 
            icon={<GoogleOutlined />} 
            size="large" 
            className="h-11 rounded-xl bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all font-medium"
          >
            {t('auth.google')}
          </Button>
          <Button 
            icon={<WindowsOutlined />} 
            size="large" 
            className="h-11 rounded-xl bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all font-medium"
          >
            {t('auth.microsoft')}
          </Button>
        </div>
      </Form>
    </div>
  );
}
