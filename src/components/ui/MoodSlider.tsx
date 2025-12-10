import { useState, useEffect, useRef } from 'react';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const MoodSlider = ({ value, onChange }: MoodSliderProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const itemHeight = 80; // Высота одного элемента
  const visibleItems = 5; // Количество видимых элементов (центральный + по 2 с каждой стороны)

  // Положительные вверху, отрицательные внизу: +5, +4, ..., 0, ..., -4, -5
  const values = Array.from({ length: 11 }, (_, i) => 5 - i); // От +5 до -5

  // Описания для каждой оценки
  const descriptions: Record<string, string> = {
    '5': 'Психоз, потеря контроля, нет сна. Нужен врач.',
    '4': '«Вершина мира», риск, агрессия, почти нет сна.',
    '3': 'Скачка идей, куча начатых дел, раздражительность.',
    '2': 'Отличное настроение, супер-продуктивность (Гипомания).',
    '1': 'Просто хороший, энергичный день.',
    '0': 'Ровное, сбалансированное состояние.',
    '-1': 'Легкая грусть, усталость, «садится батарейка».',
    '-2': 'Все «через силу», не хочется общаться, чувство вины.',
    '-3': 'Сил хватает только поесть/умыться. Безнадежность.',
    '-4': 'Невозможно встать с постели. Мысли о смерти.',
    '-5': 'Ступор или невыносимая боль. Планы суицида. Нужен врач.',
  };

  useEffect(() => {
    setCurrentValue(value);
    // При первом рендере используем 'auto' для мгновенной прокрутки
    // При последующих изменениях используем 'smooth'
    if (!isInitializedRef.current) {
      // Небольшая задержка для гарантии, что DOM готов
      setTimeout(() => {
        scrollToValue(value, 'auto');
        isInitializedRef.current = true;
      }, 0);
    } else {
      scrollToValue(value, 'smooth');
    }
  }, [value]);

  const scrollToValue = (val: number, behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      const index = values.indexOf(val);
      const scrollPosition = index * itemHeight;
      scrollContainerRef.current.scrollTo({
        top: scrollPosition,
        behavior,
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
        {/* Квадратное окошко для выбранного значения */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-20 bg-transparent rounded-xl border-2 border-gray-85 dark:border-gray-35 z-10 pointer-events-none" />
        
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
                className="flex items-center cursor-pointer snap-center transition-all duration-200 px-4"
                style={{ height: `${itemHeight}px` }}
              >
                <span
                  className={`font-medium transition-all duration-200 flex-shrink-0 ${
                    isSelected
                      ? 'text-6xl text-gray-0 dark:text-gray-100 font-bold'
                      : 'text-2xl text-gray-60 dark:text-gray-60'
                  }`}
                  style={{ width: '80px' }}
                >
                  {val > 0 ? `+${val}` : val}
                </span>
                {isSelected && (
                  <span className="text-caption text-gray-60 dark:text-gray-60 ml-3 flex-1">
                    {descriptions[val.toString()]}
                  </span>
                )}
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
