import { useState, useRef, useEffect, ReactNode } from 'react';

interface ChartZoomPanProps {
  children: ReactNode;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
}

const ChartZoomPan = ({ 
  children, 
  minScale = 0.5, 
  maxScale = 3, 
  initialScale = 1 
}: ChartZoomPanProps) => {
  const [scale, setScale] = useState(initialScale);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (e.button === 0) { // Левая кнопка мыши
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX - translate.x, y: e.clientY - translate.y });
    }
  };


  // Обработка touch событий для мобильных устройств
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      // Один палец - начало панорамирования
      setIsPanning(true);
      setLastPanPoint({
        x: e.touches[0].clientX - translate.x,
        y: e.touches[0].clientY - translate.y,
      });
    } else if (e.touches.length === 2) {
      // Два пальца - начало масштабирования
      setIsPanning(false);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isPanning) {
      // Один палец - панорамирование
      setTranslate({
        x: e.touches[0].clientX - lastPanPoint.x,
        y: e.touches[0].clientY - lastPanPoint.y,
      });
    } else if (e.touches.length === 2 && lastTouchDistance !== null) {
      // Два пальца - масштабирование
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
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
          y: e.clientY - lastPanPoint.y,
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

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: isPanning || lastTouchDistance !== null ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {children}
      </div>
      
      {/* Индикатор масштаба */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default ChartZoomPan;
