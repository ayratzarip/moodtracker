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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
      {/* Hours picker */}
      <div style={{ position: 'relative', width: '80px' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            height: '2px',
            backgroundColor: 'var(--tgui--separator_common)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
        <div
          ref={hoursRef}
          onScroll={handleHoursScroll}
          style={{
            overflowY: 'scroll',
            height: `${visibleItems * itemHeight}px`,
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="scrollbar-hide"
        >
          <div style={{ height: `${(visibleItems - 1) / 2 * itemHeight}px` }} />
          {hoursArray.map((h) => {
            const isSelected = h === hours;
            return (
              <div
                key={h}
                onClick={() => handleHourClick(h)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: `${itemHeight}px`,
                  cursor: 'pointer',
                  scrollSnapAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <span
                  style={{
                    fontSize: isSelected ? '48px' : '24px',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    color: isSelected ? 'var(--tgui--text_color)' : 'var(--tgui--hint_color)',
                    transition: 'all 0.2s',
                  }}
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
      <div
        style={{
          fontSize: '32px',
          color: 'var(--tgui--text_color)',
          fontWeight: 'bold',
        }}
      >
        :
      </div>

      {/* Minutes picker */}
      <div style={{ position: 'relative', width: '80px' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            height: '2px',
            backgroundColor: 'var(--tgui--separator_common)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
        <div
          ref={minutesRef}
          onScroll={handleMinutesScroll}
          style={{
            overflowY: 'scroll',
            height: `${visibleItems * itemHeight}px`,
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="scrollbar-hide"
        >
          <div style={{ height: `${(visibleItems - 1) / 2 * itemHeight}px` }} />
          {minutesArray.map((m) => {
            const isSelected = m === minutes;
            return (
              <div
                key={m}
                onClick={() => handleMinuteClick(m)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: `${itemHeight}px`,
                  cursor: 'pointer',
                  scrollSnapAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <span
                  style={{
                    fontSize: isSelected ? '48px' : '24px',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    color: isSelected ? 'var(--tgui--text_color)' : 'var(--tgui--hint_color)',
                    transition: 'all 0.2s',
                  }}
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

