import { useState, useRef, useEffect, ReactNode } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';

interface ChartWithFixedYAxisProps {
  chartData: Array<{ date: string; score: number; note: string; fullDate?: string }>;
  isMobile: boolean;
  CustomTooltip: (props: TooltipProps<number, string>) => ReactNode;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
}

const ChartWithFixedYAxis = ({
  chartData,
  isMobile,
  CustomTooltip,
  minScale = 0.5,
  maxScale = 3,
  initialScale = 1,
}: ChartWithFixedYAxisProps) => {
  const [scale, setScale] = useState(initialScale);
  const [translate, setTranslate] = useState({ x: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const chartAreaRef = useRef<HTMLDivElement>(null);
  const Y_AXIS_WIDTH = 60; // Ширина области для оси Y

  // Обработка колеса мыши для масштабирования (десктоп)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => {
      const newScale = Math.max(minScale, Math.min(maxScale, prev * delta));
      return newScale;
    });
  };

  // Обработка начала панорамирования (десктоп - мышь)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0 && e.clientX > Y_AXIS_WIDTH) { // Левая кнопка мыши и клик справа от оси Y
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX - translate.x });
    }
  };

  // Обработка touch событий для мобильных устройств
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && e.touches[0].clientX > Y_AXIS_WIDTH) {
      // Один палец - начало панорамирования (только справа от оси Y)
      setIsPanning(true);
      setLastPanPoint({
        x: e.touches[0].clientX - translate.x,
      });
    } else if (e.touches.length === 2) {
      // Два пальца - начало масштабирования (только горизонтальное)
      setIsPanning(false);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.abs(touch2.clientX - touch1.clientX);
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isPanning) {
      // Один палец - панорамирование (только горизонтальное)
      setTranslate({
        x: e.touches[0].clientX - lastPanPoint.x,
      });
    } else if (e.touches.length === 2 && lastTouchDistance !== null) {
      // Два пальца - масштабирование (только горизонтальное)
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.abs(touch2.clientX - touch1.clientX);
      
      const scaleChange = distance / lastTouchDistance;
      setScale(prev => {
        const newScale = Math.max(minScale, Math.min(maxScale, prev * scaleChange));
        return newScale;
      });
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setLastTouchDistance(null);
  };

  // Подписка на глобальные события мыши для панорамирования
  useEffect(() => {
    if (isPanning) {
      const mouseMoveHandler = (e: MouseEvent) => {
        setTranslate({
          x: e.clientX - lastPanPoint.x,
        });
      };

      const mouseUpHandler = () => {
        setIsPanning(false);
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      return () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
    }
  }, [isPanning, lastPanPoint]);

  const chartHeight = isMobile ? 300 : 500;
  const chartMinWidth = isMobile ? 600 : chartData.length * 60;

  return (
    <div className="relative w-full" style={{ height: `${chartHeight}px` }}>
      {/* Масштабируемая и перемещаемая область графика */}
      <div
        ref={chartAreaRef}
        className="absolute left-0 top-0 bottom-0 right-0"
        style={{ 
          cursor: isPanning ? 'grabbing' : 'grab'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            transform: `translateX(${translate.x}px) scaleX(${scale})`,
            transformOrigin: `${Y_AXIS_WIDTH}px 0`,
            height: '100%',
            transition: isPanning || lastTouchDistance !== null ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          <div style={{ width: '100%', minWidth: `${chartMinWidth}px`, height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: Y_AXIS_WIDTH, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="hsl(0, 0%, 85%)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: isMobile ? 12 : 14, fill: 'hsl(0, 0%, 60%)' }}
                  stroke="hsl(0, 0%, 85%)"
                />
                <YAxis
                  domain={[-5, 5]}
                  ticks={isMobile ? [-5, -3, 0, 3, 5] : [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
                  tick={{ fontSize: isMobile ? 12 : 14, fill: 'hsl(0, 0%, 60%)' }}
                  stroke="hsl(0, 0%, 85%)"
                  tickFormatter={(value) => value > 0 ? `+${value}` : value.toString()}
                  width={Y_AXIS_WIDTH}
                />
                <Tooltip content={CustomTooltip} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(222, 76%, 70%)"
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{ fill: 'hsl(222, 76%, 70%)', r: isMobile ? 4 : 5 }}
                  activeDot={{ r: isMobile ? 5 : 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Фиксированная ось Y (накладывается поверх) */}
      <div 
        className="absolute left-0 top-0 bottom-0 z-10"
        style={{ 
          width: `${Y_AXIS_WIDTH}px`,
          pointerEvents: 'none',
          background: 'var(--tg-theme-bg-color, #ffffff)'
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <YAxis
              domain={[-5, 5]}
              ticks={isMobile ? [-5, -3, 0, 3, 5] : [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]}
              tick={{ fontSize: isMobile ? 12 : 14, fill: 'hsl(0, 0%, 60%)' }}
              stroke="hsl(0, 0%, 85%)"
              tickFormatter={(value) => value > 0 ? `+${value}` : value.toString()}
              width={Y_AXIS_WIDTH}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Индикатор масштаба */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-20">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default ChartWithFixedYAxis;
