import { TooltipProps } from 'recharts';
import { MoodEntry } from '../../types';
import ChartWithFixedYAxis from './ChartWithFixedYAxis';

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
    <>
      <ChartWithFixedYAxis
        chartData={chartData}
        isMobile={false}
        CustomTooltip={CustomTooltip}
        minScale={0.5}
        maxScale={4}
        initialScale={1}
      />
      
      <div className="card mt-2">
        <p className="text-caption text-center">
          💡 Используйте колесо мыши для масштабирования, зажмите левую кнопку мыши для перемещения графика
        </p>
      </div>
    </>
  );
};

export default ChartDesktop;
