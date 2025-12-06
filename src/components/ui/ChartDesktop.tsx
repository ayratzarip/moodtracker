import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { MoodEntry } from '../../types';

interface ChartDesktopProps {
  data: Record<string, MoodEntry>;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as { date: string; score: number; fullDate: string; note: string };
    return (
      <div className="tg-bg-secondary border border-border rounded-lg p-4 shadow-lg max-w-xs">
        <p className="font-semibold tg-text mb-2">{data.fullDate}</p>
        <p className="tg-text mb-2">
          Оценка: <span className="font-bold">{data.score > 0 ? '+' : ''}{data.score}</span>
        </p>
        {data.note && (
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-sm tg-hint font-semibold mb-1">Примечание:</p>
            <p className="text-sm tg-text">{data.note}</p>
          </div>
        )}
      </div>
    );
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
    <div className="tg-bg-secondary rounded-lg p-6">
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 14 }}
            stroke="var(--text-muted)"
          />
          <YAxis
            domain={[-5, 5]}
            ticks={[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
            tick={{ fontSize: 14 }}
            stroke="var(--text-muted)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--primary)"
            strokeWidth={3}
            dot={{ fill: 'var(--primary)', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartDesktop;
