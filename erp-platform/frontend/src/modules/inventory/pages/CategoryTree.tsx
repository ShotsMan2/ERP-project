import { useState } from 'react';
import { Card, Tree, Button, Modal, Form, Input, Select, Typography, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/ui/PageHeader';

const { Text } = Typography;

interface CategoryNode extends DataNode {
  id: string;
  key: string;
  title: string;
  slug?: string;
  children?: CategoryNode[];
}

const initialTreeData: CategoryNode[] = [
  { id: '1', key: '1', title: 'Electronics', slug: 'electronics', children: [
    { id: '1-1', key: '1-1', title: 'Laptops', slug: 'laptops', children: [
      { id: '1-1-1', key: '1-1-1', title: 'Gaming Laptops', slug: 'gaming-laptops' },
      { id: '1-1-2', key: '1-1-2', title: 'Business Laptops', slug: 'business-laptops' },
    ]},
    { id: '1-2', key: '1-2', title: 'Monitors', slug: 'monitors' },
    { id: '1-3', key: '1-3', title: 'Accessories', slug: 'accessories' },
  ]},
  { id: '2', key: '2', title: 'Furniture', slug: 'furniture', children: [
    { id: '2-1', key: '2-1', title: 'Desks', slug: 'desks' },
    { id: '2-2', key: '2-2', title: 'Chairs', slug: 'chairs' },
  ]},
  { id: '3', key: '3', title: 'Office Supplies', slug: 'office-supplies' },
];

const CategoryTree: React.FC = () => {
  const { t } = useTranslation();
  const [treeData, setTreeData] = useState<CategoryNode[]>(initialTreeData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryNode | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const findNode = (nodes: CategoryNode[], id: string): CategoryNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleAdd = (parentKey?: string) => {
    setEditingCategory(null);
    setParentId(parentKey || null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (node: CategoryNode) => {
    setEditingCategory(node);
    setParentId(null);
    form.setFieldsValue({ name: node.title, slug: node.slug });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const removeNode = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes.filter((n) => n.id !== id).map((n) => ({ ...n, children: n.children ? removeNode(n.children) : undefined }));
    setTreeData(removeNode(treeData));
    message.success(t('inventory.categoryTreePage.categoryDeleted'));
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingCategory) {
        const updateNode = (nodes: CategoryNode[]): CategoryNode[] =>
          nodes.map((n) => {
            if (n.id === editingCategory.id) return { ...n, title: values.name, slug: values.slug };
            return { ...n, children: n.children ? updateNode(n.children) : undefined };
          });
        setTreeData(updateNode(treeData));
        message.success(t('inventory.categoryTreePage.categoryUpdated'));
      } else {
        const newNode: CategoryNode = {
          id: Date.now().toString(),
          key: Date.now().toString(),
          title: values.name,
          slug: values.slug || values.name.toLowerCase().replace(/\s+/g, '-'),
          children: [],
        };
        if (parentId) {
          const addToParent = (nodes: CategoryNode[]): CategoryNode[] =>
            nodes.map((n) => {
              if (n.id === parentId) return { ...n, children: [...(n.children || []), newNode] };
              return { ...n, children: n.children ? addToParent(n.children) : undefined };
            });
          setTreeData(addToParent(treeData));
        } else {
          setTreeData([...treeData, newNode]);
        }
        message.success(t('inventory.categoryTreePage.categoryCreated'));
      }
      setModalOpen(false);
    });
  };

  const menuItems = (node: CategoryNode) => [
    { key: 'add', label: t('inventory.categoryTreePage.addSubcategory'), icon: <PlusOutlined />, onClick: () => handleAdd(node.id) },
    { key: 'edit', label: t('inventory.categoryTreePage.edit'), icon: <EditOutlined />, onClick: () => handleEdit(node) },
    { key: 'delete', label: t('inventory.categoryTreePage.delete'), icon: <DeleteOutlined />, danger: true, onClick: () => handleDelete(node.id) },
  ];

  const titleRender = (node: CategoryNode) => (
    <div className="group flex items-center justify-between py-1">
      <span>{node.title}</span>
      <Space size="small" className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button type="text" size="small" icon={<PlusOutlined />} onClick={(e) => { e.stopPropagation(); handleAdd(node.id); }} />
        <Button type="text" size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); handleEdit(node); }} />
        <Popconfirm title={t('inventory.categoryTreePage.deleteConfirm')} onConfirm={() => handleDelete(node.id)}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
        </Popconfirm>
      </Space>
    </div>
  );

  return (
    <div className="p-6">
      <PageHeader title={t('inventory.categoryTreePage.title')} subtitle={t('inventory.categoryTreePage.subtitle')}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
          {t('inventory.categoryTreePage.addRootCategory')}
        </Button>
      </PageHeader>

      <Card>
        <Tree
          treeData={treeData}
          defaultExpandedKeys={['1', '2']}
          showIcon
          icon={(props: any) => props.expanded ? <FolderOpenOutlined /> : <FolderOutlined />}
          titleRender={(node) => titleRender(node as CategoryNode)}
          className="bg-transparent"
        />
      </Card>

      <Modal
        title={editingCategory ? t('inventory.categoryTreePage.editCategory') : t('inventory.categoryTreePage.newCategory')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText={editingCategory ? t('inventory.categoryTreePage.update') : t('inventory.categoryTreePage.create')}
      >
        <Form form={form} layout="vertical">
          <Form.Item label={t('inventory.categoryTreePage.categoryName')} name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label={t('inventory.categoryTreePage.slug')} name="slug">
            <Input placeholder={t('inventory.categoryTreePage.autoGenerated')} />
          </Form.Item>
          {parentId && (
            <Text type="secondary">{t('inventory.categoryTreePage.parentCategory')}: <strong>{findNode(treeData, parentId)?.title}</strong></Text>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryTree;
