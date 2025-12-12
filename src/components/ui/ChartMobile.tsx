import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { MoodEntry } from '../../types';
import ChartZoomPan from './ChartZoomPan';

interface ChartMobileProps {
  data: Record<string, MoodEntry>;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as { date: string; score: number; note: string };
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

const ChartMobile = ({ data }: ChartMobileProps) => {
  const chartData = Object.entries(data)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-30) // Last 30 days
    .map(([date, entry]) => ({
      date: new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      score: entry.score,
      note: entry.note,
    }));

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <p className="text-caption text-center">
          📱 Для детального анализа и удобного просмотра откройте Telegram на компьютере
        </p>
      </div>

      <ChartZoomPan minScale={0.5} maxScale={3} initialScale={1}>
        <div style={{ width: '100%', minWidth: '600px', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="hsl(0, 0%, 85%)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: 'hsl(0, 0%, 60%)' }}
                stroke="hsl(0, 0%, 85%)"
              />
              <YAxis
                domain={[-5, 5]}
                ticks={[-5, -3, 0, 3, 5]}
                tick={{ fontSize: 12, fill: 'hsl(0, 0%, 60%)' }}
                stroke="hsl(0, 0%, 85%)"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(222, 76%, 70%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(222, 76%, 70%)', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartZoomPan>
      
      <div className="card mt-2">
        <p className="text-caption text-center">
          💡 Используйте жесты для масштабирования (pinch) и перемещения графика (swipe)
        </p>
      </div>
    </div>
  );
};

export default ChartMobile;
