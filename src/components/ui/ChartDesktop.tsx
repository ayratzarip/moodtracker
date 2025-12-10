import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { MoodEntry } from '../../types';

interface ChartDesktopProps {
  data: Record<string, MoodEntry>;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as { date: string; score: number; fullDate: string; note: string };
    // Показываем только текст примечания, если оно есть
    if (data.note) {
      return (
        <div className="card max-w-xs">
          <p className="text-body text-gray-0 dark:text-gray-100">{data.note}</p>
        </div>
      );
    }
    // Если примечания нет, не показываем tooltip
    return null;
  }
  return null;
};

const ChartDesktop = ({ data }: ChartDesktopProps) => {
  const chartData = Object.entries(data)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, entry]) => ({
      date: new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      fullDate: new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      score: entry.score,
      note: entry.note,
    }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="hsl(0, 0%, 85%)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 14, fill: 'hsl(0, 0%, 60%)' }}
            stroke="hsl(0, 0%, 85%)"
          />
          <YAxis
            domain={[-5, 5]}
            ticks={[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
            tick={{ fontSize: 14, fill: 'hsl(0, 0%, 60%)' }}
            stroke="hsl(0, 0%, 85%)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(222, 76%, 70%)"
            strokeWidth={3}
            dot={{ fill: 'hsl(222, 76%, 70%)', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartDesktop;
