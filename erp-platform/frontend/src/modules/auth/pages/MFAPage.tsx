import { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { Card, Typography, Button, message, Space, Alert, Input } from 'antd';
import { SafetyOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const { Title, Text } = Typography;

const MFAPage: React.FC = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [showBackup, setShowBackup] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { loginMfa } = useAuth();

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '');
    if (!digit) return;

    const newCode = [...code];
    newCode[index] = digit.slice(-1);
    setCode(newCode);

    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = data.split('').concat(Array(6 - data.length).fill(''));
    setCode(newCode);
    const nextIndex = Math.min(data.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const token = code.join('');
    if (token.length !== 6) {
      message.error('Please enter the complete 6-digit code');
      return;
    }
    setLoading(true);
    try {
      await loginMfa(token, '');
      message.success('Verification successful');
      navigate('/');
    } catch {
      message.error('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleBackupVerify = async () => {
    if (!backupCode.trim()) {
      message.error('Please enter a backup code');
      return;
    }
    setLoading(true);
    try {
      await loginMfa(backupCode.trim(), 'backup');
      message.success('Backup code accepted');
      navigate('/');
    } catch {
      message.error('Invalid backup code');
    } finally {
      setLoading(false);
    }
  };

  if (showBackup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl rounded-xl">
          <div className="text-center mb-6">
            <KeyOutlined className="text-4xl text-blue-600 mb-2" />
            <Title level={4}>Backup Code</Title>
            <Text type="secondary">Enter one of your recovery codes</Text>
          </div>
          <Input
            size="large"
            placeholder="XXXXX-XXXXX"
            value={backupCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBackupCode(e.target.value)}
            onPressEnter={handleBackupVerify}
            className="text-center font-mono text-lg mb-4"
          />
          <Button type="primary" block size="large" loading={loading} onClick={handleBackupVerify}>
            Verify Backup Code
          </Button>
          <Button type="link" block className="mt-2" onClick={() => setShowBackup(false)}>
            Back to TOTP
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <div className="text-center mb-6">
          <SafetyOutlined className="text-4xl text-blue-600 mb-2" />
          <Title level={4}>Two-Factor Authentication</Title>
          <Text type="secondary">Enter the 6-digit code from your authenticator app</Text>
        </div>

        <Alert
          message="For security reasons, this code expires in 30 seconds"
          type="info"
          showIcon
          className="mb-6"
        />

        <div className="flex justify-center gap-3 mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          ))}
        </div>

        <Space direction="vertical" className="w-full" size="middle">
          <Button type="primary" block size="large" loading={loading} onClick={handleVerify}>
            Verify
          </Button>
          <Button type="link" block onClick={() => setShowBackup(true)}>
            Use a backup code
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default MFAPage;
