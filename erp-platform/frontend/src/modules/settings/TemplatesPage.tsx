import { Tabs, Card, Table, Tag, Button } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

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
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Subject/Body', dataIndex: 'subject', key: 'subject', render: (v: string) => v || 'SMS template' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
];

export default function TemplatesPage() {
  return (
    <div>
      <PageHeader title="Templates" subtitle="Manage email and SMS templates" onAdd={() => {}} addLabel="New Template" />
      <Card>
        <Tabs items={[
          { key: 'email', label: 'Email Templates', children: <div><div className="mb-4"><Button type="primary">Add Email Template</Button></div><Table columns={columns} dataSource={emailData} /></div> },
          { key: 'sms', label: 'SMS Templates', children: <div><div className="mb-4"><Button type="primary">Add SMS Template</Button></div><Table columns={columns} dataSource={smsData} /></div> },
        ]} />
      </Card>
    </div>
  );
}
