import { useState } from 'react';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const MoodSlider = ({ value, onChange }: MoodSliderProps) => {
  const [currentValue, setCurrentValue] = useState(value);

  const moodLabels: Record<string, { label: string; emoji: string; color: string }> = {
    '-5': { label: 'Тяжелая депрессия', emoji: '😞', color: 'text-red-600' },
    '-4': { label: 'Сильная депрессия', emoji: '😔', color: 'text-red-500' },
    '-3': { label: 'Депрессия', emoji: '😟', color: 'text-orange-600' },
    '-2': { label: 'Легкая депрессия', emoji: '😕', color: 'text-orange-500' },
    '-1': { label: 'Немного грустно', emoji: '🙁', color: 'text-yellow-600' },
    '0': { label: 'Ровное состояние', emoji: '😐', color: 'text-gray-600' },
    '1': { label: 'Хорошо', emoji: '🙂', color: 'text-green-600' },
    '2': { label: 'Приподнятое', emoji: '😊', color: 'text-green-500' },
    '3': { label: 'Отлично', emoji: '😄', color: 'text-blue-600' },
    '4': { label: 'Эйфория', emoji: '😃', color: 'text-blue-500' },
    '5': { label: 'Мания/Гипомания', emoji: '🤩', color: 'text-purple-600' },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setCurrentValue(newValue);
    onChange(newValue);
  };

  const mood = moodLabels[currentValue.toString()];

  return (
    <div className="w-full px-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{mood.emoji}</div>
        <div className={`text-2xl font-bold mb-2 ${mood.color}`}>
          {currentValue > 0 ? '+' : ''}{currentValue}
        </div>
        <div className="text-lg tg-text">{mood.label}</div>
      </div>

      <div className="relative mb-4">
        <input
          type="range"
          min="-5"
          max="5"
          step="1"
          value={currentValue}
          onChange={handleChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right,
              #dc2626 0%,
              #ea580c 20%,
              #ca8a04 40%,
              #6b7280 50%,
              #16a34a 60%,
              #2563eb 80%,
              #9333ea 100%)`
          }}
        />
      </div>

      <div className="flex justify-between text-xs tg-hint px-1">
        <span>-5</span>
        <span>-3</span>
        <span>0</span>
        <span>+3</span>
        <span>+5</span>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default MoodSlider;
