import { useState, useEffect, useRef } from 'react';

interface TimePickerProps {
  value: string; // Format: "HH:MM"
  onChange: (value: string) => void;
}

const TimePicker = ({ value, onChange }: TimePickerProps) => {
  const [hours, setHours] = useState(20);
  const [minutes, setMinutes] = useState(0);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const itemHeight = 60;
  const visibleItems = 5;

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    const [h, m] = value.split(':').map(Number);
    setHours(h);
    setMinutes(m);
    scrollToValue(hoursRef.current, h, itemHeight);
    scrollToValue(minutesRef.current, m, itemHeight);
  }, [value]);

  const scrollToValue = (container: HTMLDivElement | null, val: number, height: number) => {
    if (container) {
      const scrollPosition = val * height;
      container.scrollTo({
        top: scrollPosition,
        behavior: 'auto',
      });
    }
  };

  const handleHoursScroll = () => {
    if (hoursRef.current) {
      const scrollTop = hoursRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const newHours = Math.max(0, Math.min(index, 23));
      if (newHours !== hours) {
        setHours(newHours);
        onChange(`${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
      }
    }
  };

  const handleMinutesScroll = () => {
    if (minutesRef.current) {
      const scrollTop = minutesRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const newMinutes = Math.max(0, Math.min(index, 59));
      if (newMinutes !== minutes) {
        setMinutes(newMinutes);
        onChange(`${String(hours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`);
      }
    }
  };

  const handleHourClick = (h: number) => {
    setHours(h);
    onChange(`${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    scrollToValue(hoursRef.current, h, itemHeight);
  };

  const handleMinuteClick = (m: number) => {
    setMinutes(m);
    onChange(`${String(hours).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    scrollToValue(minutesRef.current, m, itemHeight);
  };

  return (
    <div className="flex justify-center items-center gap-5 py-5">
      {/* Hours picker */}
      <div className="relative w-20">
        {/* Прямоугольное окошко для выбранного значения */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 bg-transparent rounded-xl border-2 border-gray-85 dark:border-gray-35 z-10 pointer-events-none" />
        <div
          ref={hoursRef}
          onScroll={handleHoursScroll}
          className="overflow-y-scroll scrollbar-hide"
          style={{
            height: `${visibleItems * itemHeight}px`,
            scrollSnapType: 'y mandatory',
          }}
        >
          <div style={{ height: `${(visibleItems - 1) / 2 * itemHeight}px` }} />
          {hoursArray.map((h) => {
            const isSelected = h === hours;
            return (
              <div
                key={h}
                onClick={() => handleHourClick(h)}
                className="flex items-center justify-center cursor-pointer snap-center transition-all duration-200"
                style={{ height: `${itemHeight}px` }}
              >
                <span
                  className={`transition-all duration-200 ${
                    isSelected
                      ? 'text-5xl font-bold text-gray-0 dark:text-gray-100'
                      : 'text-2xl font-normal text-gray-60 dark:text-gray-60'
                  }`}
                >
                  {String(h).padStart(2, '0')}
                </span>
              </div>
            );
          })}
          <div style={{ height: `${(visibleItems - 1) / 2 * itemHeight}px` }} />
        </div>
      </div>

      {/* Separator */}
      <div className="text-3xl font-bold text-gray-0 dark:text-gray-100">
        :
      </div>

      {/* Minutes picker */}
      <div className="relative w-20">
        {/* Прямоугольное окошко для выбранного значения */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 bg-transparent rounded-xl border-2 border-gray-85 dark:border-gray-35 z-10 pointer-events-none" />
        <div
          ref={minutesRef}
          onScroll={handleMinutesScroll}
          className="overflow-y-scroll scrollbar-hide"
          style={{
            height: `${visibleItems * itemHeight}px`,
            scrollSnapType: 'y mandatory',
          }}
        >
          <div style={{ height: `${(visibleItems - 1) / 2 * itemHeight}px` }} />
          {minutesArray.map((m) => {
            const isSelected = m === minutes;
            return (
              <div
                key={m}
                onClick={() => handleMinuteClick(m)}
                className="flex items-center justify-center cursor-pointer snap-center transition-all duration-200"
                style={{ height: `${itemHeight}px` }}
              >
                <span
                  className={`transition-all duration-200 ${
                    isSelected
                      ? 'text-5xl font-bold text-gray-0 dark:text-gray-100'
                      : 'text-2xl font-normal text-gray-60 dark:text-gray-60'
                  }`}
                >
                  {String(m).padStart(2, '0')}
                </span>
              </div>
            );
          })}
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

export default TimePicker;

