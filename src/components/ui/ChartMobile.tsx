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
    <div>
      <div className="tg-bg-secondary rounded-lg p-4 mb-4">
        <p className="text-sm tg-hint text-center">
          📱 Для детального анализа и удобного просмотра откройте Telegram на компьютере
        </p>
      </div>

      <div className="tg-bg-secondary rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="var(--tg-theme-hint-color)"
            />
            <YAxis
              domain={[-5, 5]}
              ticks={[-5, -3, 0, 3, 5]}
              tick={{ fontSize: 12 }}
              stroke="var(--tg-theme-hint-color)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tg-theme-bg-color)',
                border: '1px solid var(--tg-theme-hint-color)',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--tg-theme-button-color)"
              strokeWidth={2}
              dot={{ fill: 'var(--tg-theme-button-color)', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartMobile;
