import { Tabs, Card, Table, Tag, Button } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export default function TemplatesPage() {
  const { t } = useTranslation();

  const emailData = [
    { key: '1', name: 'Welcome Email', code: 'welcome_email', subject: 'Welcome to ERP Platform', status: 'active' },
    { key: '2', name: 'Leave Approved', code: 'leave_approved', subject: 'Your leave has been approved', status: 'active' },
    { key: '3', name: 'Password Reset', code: 'password_reset', subject: 'Password reset instructions', status: 'active' },
  ];

  const smsData = [
    { key: '1', name: 'OTP Verification', code: 'otp_verify', body: 'Your OTP code is: {code}', status: 'active' },
    { key: '2', name: 'Payment Confirmation', code: 'payment_confirm', body: 'Payment of {amount} confirmed', status: 'active' },
  ];

  const columns = [
    { title: t('settings.templates.name'), dataIndex: 'name', key: 'name' },
    { title: t('settings.templates.code'), dataIndex: 'code', key: 'code' },
    { title: t('settings.templates.subjectBody'), dataIndex: 'subject', key: 'subject', render: (v: string) => v || 'SMS template' },
    { title: t('settings.templates.status'), dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
  ];

  return (
    <div>
      <PageHeader title={t('settings.templates.title')} subtitle={t('settings.templates.subtitle')} onAdd={() => {}} addLabel={t('settings.templates.newTemplate')} />
      <Card>
        <Tabs items={[
          { key: 'email', label: t('settings.templates.emailTemplates'), children: <div><div className="mb-4"><Button type="primary">{t('settings.templates.addEmailTemplate')}</Button></div><Table columns={columns} dataSource={emailData} /></div> },
          { key: 'sms', label: t('settings.templates.smsTemplates'), children: <div><div className="mb-4"><Button type="primary">{t('settings.templates.addSmsTemplate')}</Button></div><Table columns={columns} dataSource={smsData} /></div> },
        ]} />
      </Card>
    </div>
  );
}
