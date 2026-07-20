import { LineChart } from './LineChart';

interface AreaChartProps {
  data: { name: string; value: number }[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  loading?: boolean;
}

export function AreaChart(props: AreaChartProps) {
  return <LineChart {...props} area smooth />;
}
