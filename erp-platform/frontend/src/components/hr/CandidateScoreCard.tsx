import React from 'react';
import { Card, Progress, Tag, Typography, Avatar, Divider } from 'antd';
import { motion } from 'framer-motion';
import { UserOutlined, CheckCircleOutlined, SyncOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export interface CandidateScoreCardProps {
  name: string;
  position: string;
  score: number;
  skills: string[];
  status: 'pending' | 'evaluated' | 'processing';
  avatarUrl?: string;
}

export const CandidateScoreCard: React.FC<CandidateScoreCardProps> = ({
  name,
  position,
  score,
  skills,
  status,
  avatarUrl
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Success Green
    if (score >= 60) return '#f59e0b'; // Warning Yellow
    return '#ef4444'; // Error Red
  };

  return (
    <Card 
      hoverable 
      className="w-full rounded-2xl border-0 bg-transparent"
      bodyStyle={{ padding: 0 }}
    >
      <div className="glass-panel p-5 rounded-2xl glass-panel-hover group relative overflow-hidden">
        {/* Decorative background glow for high scores */}
        {score >= 80 && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -z-10 group-hover:bg-green-500/20 transition-all duration-500" />
        )}

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            <Avatar 
              size={64} 
              src={avatarUrl} 
              icon={!avatarUrl && <UserOutlined />} 
              className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 ring-2 ring-white/50 dark:ring-white/10 shadow-lg" 
            />
            <div>
              <Title level={5} className="!mb-1 !mt-0 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {name}
              </Title>
              <Text type="secondary" className="text-sm dark:text-slate-400 font-medium">{position}</Text>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl backdrop-blur-md shadow-inner border border-white/20 dark:border-white/5">
            <Progress 
              type="dashboard" 
              percent={score} 
              size={54} 
              strokeColor={getScoreColor(score)}
              format={(percent) => <span className="text-sm font-bold dark:text-slate-200">{percent}%</span>}
            />
            <Text className="text-[10px] mt-1 text-slate-500 dark:text-slate-400 font-bold tracking-wider uppercase">AI Score</Text>
          </div>
        </div>

        <Divider className="my-4 border-slate-200/50 dark:border-slate-700/50" />

        <div className="mb-4">
          <Text className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-3 block flex items-center gap-1">
            <StarOutlined /> Top Skills
          </Text>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Tag key={index} className="rounded-full px-3 py-1 bg-indigo-50/80 text-indigo-700 border-indigo-100/50 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20 backdrop-blur-sm shadow-sm">
                {skill}
              </Tag>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/50">
           {status === 'evaluated' ? (
             <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide gap-1.5">
                <CheckCircleOutlined className="text-sm" /> AI Evaluated
             </span>
           ) : status === 'processing' ? (
             <span className="flex items-center text-indigo-500 dark:text-indigo-400 text-xs font-bold tracking-wide gap-1.5">
                <SyncOutlined spin className="text-sm" /> Parsing...
             </span>
           ) : (
             <span className="flex items-center text-slate-400 text-xs font-bold tracking-wide gap-1.5">
                Pending
             </span>
           )}
           <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors group-hover:translate-x-1 inline-block duration-300">
             View Profile &rarr;
           </span>
        </div>
      </div>
    </Card>
  );
};
