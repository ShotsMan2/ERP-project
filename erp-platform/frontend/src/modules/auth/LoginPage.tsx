import { Button, Form, Input, Checkbox, Divider } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, MicrosoftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/auth.css'; // Will create/update custom CSS if needed

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
    <div className="auth-form-container">
      <Form layout="vertical" onFinish={onFinish} autoComplete="off" requiredMark={false}>
        <Form.Item 
          name="email" 
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input 
            prefix={<MailOutlined className="text-slate-400" />} 
            placeholder="Email Address" 
            size="large" 
            className="bg-white/5 border-white/10 text-white placeholder-slate-400 hover:bg-white/10 focus:bg-white/10 focus:border-indigo-500 rounded-xl transition-all h-12"
          />
        </Form.Item>

        <Form.Item 
          name="password" 
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password 
            prefix={<LockOutlined className="text-slate-400" />} 
            placeholder="Password" 
            size="large" 
            className="bg-white/5 border-white/10 text-white placeholder-slate-400 hover:bg-white/10 focus:bg-white/10 focus:border-indigo-500 rounded-xl transition-all h-12 custom-password-input"
          />
        </Form.Item>

        <Form.Item className="mb-6">
          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-slate-300 hover:text-white transition-colors">
                <span className="text-sm font-medium">Remember me</span>
              </Checkbox>
            </Form.Item>
            <Link to="/auth/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot Password?
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
            Sign In to Console
          </Button>
        </Form.Item>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-medium uppercase tracking-widest">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <Button 
            icon={<GoogleOutlined />} 
            size="large" 
            className="h-11 rounded-xl bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all font-medium"
          >
            Google
          </Button>
          <Button 
            icon={<MicrosoftOutlined />} 
            size="large" 
            className="h-11 rounded-xl bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all font-medium"
          >
            Microsoft
          </Button>
        </div>
      </Form>
    </div>
  );
}
