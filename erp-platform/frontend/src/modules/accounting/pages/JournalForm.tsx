import { useState } from 'react';
import { Card, Form, Select, Input, Button, Row, Col, Table, Typography, InputNumber, DatePicker, message, Divider, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';
const { TextArea } = Input;
const { Text } = Typography;

interface JournalLine { key: string; account: string; accountName: string; debit: number; credit: number; description: string; }
const accountOptions = [
  { value: '1101', label: '1101 - Cash on Hand' }, { value: '1102', label: '1102 - Checking Account' },
  { value: '1200', label: '1200 - Accounts Receivable' }, { value: '2100', label: '2100 - Accounts Payable' },
  { value: '4100', label: '4100 - Sales Revenue' }, { value: '5100', label: '5100 - Salaries & Wages' },
];

const JournalForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [lines, setLines] = useState<JournalLine[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addLine = () => setLines([...lines, { key: Date.now().toString(), account: '', accountName: '', debit: 0, credit: 0, description: '' }]);
  const removeLine = (key: string) => setLines(lines.filter((l) => l.key !== key));
  const updateLine = (key: string, field: string, value: any) => setLines(lines.map((l) => l.key === key ? { ...l, [field]: value } : l));

  const totalDebit = lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const lineColumns = [
    { title: t('accounting.journalForm.account'), dataIndex: 'account', width: 200, render: (v: string, r: JournalLine) => (
      <Select value={v || undefined} onChange={(val) => { const acct = accountOptions.find((a) => a.value === val); updateLine(r.key, 'account', val); updateLine(r.key, 'accountName', acct?.label || ''); }} showSearch placeholder={t('accounting.journalForm.selectAccount')} style={{ width: '100%' }}
        options={accountOptions.map((a) => ({ value: a.value, label: a.label }))} />
    )},
    { title: t('accounting.journalForm.debit'), dataIndex: 'debit', width: 120, render: (v: number, r: JournalLine) => <InputNumber min={0} prefix="$" value={v} onChange={(val) => updateLine(r.key, 'debit', val)} className="w-full" /> },
    { title: t('accounting.journalForm.credit'), dataIndex: 'credit', width: 120, render: (v: number, r: JournalLine) => <InputNumber min={0} prefix="$" value={v} onChange={(val) => updateLine(r.key, 'credit', val)} className="w-full" /> },
    { title: t('accounting.journalForm.description'), dataIndex: 'description', render: (v: string, r: JournalLine) => <Input value={v} onChange={(e) => updateLine(r.key, 'description', e.target.value)} /> },
    { title: '', key: 'action', width: 50, render: (_: unknown, r: JournalLine) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeLine(r.key)} /> },
  ];

  const onFinish = async () => {
    if (lines.length < 2) { message.error(t('accounting.journalForm.journalMustHaveAtLeast2Lines')); return; }
    if (!isBalanced) { message.error(t('accounting.journalForm.debitsMustEqualCredits')); return; }
    setSubmitting(true);
    try { await new Promise((r) => setTimeout(r, 1500)); message.success(t('accounting.journalForm.journalCreated')); navigate('/accounting/journals'); }
    catch { message.error(t('accounting.journalForm.failed')); } finally { setSubmitting(false); }
  };

  return (
    <div className="p-6">
      <PageHeader title={t('accounting.journalForm.newJournalEntry')} subtitle={t('accounting.journalForm.subtitle')} onBack={() => navigate('/accounting/journals')}>
        <Button type="primary" icon={<SaveOutlined />} loading={submitting} onClick={onFinish}>{t('accounting.journalForm.saveJournal')}</Button>
      </PageHeader>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={8}><Form.Item label={t('accounting.journalForm.journalType')} name="journalType" rules={[{ required: true }]}><Select><Select.Option value="general">{t('accounting.journalForm.general')}</Select.Option><Select.Option value="sales">{t('accounting.journalForm.sales')}</Select.Option><Select.Option value="purchase">{t('accounting.journalForm.purchase')}</Select.Option><Select.Option value="payroll">{t('accounting.journalForm.payroll')}</Select.Option></Select></Form.Item></Col>
                <Col span={8}><Form.Item label={t('accounting.journalForm.date')} name="date" initialValue={dayjs()}><DatePicker className="w-full" /></Form.Item></Col>
                <Col span={8}><Form.Item label={t('accounting.journalForm.reference')} name="reference"><Input placeholder={t('accounting.journalForm.autoGeneratedIfEmpty')} /></Form.Item></Col>
              </Row>
              <Form.Item label={t('accounting.journalForm.description')} name="description" rules={[{ required: true }]}><TextArea rows={2} /></Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={24}>
          <Card title={t('accounting.journalForm.journalLines')} extra={<Button type="dashed" icon={<PlusOutlined />} onClick={addLine}>{t('accounting.journalForm.addLine')}</Button>}>
            <Table dataSource={lines} columns={lineColumns} pagination={false} rowKey="key" />
            <Divider />
            <div className="flex justify-between items-center">
              <div><Text>{t('accounting.journalForm.totalDebit')}: <strong>${totalDebit.toFixed(2)}</strong></Text> | <Text>{t('accounting.journalForm.totalCredit')}: <strong>${totalCredit.toFixed(2)}</strong></Text></div>
              {lines.length > 1 && <Alert type={isBalanced ? 'success' : 'error'} message={isBalanced ? t('accounting.journalForm.balanced') : t('accounting.journalForm.notBalanced')} showIcon className="py-1" />}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default JournalForm;
