import ReactECharts from 'echarts-for-react';
import { useTheme } from '@/hooks/useTheme';

interface BarChartProps {
  data: { name: string; value: number }[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  loading?: boolean;
}

export function BarChart({ data, title, xAxisLabel, yAxisLabel, height = 350, loading }: BarChartProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const option = {
    title: title ? { text: title, left: 'center', textStyle: { color: isDark ? '#fff' : '#333' } } : undefined,
    tooltip: { trigger: 'axis' as const },
    xAxis: {
      type: 'category' as const,
      data: data.map((d) => d.name),
      name: xAxisLabel,
      axisLabel: { color: isDark ? '#999' : '#666' },
      axisLine: { lineStyle: { color: isDark ? '#333' : '#e8e8e8' } },
    },
    yAxis: {
      type: 'value' as const,
      name: yAxisLabel,
      axisLabel: { color: isDark ? '#999' : '#666' },
      splitLine: { lineStyle: { color: isDark ? '#333' : '#f0f0f0' } },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.value),
        itemStyle: {
          color: '#1677ff',
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: { color: '#4096ff' },
        },
      },
    ],
    grid: { left: 60, right: 20, top: title ? 50 : 20, bottom: 40 },
  };

  return <ReactECharts option={option} style={{ height }} showLoading={loading} />;
}
