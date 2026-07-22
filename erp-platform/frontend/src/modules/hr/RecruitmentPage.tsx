import { useState, useEffect } from 'react';
import { Button, Input, Skeleton, Segmented } from 'antd';
import { SearchOutlined, FilterOutlined, AppstoreOutlined, BarsOutlined, StarOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { CandidateScoreCard } from '@/components/hr/CandidateScoreCard';

// Mock data enhanced for the new UI
const mockCandidates = [
  { id: '1', name: 'Mike Johnson', position: 'Senior Python Developer', score: 92, skills: ['Python', 'FastAPI', 'Docker', 'AWS'], status: 'evaluated' as const, avatarUrl: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Sarah Lee', position: 'Frontend Engineer', score: 85, skills: ['React', 'TypeScript', 'Tailwind', 'Framer'], status: 'evaluated' as const, avatarUrl: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Tom Harris', position: 'DevOps Engineer', score: 65, skills: ['Kubernetes', 'Terraform', 'CI/CD'], status: 'evaluated' as const, avatarUrl: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Emily Chen', position: 'Product Manager', score: 45, skills: ['Agile', 'Scrum', 'Jira', 'Figma'], status: 'evaluated' as const, avatarUrl: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Alex Wong', position: 'Data Scientist', score: 0, skills: [], status: 'processing' as const },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function RecruitmentPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Simulate network delay for wow effect skeletons
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredCandidates = mockCandidates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-4 right-6 text-indigo-500/20 text-6xl">
          <StarOutlined />
        </div>
        <PageHeader 
          title={t('hr.recruitmentTitle')} 
          subtitle={t('hr.manageJobPostings')} 
          onAdd={() => {}} 
          addLabel={t('hr.newJobPost')} 
        />
      </motion.div>

      {/* Toolbar Section */}
      <motion.div variants={itemVariants} className="flex justify-between items-center glass-panel p-4 rounded-xl">
        <div className="flex gap-4 w-full max-w-lg">
          <Input 
            size="large" 
            placeholder="Search candidates by AI skills or name..." 
            prefix={<SearchOutlined className="text-indigo-400/70" />} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border-indigo-100 dark:border-indigo-900/30 shadow-inner"
            allowClear
          />
          <Button size="large" icon={<FilterOutlined />} className="rounded-xl neon-border">Filters</Button>
        </div>
        <Segmented 
          options={[
            { value: 'grid', icon: <AppstoreOutlined /> },
            { value: 'list', icon: <BarsOutlined /> }
          ]} 
          value={viewMode}
          onChange={(val) => setViewMode(val as 'grid' | 'list')}
          size="large"
          className="p-1 rounded-xl glass-panel bg-white/40 dark:bg-slate-800/40"
        />
      </motion.div>

      {/* Content Section */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="skeleton"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[1, 2, 3, 4].map((i) => (
                <motion.div key={i} variants={itemVariants} className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  <div className="flex items-center gap-4 mb-6">
                    <Skeleton.Avatar active size={64} shape="circle" />
                    <div className="w-full">
                      <Skeleton.Button active size="small" className="!w-3/4 mb-3 !h-5" />
                      <Skeleton.Button active size="small" className="!w-1/2 !h-4" />
                    </div>
                  </div>
                  <Skeleton active paragraph={{ rows: 2, width: ['100%', '80%'] }} title={false} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
            >
              {filteredCandidates.map((candidate) => (
                <motion.div key={candidate.id} variants={itemVariants}>
                  <CandidateScoreCard {...candidate} />
                </motion.div>
              ))}
              
              {filteredCandidates.length === 0 && (
                <motion.div variants={itemVariants} className="col-span-full py-20 text-center glass-panel rounded-2xl flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No candidates found</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search filters to find the perfect match.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
