import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry } from '../../types';

interface ChartMobileProps {
  data: Record<string, MoodEntry>;
}

const ChartMobile = ({ data }: ChartMobileProps) => {
  const chartData = Object.entries(data)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-30) // Last 30 days
    .map(([date, entry]) => ({
      date: new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      score: entry.score,
    }));

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <p className="text-caption text-center">
          📱 Для детального анализа и удобного просмотра откройте Telegram на компьютере
        </p>
      </div>

      <div>
        <ResponsiveContainer width="100%" height={300}>
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
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(0, 0%, 85%)',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              }}
            />
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
    </div>
  );
};

export default ChartMobile;
