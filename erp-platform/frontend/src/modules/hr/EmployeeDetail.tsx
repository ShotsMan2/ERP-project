import { useParams } from 'react-router-dom';
import { Descriptions, Tag } from 'antd';
import { DetailForm } from '@/components/data/DetailForm';
import { useTranslation } from 'react-i18next';

export default function EmployeeDetail() {
  const { id } = useParams();
  const { t } = useTranslation();

  const tabs = [
    {
      key: 'personal',
      label: t('hr.personalInformation'),
      content: (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('hr.firstName')}>John</Descriptions.Item>
          <Descriptions.Item label={t('hr.lastName')}>Doe</Descriptions.Item>
          <Descriptions.Item label={t('hr.email')}>john.doe@company.com</Descriptions.Item>
          <Descriptions.Item label={t('hr.phone')}>+1 (555) 123-4567</Descriptions.Item>
          <Descriptions.Item label={t('hr.department')}>Engineering</Descriptions.Item>
          <Descriptions.Item label={t('hr.position')}>Senior Developer</Descriptions.Item>
          <Descriptions.Item label={t('hr.hireDate')}>2022-03-15</Descriptions.Item>
          <Descriptions.Item label={t('hr.status')}><Tag color="green">{t('hr.active')}</Tag></Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'employment',
      label: t('hr.employmentDetails'),
      content: (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('hr.employeeCode')}>EMP001</Descriptions.Item>
          <Descriptions.Item label={t('hr.type')}>{t('hr.fullTime')}</Descriptions.Item>
          <Descriptions.Item label={t('hr.reportsTo')}>Sarah Johnson</Descriptions.Item>
          <Descriptions.Item label={t('hr.grade')}>L4</Descriptions.Item>
          <Descriptions.Item label={t('hr.costCenter')}>ENG-001</Descriptions.Item>
        </Descriptions>
      ),
    },
  ];

  return <DetailForm title={`${t('hr.employeeLabel')} ${id}`} tabs={tabs} />;
}
