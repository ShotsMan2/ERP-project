import { useState } from 'react';
import {
  Card, Form, Input, Select, DatePicker, Button, Row, Col, Space, InputNumber, message, Typography, Divider,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import PageHeader from '@/components/ui/PageHeader';

const { TextArea } = Input;
const { Text } = Typography;

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  grade: string;
  manager: string;
  workLocation: string;
  hireDate: dayjs.Dayjs;
  employmentType: string;
  salary: number;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  notes: string;
}

const EmployeeForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm<EmployeeFormData>();
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  const onFinish = async (values: EmployeeFormData) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      message.success(isEditing ? t('hr.changesSavedMsg') : t('hr.employeeCreated'));
      navigate('/hr/employees');
    } catch {
      message.error(isEditing ? t('hr.updateFailed') : t('hr.createFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title={isEditing ? t('hr.editEmployeeBtn') : t('hr.newEmployee')}
        subtitle={isEditing ? t('hr.updateEmployeeInfo') : t('hr.addNewEmployee')}
        onBack={() => navigate('/hr/employees')}
      >
        <Space>
          <Button onClick={() => navigate('/hr/employees')}>{t('common.cancel')}</Button>
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
            {isEditing ? t('hr.updateEmployee') : t('hr.createEmployee')}
          </Button>
        </Space>
      </PageHeader>

      <Card>
        <Form<EmployeeFormData>
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            hireDate: dayjs(),
            employmentType: 'full_time',
            grade: 'L3',
          }}
        >
          <Divider orientation="left">{t('hr.personalInformation')}</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.firstNameLabel')} name="firstName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.lastNameLabel')} name="lastName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.emailLabel')} name="email" rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.phoneLabel')} name="phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">{t('hr.employmentDetails')}</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.department')} name="department" rules={[{ required: true }]}>
                <Select>
                   <Select.Option value="Engineering">Engineering</Select.Option>
                   <Select.Option value="Marketing">Marketing</Select.Option>
                   <Select.Option value="Finance">Finance</Select.Option>
                   <Select.Option value="HR">Human Resources</Select.Option>
                   <Select.Option value="Sales">Sales</Select.Option>
                   <Select.Option value="Operations">Operations</Select.Option>
                 </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.jobTitle')} name="jobTitle" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.grade')} name="grade">
                <Select>
                  {['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'].map((g) => (
                    <Select.Option key={g} value={g}>{g}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.reportsTo')} name="manager">
                <Select showSearch placeholder={t('hr.searchManager')}>
                  <Select.Option value="Alice Johnson">Alice Johnson</Select.Option>
                  <Select.Option value="Bob Williams">Bob Williams</Select.Option>
                  <Select.Option value="Carol Martinez">Carol Martinez</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.employmentType')} name="employmentType" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="full_time">{t('hr.fullTimeLabel')}</Select.Option>
                  <Select.Option value="part_time">{t('hr.partTimeLabel')}</Select.Option>
                  <Select.Option value="contract">{t('hr.contractLabel')}</Select.Option>
                  <Select.Option value="intern">{t('hr.internLabel')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.workLocation')} name="workLocation">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.hireDate')} name="hireDate" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item label={t('hr.salary')} name="salary">
                <InputNumber min={0} prefix="$" className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">{t('hr.emergencyContact')}</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item label={t('hr.fullNameLabel')} name="emergencyName">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label={t('hr.phoneLabel')} name="emergencyPhone">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label={t('hr.relationshipLabel')} name="emergencyRelation">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">{t('hr.notesLabel')}</Divider>
          <Form.Item name="notes">
            <TextArea rows={4} placeholder={t('hr.notesPlaceholder')} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EmployeeForm;
