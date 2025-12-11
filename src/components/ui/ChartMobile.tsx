import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Brush } from 'recharts';
import { MoodEntry } from '../../types';

interface ChartMobileProps {
  data: Record<string, MoodEntry>;
}

interface ChartDataPoint {
  date: string;
  fullDate: string;
  score: number;
  note: string;
  originalDate: string;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    return (
      <div className="card max-w-xs">
        <p className="text-body text-gray-0 dark:text-gray-100 mb-1">
          <strong>{data.fullDate}</strong>
        </p>
        <p className="text-body text-gray-0 dark:text-gray-100">
          Настроение: <strong>{data.score > 0 ? '+' : ''}{data.score}</strong>
        </p>
        {data.note && (
          <p className="text-caption text-gray-0 dark:text-gray-100 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {data.note}
          </p>
        )}
      </div>
    );
  }
  return null;
};

type ZoomPeriod = 7 | 14 | 30 | 'all';

const ChartMobile = ({ data }: ChartMobileProps) => {
  const [zoomPeriod, setZoomPeriod] = useState<ZoomPeriod>(30);
  const [brushIndex, setBrushIndex] = useState<[number, number] | null>(null);

  const chartData = useMemo(() => {
    return Object.entries(data)
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
        originalDate: date,
      }));
  }, [data]);

  // Вычисляем видимый диапазон данных
  const visibleData = useMemo(() => {
    if (zoomPeriod === 'all') {
      return chartData;
    }

    const today = new Date();
    const daysAgo = new Date(today);
    daysAgo.setDate(today.getDate() - zoomPeriod);

    return chartData.filter(item => new Date(item.originalDate) >= daysAgo);
  }, [chartData, zoomPeriod]);

  // Если используется Brush, применяем его фильтр
  const displayData = useMemo(() => {
    if (brushIndex === null) {
      return visibleData;
    }

    const [start, end] = brushIndex;
    const startIdx = Math.floor(start);
    const endIdx = Math.ceil(end);
    return visibleData.slice(Math.max(0, startIdx), Math.min(visibleData.length, endIdx + 1));
  }, [visibleData, brushIndex]);

  const handleZoomChange = (period: ZoomPeriod) => {
    setZoomPeriod(period);
    setBrushIndex(null);
  };

  const handleBrushChange = (brush: { startIndex?: number; endIndex?: number }) => {
    if (brush.startIndex !== undefined && brush.endIndex !== undefined) {
      setBrushIndex([brush.startIndex, brush.endIndex]);
    }
  };

  if (chartData.length === 0) {
    return <div className="text-center text-caption">Нет данных для отображения</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="card">
        <p className="text-caption text-center">
          📱 Для детального анализа и удобного просмотра откройте Telegram на компьютере
        </p>
      </div>

      {/* Кнопки управления масштабом */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleZoomChange(7)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            zoomPeriod === 7
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          7 дней
        </button>
        <button
          onClick={() => handleZoomChange(14)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            zoomPeriod === 14
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          14 дней
        </button>
        <button
          onClick={() => handleZoomChange(30)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            zoomPeriod === 30
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          30 дней
        </button>
        <button
          onClick={() => handleZoomChange('all')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            zoomPeriod === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Все
        </button>
      </div>

      {/* Основной график */}
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="hsl(0, 0%, 85%)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(0, 0%, 60%)' }}
              stroke="hsl(0, 0%, 85%)"
              angle={-45}
              textAnchor="end"
              height={60}
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
              activeDot={{ r: 6 }}
            />
            {/* Brush для панорамирования */}
            {visibleData.length > 7 && (
              <Brush
                dataKey="date"
                height={25}
                stroke="hsl(222, 76%, 70%)"
                fill="hsl(222, 76%, 50%)"
                opacity={0.3}
                onChange={handleBrushChange}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartMobile;
