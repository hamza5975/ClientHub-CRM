import { ReactNode } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Card } from '@/components/ui';
import { cn } from '@/utils/cn';

interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  data: Record<string, unknown>[];
  xKey?: string;
  yKeys?: string[];
  colors?: string[];
  title?: string;
  height?: number;
  className?: string;
}

const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Chart({
  type,
  data,
  xKey = 'name',
  yKeys = ['value'],
  colors = defaultColors,
  title,
  height = 300,
  className,
}: ChartProps) {
  return (
    <Card
      className={cn('p-4', className)}
      data-icod-id="src_components_chart_tsx_98a6">
      {title && <h3
        className="mb-4 text-lg font-semibold text-foreground"
        data-icod-id="src_components_chart_tsx_3a83">{title}</h3>}
      <div style={{ height }} data-icod-id="src_components_chart_tsx_ab2f">
        <ResponsiveContainer width="100%" height="100%" data-icod-id="src_components_chart_tsx_3a2d">
          {type === 'line' ? (
            <LineChart data={data} data-icod-id="src_components_chart_tsx_e33e">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                data-icod-id="src_components_chart_tsx_60c9" />
              <XAxis
                dataKey={xKey}
                stroke="#64748b"
                fontSize={12}
                data-icod-id="src_components_chart_tsx_afb7" />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                data-icod-id="src_components_chart_tsx_1424" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                data-icod-id="src_components_chart_tsx_11f8" />
              <Legend data-icod-id="src_components_chart_tsx_b28b" />
              {yKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  data-icod-id={`src_components_chart_tsx_617c_${key}`} />
              ))}
            </LineChart>
          ) : type === 'bar' ? (
            <BarChart data={data} data-icod-id="src_components_chart_tsx_f28c">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                data-icod-id="src_components_chart_tsx_e3e8" />
              <XAxis
                dataKey={xKey}
                stroke="#64748b"
                fontSize={12}
                data-icod-id="src_components_chart_tsx_99b1" />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                data-icod-id="src_components_chart_tsx_b19d" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                data-icod-id="src_components_chart_tsx_7c9d" />
              <Legend data-icod-id="src_components_chart_tsx_5260" />
              {yKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                  data-icod-id={`src_components_chart_tsx_69b3_${key}`} />
              ))}
            </BarChart>
          ) : (
            <PieChart data-icod-id="src_components_chart_tsx_f8cc">
              <Pie
                data={data}
                dataKey={yKeys[0]}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={height / 3}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                data-icod-id="src_components_chart_tsx_30d2">
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={colors[index % colors.length]}
                    data-icod-id={`src_components_chart_tsx_51bb_${index}`} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                data-icod-id="src_components_chart_tsx_3679" />
              <Legend data-icod-id="src_components_chart_tsx_5de2" />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
