import ReactECharts from 'echarts-for-react';
import { useTheme } from '@/hooks/useTheme';

interface GaugeChartProps {
  value: number;
  title?: string;
  min?: number;
  max?: number;
  height?: number;
  loading?: boolean;
}

export function GaugeChart({ value, title, min = 0, max = 100, height = 300, loading }: GaugeChartProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 220,
        endAngle: -40,
        min,
        max,
        pointer: { show: true, length: '60%', width: 4 },
        progress: { show: true, width: 8, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#52c41a' }, { offset: 0.5, color: '#faad14' }, { offset: 1, color: '#ff4d4f' }] } } },
        axisLine: { lineStyle: { width: 8, color: [[1, isDark ? '#333' : '#e8e8e8']] } },
        axisTick: { show: false },
        splitLine: { length: 8, lineStyle: { color: isDark ? '#555' : '#ccc' } },
        axisLabel: { color: isDark ? '#999' : '#666', distance: 20 },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: isDark ? '#fff' : '#333',
          fontSize: 24,
          fontWeight: 'bold',
        },
        data: [{ value }],
        title: title ? { offsetCenter: [0, '80%'], fontSize: 14, color: isDark ? '#999' : '#666' } : undefined,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} showLoading={loading} />;
}
