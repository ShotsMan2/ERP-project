import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: string;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmModal({
  open,
  title,
  content,
  onOk,
  onCancel,
  okText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={
        <span>
          <ExclamationCircleOutlined className={danger ? 'text-error mr-2' : 'text-warning mr-2'} />
          {title}
        </span>
      }
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger, loading }}
      centered
    >
      <p className="mt-4">{content}</p>
    </Modal>
  );
}
