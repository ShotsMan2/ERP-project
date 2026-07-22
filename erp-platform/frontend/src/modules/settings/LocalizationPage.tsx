import { Card, Form, Select, Button, Typography } from 'antd';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

export default function LocalizationPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('settings.localizationPage.title')} subtitle={t('settings.localizationPage.subtitle')} />
      <Card>
        <Form layout="vertical" className="max-w-md">
          <Form.Item label={t('settings.localizationPage.defaultLanguage')}>
            <Select defaultValue="en" options={[
              { value: 'en', label: 'English' },
              { value: 'tr', label: 'T\u00FCrk\u00E7e' },
              { value: 'de', label: 'Deutsch' },
              { value: 'fr', label: 'Fran\u00E7ais' },
            ]} />
          </Form.Item>
          <Form.Item label={t('settings.localizationPage.dateFormat')}>
            <Select defaultValue="YYYY-MM-DD" options={[
              { value: 'YYYY-MM-DD', label: '2026-07-20' },
              { value: 'DD/MM/YYYY', label: '20/07/2026' },
              { value: 'MM/DD/YYYY', label: '07/20/2026' },
            ]} />
          </Form.Item>
          <Form.Item label={t('settings.localizationPage.timeFormat')}>
            <Select defaultValue="24h" options={[
              { value: '24h', label: '14:30 (24h)' },
              { value: '12h', label: '2:30 PM (12h)' },
            ]} />
          </Form.Item>
          <Form.Item label={t('settings.localizationPage.timezone')}>
            <Select defaultValue="America/New_York" options={[
              { value: 'America/New_York', label: 'Eastern Time (UTC-5)' },
              { value: 'Europe/Istanbul', label: 'Istanbul (UTC+3)' },
              { value: 'Europe/Berlin', label: 'Berlin (UTC+1)' },
              { value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
            ]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary">{t('settings.localizationPage.saveSettings')}</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
