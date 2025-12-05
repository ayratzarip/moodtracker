import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MoodSlider from '../components/ui/MoodSlider';
import { storageService } from '../services/storage';
import { MoodEntry } from '../types';

const InputWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(0);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExistingEntry();
  }, []);

  const loadExistingEntry = async () => {
    try {
      const entry = await storageService.getTodayEntry();
      if (entry) {
        setScore(entry.score);
        setNote(entry.note);
      }
    } catch (error) {
      console.error('Error loading entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleSave = async () => {
    try {
      const entry: MoodEntry = {
        score,
        note,
        timestamp: Date.now(),
      };
      await storageService.saveTodayEntry(entry);
      navigate('/');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Ошибка при сохранении данных');
    }
  };

  if (loading) {
    return (
      <Layout title="Оценка дня" showNav={false}>
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
          <p className="tg-text">Загрузка...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={step === 1 ? 'Оценка' : 'Примечание'} showNav={false}>
      <div className="flex flex-col items-center justify-between min-h-[calc(100vh-140px)] py-8">
        {step === 1 ? (
          <>
            <div className="w-full flex-1 flex items-center">
              <MoodSlider value={score} onChange={setScore} />
            </div>
            <div className="w-full px-6">
              <button
                onClick={handleNext}
                className="w-full tg-button py-4 rounded-lg text-lg font-medium shadow-lg transition-transform active:scale-95"
              >
                Далее
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-full flex-1 px-6">
              <p className="tg-hint text-sm mb-4">
                Добавьте заметку о дне (необязательно)
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Что произошло сегодня? Какие события или чувства повлияли на ваше настроение?"
                className="w-full h-64 p-4 rounded-lg tg-bg-secondary tg-text border border-gray-300 focus:outline-none focus:border-blue-500 resize-none"
                maxLength={500}
              />
              <p className="text-xs tg-hint text-right mt-2">
                {note.length}/500
              </p>
            </div>
            <div className="w-full px-6 space-y-3">
              <button
                onClick={handleSave}
                className="w-full tg-button py-4 rounded-lg text-lg font-medium shadow-lg transition-transform active:scale-95"
              >
                Сохранить
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full tg-bg-secondary tg-text py-3 rounded-lg font-medium"
              >
                Назад
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default InputWizard;
