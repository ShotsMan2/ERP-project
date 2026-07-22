import { useEffect, useState } from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { TeamOutlined, ShoppingCartOutlined, DollarOutlined, RiseOutlined, RobotOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { StatCard } from '@/components/ui/StatCard';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { GlassCard } from '@/components/ui/GlassCard';
import { AIPredictionTag } from '@/components/ui/AIPredictionTag';
import { motion, Variants } from 'framer-motion';
import { api } from '@/services/api';

const { Title, Text } = Typography;

export default function ExecutiveDashboard() {
  const { t } = useTranslation();
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    // Fetch AI insights
    const fetchInsights = async () => {
      try {
        const res = await api.get('/ai/insights');
        setInsights(res.data);
      } catch (err) {
        console.error("Failed to fetch insights", err);
      }
    };
    fetchInsights();
  }, []);

  const monthlyRevenue = [
    { name: 'Jan', value: 45000 }, { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 }, { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 }, { name: 'Jun', value: 67000 },
    { name: 'Jul', value: 72000 }, { name: 'Aug', value: 68000 },
    { name: 'Sep', value: 75000 }, { name: 'Oct', value: 82000 },
    { name: 'Nov', value: 78000 }, { name: 'Dec', value: 91000 },
  ];

  const salesByCategory = [
    { name: 'Electronics', value: 35 }, { name: 'Office Supplies', value: 25 },
    { name: 'Furniture', value: 20 }, { name: 'Software', value: 15 },
    { name: 'Services', value: 5 },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <Title level={3} className="!mb-1 premium-gradient-text">{t('dashboard.executive.title')}</Title>
          <Text className="text-gray-500 dark:text-gray-400">Welcome back! Here's your enterprise overview powered by AI.</Text>
        </div>
      </div>

      {/* AI Insights Section */}
      <motion.div variants={itemVariants} className="mb-6">
        <GlassCard className="p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-2 mb-3">
            <RobotOutlined className="text-xl text-indigo-500" />
            <h3 className="text-lg font-bold m-0">AI Actionable Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map(insight => (
              <div key={insight.id} className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-white/20">
                <AIPredictionTag text={insight.title} type={insight.type} />
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{insight.message}</p>
                <Button type="link" className="p-0 mt-1" icon={<ArrowRightOutlined />} iconPosition="end">
                  {insight.action}
                </Button>
              </div>
            ))}
            {insights.length === 0 && <Text className="text-gray-400">Analyzing your data...</Text>}
          </div>
        </GlassCard>
      </motion.div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <GlassCard hoverEffect>
              <StatCard icon={<DollarOutlined />} title={t('dashboard.executive.totalRevenue')} value="$ 524,800" trend={12.5} trendLabel={t('dashboard.executive.vsLastYear')} color="#1677ff" />
            </GlassCard>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <GlassCard hoverEffect>
              <StatCard icon={<ShoppingCartOutlined />} title={t('dashboard.executive.totalOrders')} value="1,284" trend={8.3} trendLabel={t('dashboard.executive.vsLastYear')} color="#52c41a" />
            </GlassCard>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <GlassCard hoverEffect>
              <StatCard icon={<TeamOutlined />} title={t('dashboard.executive.activeCustomers')} value="892" trend={15.2} trendLabel={t('dashboard.executive.vsLastYear')} color="#722ed1" />
            </GlassCard>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <motion.div variants={itemVariants}>
            <GlassCard hoverEffect>
              <StatCard icon={<RiseOutlined />} title={t('dashboard.executive.growthRate')} value="23.5%" trend={2.1} trendLabel={t('dashboard.executive.vsLastQuarter')} color="#13c2c2" />
            </GlassCard>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={16}>
          <motion.div variants={itemVariants} className="h-full">
            <GlassCard className="p-6 h-full" hoverEffect={false}>
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.monthlyRevenue')}</h3>
              <BarChart data={monthlyRevenue} height={300} />
            </GlassCard>
          </motion.div>
        </Col>
        <Col xs={24} lg={8}>
          <motion.div variants={itemVariants} className="h-full">
            <GlassCard className="p-6 h-full" hoverEffect={false}>
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.salesByCategory')}</h3>
              <PieChart data={salesByCategory} height={300} donut />
            </GlassCard>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6" hoverEffect={false}>
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.executive.revenueTrend')}</h3>
              <LineChart data={monthlyRevenue} height={300} />
            </GlassCard>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
}
