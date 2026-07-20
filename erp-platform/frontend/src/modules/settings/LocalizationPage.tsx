import { Card, Form, Select, Button, Typography } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';

const { Text } = Typography;

export default function LocalizationPage() {
  return (
    <div>
      <PageHeader title="Localization" subtitle="Configure language and regional settings" />
      <Card>
        <Form layout="vertical" className="max-w-md">
          <Form.Item label="Default Language">
            <Select defaultValue="en" options={[
              { value: 'en', label: 'English' },
              { value: 'tr', label: 'Türkçe' },
              { value: 'de', label: 'Deutsch' },
              { value: 'fr', label: 'Français' },
            ]} />
          </Form.Item>
          <Form.Item label="Date Format">
            <Select defaultValue="YYYY-MM-DD" options={[
              { value: 'YYYY-MM-DD', label: '2026-07-20' },
              { value: 'DD/MM/YYYY', label: '20/07/2026' },
              { value: 'MM/DD/YYYY', label: '07/20/2026' },
            ]} />
          </Form.Item>
          <Form.Item label="Time Format">
            <Select defaultValue="24h" options={[
              { value: '24h', label: '14:30 (24h)' },
              { value: '12h', label: '2:30 PM (12h)' },
            ]} />
          </Form.Item>
          <Form.Item label="Timezone">
            <Select defaultValue="America/New_York" options={[
              { value: 'America/New_York', label: 'Eastern Time (UTC-5)' },
              { value: 'Europe/Istanbul', label: 'Istanbul (UTC+3)' },
              { value: 'Europe/Berlin', label: 'Berlin (UTC+1)' },
              { value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
            ]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Save Settings</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
