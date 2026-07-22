import React from 'react';
import { Tag } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface Props {
  text: string;
  type?: 'positive' | 'warning' | 'info';
}

export const AIPredictionTag: React.FC<Props> = ({ text, type = 'info' }) => {
  let color = 'processing';
  if (type === 'positive') color = 'success';
  if (type === 'warning') color = 'warning';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-block"
    >
      <Tag color={color} className="rounded-full px-3 py-1 border-0 shadow-sm flex items-center gap-1 bg-opacity-20 backdrop-blur-md">
        <RobotOutlined className="animate-pulse" />
        <span className="font-semibold">{text}</span>
      </Tag>
    </motion.div>
  );
};
