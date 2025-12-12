import { TooltipProps } from 'recharts';
import { MoodEntry } from '../../types';
import ChartWithFixedYAxis from './ChartWithFixedYAxis';

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

      <ChartWithFixedYAxis
        chartData={chartData}
        isMobile={true}
        CustomTooltip={CustomTooltip}
        minScale={0.5}
        maxScale={3}
        initialScale={1}
      />
      
      <div className="card mt-2">
        <p className="text-caption text-center">
          💡 Используйте жесты для масштабирования (pinch) и перемещения графика (swipe)
        </p>
      </div>
    </div>
  );
};

export default ChartMobile;
