import ReactECharts from 'echarts-for-react';
import { useTheme } from '@/hooks/useTheme';

interface PieChartProps {
  data: { name: string; value: number }[];
  title?: string;
  height?: number;
  donut?: boolean;
  loading?: boolean;
}

const COLORS = ['#1677ff', '#52c41a', '#faad14', '#ff4d4f', '#13c2c2', '#722ed1', '#eb2f96', '#fa8c16'];

export function PieChart({ data, title, height = 350, donut = false, loading }: PieChartProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const option = {
    title: title ? { text: title, left: 'center', textStyle: { color: isDark ? '#fff' : '#333' } } : undefined,
    tooltip: { trigger: 'item' as const, formatter: '{b}: {c} ({d}%)' },
    series: [
      {
        type: 'pie',
        radius: donut ? ['40%', '65%'] : '65%',
        center: ['50%', '50%'],
        data: data.map((d, i) => ({ ...d, itemStyle: { color: COLORS[i % COLORS.length] } })),
        label: {
          color: isDark ? '#999' : '#666',
          formatter: '{b}: {d}%',
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} showLoading={loading} />;
}
