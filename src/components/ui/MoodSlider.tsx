import { useState, useEffect, useRef } from 'react';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const MoodSlider = ({ value, onChange }: MoodSliderProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 80; // Высота одного элемента
  const visibleItems = 5; // Количество видимых элементов (центральный + по 2 с каждой стороны)

  const values = Array.from({ length: 11 }, (_, i) => i - 5); // От -5 до +5

  useEffect(() => {
    setCurrentValue(value);
    scrollToValue(value);
  }, [value]);

  const scrollToValue = (val: number) => {
    if (scrollContainerRef.current) {
      const index = values.indexOf(val);
      const scrollPosition = index * itemHeight;
      scrollContainerRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const newValue = values[Math.max(0, Math.min(index, values.length - 1))];
      
      if (newValue !== currentValue) {
        setCurrentValue(newValue);
        onChange(newValue);
      }
    }
  };

  const handleItemClick = (val: number) => {
    setCurrentValue(val);
    onChange(val);
    scrollToValue(val);
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-xs">
        {/* Центральная линия-индикатор */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-300 z-10 pointer-events-none" />
        
        {/* Контейнер с прокруткой */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{
            height: `${visibleItems * itemHeight}px`,
            scrollSnapType: 'y mandatory',
          }}
        >
          {/* Верхний отступ для центрирования */}
          <div style={{ height: `${(visibleItems - 1) / 2 * itemHeight}px` }} />
          
          {/* Элементы с цифрами */}
          {values.map((val) => {
            const isSelected = val === currentValue;
            return (
              <div
                key={val}
                onClick={() => handleItemClick(val)}
                className="flex items-center justify-center cursor-pointer snap-center transition-all duration-200"
                style={{ height: `${itemHeight}px` }}
              >
                <span
                  className={`font-medium transition-all duration-200 ${
                    isSelected
                      ? 'text-6xl text-black font-bold'
                      : 'text-2xl text-gray-400'
                  }`}
                >
                  {val > 0 ? `+${val}` : val}
                </span>
              </div>
            );
          })}
          
          {/* Нижний отступ для центрирования */}
          <div style={{ height: `${(visibleItems - 1) / 2 * itemHeight}px` }} />
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MoodSlider;
