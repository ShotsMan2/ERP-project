import ReactECharts from 'echarts-for-react';
import { useTheme } from '@/hooks/useTheme';

interface LineChartProps {
  data: { name: string; value: number }[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  smooth?: boolean;
  loading?: boolean;
  area?: boolean;
}

export function LineChart({ data, title, xAxisLabel, yAxisLabel, height = 350, smooth = true, loading, area }: LineChartProps) {
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
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      name: yAxisLabel,
      axisLabel: { color: isDark ? '#999' : '#666' },
      splitLine: { lineStyle: { color: isDark ? '#333' : '#f0f0f0' } },
    },
    series: [
      {
        type: 'line',
        data: data.map((d) => d.value),
        smooth,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: '#1677ff' },
        itemStyle: { color: '#1677ff' },
        areaStyle: area ? { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#1677ff33' }, { offset: 1, color: '#1677ff05' }] } } : undefined,
      },
    ],
    grid: { left: 60, right: 20, top: title ? 50 : 20, bottom: 40 },
  };

  return <ReactECharts option={option} style={{ height }} showLoading={loading} />;
}
