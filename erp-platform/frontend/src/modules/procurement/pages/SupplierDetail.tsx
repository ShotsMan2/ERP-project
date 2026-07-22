import { Card, Descriptions, Tag, Table, Tabs, Rate, Row, Col, Statistic, Typography, Space, Button } from 'antd';
import { EditOutlined, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;
const mockSupplier = { id: '1', code: 'SUP001', name: 'TechSupply Inc.', email: 'orders@techsupply.com', phone: '+1-555-0401', website: 'www.techsupply.com', category: 'Electronics', rating: 4.5, status: 'active' as const, paymentTerms: 'Net 30', currency: 'USD', taxId: 'TX-9876543', address: '123 Tech Street, Silicon Valley, CA 94025', notes: 'Preferred vendor for electronics' };

const contacts = [
  { id: 'c1', name: 'John Sales', email: 'john@techsupply.com', phone: '+1-555-0410', role: 'Sales Manager', isPrimary: true },
  { id: 'c2', name: 'Jane Support', email: 'jane@techsupply.com', phone: '+1-555-0411', role: 'Support Lead', isPrimary: false },
];

const contracts = [
  { id: 'ct1', name: 'Annual Supply Agreement 2024', value: 500000, start: '2024-01-01', end: '2024-12-31', status: 'active' },
  { id: 'ct2', name: 'Service Level Agreement', value: 50000, start: '2024-06-01', end: '2025-05-31', status: 'active' },
];

const poHistory = [
  { po: 'PO-2024-0156', date: '2024-12-15', amount: 45000, status: 'pending' },
  { po: 'PO-2024-0154', date: '2024-12-12', amount: 28000, status: 'received' },
  { po: 'PO-2024-0148', date: '2024-11-28', amount: 32000, status: 'closed' },
];

const SupplierDetail: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const totalPOs = poHistory.length;
  const totalSpend = poHistory.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-6">
      <PageHeader title={mockSupplier.name} subtitle={t('procurement.supplierDetail.subtitle', { code: mockSupplier.code })} onBack={() => navigate('/procurement/suppliers')}>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate('/procurement/suppliers/' + mockSupplier.id + '/edit')}>{t('procurement.supplierDetail.editSupplier')}</Button>
      </PageHeader>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={6}><Card><Statistic title={t('procurement.supplierDetail.rating')} value={mockSupplier.rating} precision={1} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('procurement.supplierDetail.totalPOs')} value={totalPOs} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('procurement.supplierDetail.totalSpend')} value={totalSpend} prefix="$" precision={0} /></Card></Col>
        <Col xs={24} sm={6}><Card><Statistic title={t('procurement.supplierDetail.activeContracts')} value={contracts.filter((c) => c.status === 'active').length} /></Card></Col>
      </Row>
      <Card>
        <Tabs defaultActiveKey="profile" items={[
          { key: 'profile', label: t('procurement.supplierDetail.profile'), children: (
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label={t('procurement.supplierDetail.name')}>{mockSupplier.name}</Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.code')}>{mockSupplier.code}</Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.category')}><Tag>{mockSupplier.category}</Tag></Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.status')}><Tag color="green">{mockSupplier.status}</Tag></Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.rating')}><Rate disabled allowHalf value={mockSupplier.rating} /></Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.paymentTerms')}>{mockSupplier.paymentTerms}</Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.currency')}>{mockSupplier.currency}</Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.taxId')}>{mockSupplier.taxId}</Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.email')}><Space><MailOutlined />{mockSupplier.email}</Space></Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.phone')}><Space><PhoneOutlined />{mockSupplier.phone}</Space></Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.website')}><Space><GlobalOutlined />{mockSupplier.website}</Space></Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.address')} span={2}>{mockSupplier.address}</Descriptions.Item>
              <Descriptions.Item label={t('procurement.supplierDetail.notes')} span={2}>{mockSupplier.notes}</Descriptions.Item>
            </Descriptions>
          )},
          { key: 'contacts', label: t('procurement.supplierDetail.contacts') + ' (' + contacts.length + ')', children: (
            <Table dataSource={contacts} rowKey="id" pagination={false} size="small"
              columns={[
                { title: t('procurement.supplierDetail.name'), dataIndex: 'name' }, { title: t('procurement.supplierDetail.email'), dataIndex: 'email' }, { title: t('procurement.supplierDetail.phone'), dataIndex: 'phone' },
                { title: 'Role', dataIndex: 'role' }, { title: 'Primary', dataIndex: 'isPrimary', render: (v: boolean) => v ? <Tag color="blue">Primary</Tag> : '' },
              ]}
            />
          )},
          { key: 'contracts', label: t('procurement.supplierDetail.contracts') + ' (' + contracts.length + ')', children: (
            <Table dataSource={contracts} rowKey="id" pagination={false} size="small"
              columns={[
                { title: t('procurement.supplierDetail.name'), dataIndex: 'name' }, { title: 'Value', dataIndex: 'value', render: (v: number) => '$' + v.toLocaleString() },
                { title: 'Start', dataIndex: 'start' }, { title: 'End', dataIndex: 'end' },
                { title: t('procurement.supplierDetail.status'), dataIndex: 'status', render: (s: string) => <Tag color="green">{s}</Tag> },
              ]}
            />
          )},
          { key: 'pos', label: t('procurement.supplierDetail.poHistory') + ' (' + poHistory.length + ')', children: (
            <Table dataSource={poHistory} rowKey="po" pagination={false} size="small"
              columns={[
                { title: t('procurement.supplierDetail.poNumber'), dataIndex: 'po', render: (v: string) => <a onClick={() => navigate('/procurement/purchase-orders/' + v)}>{v}</a> },
                { title: t('procurement.supplierDetail.date'), dataIndex: 'date' }, { title: t('procurement.supplierDetail.amount'), dataIndex: 'amount', render: (v: number) => '$' + v.toLocaleString() },
                { title: t('procurement.supplierDetail.status'), dataIndex: 'status', render: (s: string) => <Tag color={s === 'closed' ? 'purple' : s === 'received' ? 'green' : 'orange'}>{s}</Tag> },
              ]}
            />
          )},
          { key: 'performance', label: t('procurement.supplierDetail.performance'), children: <div className="text-center py-8"><Text type="secondary">{t('procurement.supplierDetail.performancePlaceholder')}</Text></div> },
        ]} />
      </Card>
    </div>
  );
};

export default SupplierDetail;
