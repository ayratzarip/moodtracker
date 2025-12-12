import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@telegram-apps/telegram-ui';
import Layout from '../components/layout/Layout';
import MoodSlider from '../components/ui/MoodSlider';
import { storageService } from '../services/storage';
import { MoodEntry } from '../types';
import { hapticFeedback, getBackButton, getMainButton } from '../utils/telegram';

const InputWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(0);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExistingEntry();
  }, []);

  const handleNext = useCallback(() => {
    hapticFeedback('impact', { style: 'light' });
    setStep(2);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      hapticFeedback('notification', { notificationType: 'success' });
      const entry: MoodEntry = {
        score,
        note,
        timestamp: Date.now(),
      };
      await storageService.saveTodayEntry(entry);
      navigate('/');
    } catch (error) {
      console.error('Error saving entry:', error);
      hapticFeedback('notification', { notificationType: 'error' });
      alert('Ошибка при сохранении данных');
    }
  }, [score, note, navigate]);

  const handleBack = useCallback(() => {
    hapticFeedback('impact', { style: 'light' });
    setStep(1);
  }, []);

  // Управление BackButton и MainButton
  useEffect(() => {
    const backButton = getBackButton();
    const mainButton = getMainButton();
    let backHandler: (() => void) | null = null;
    let mainHandler: (() => void) | null = null;

    if (step === 1) {
      // Первый шаг - скрываем BackButton, показываем MainButton для "Далее"
      if (backButton?.hide) backButton.hide();
      
      if (mainButton) {
        if (mainButton.setText) mainButton.setText('Далее');
        mainHandler = handleNext;
        if (mainButton.onClick && mainHandler) {
          mainButton.onClick(mainHandler);
        }
        if (mainButton.show) mainButton.show();
        if (mainButton.enable) mainButton.enable();
      }
    } else {
      // Второй шаг - показываем BackButton, MainButton для "Сохранить"
      if (backButton) {
        if (backButton.show) backButton.show();
        backHandler = handleBack;
        if (backButton.onClick && backHandler) {
          backButton.onClick(backHandler);
        }
      }

      if (mainButton) {
        if (mainButton.setText) mainButton.setText('Сохранить');
        mainHandler = handleSave;
        if (mainButton.onClick && mainHandler) {
          mainButton.onClick(mainHandler);
        }
        if (mainButton.show) mainButton.show();
        if (mainButton.enable) mainButton.enable();
      }
    }

    // Cleanup
    return () => {
      if (backButton && backHandler) {
        if (backButton.offClick) backButton.offClick(backHandler);
        if (backButton.hide) backButton.hide();
      }
      if (mainButton && mainHandler) {
        if (mainButton.offClick) mainButton.offClick(mainHandler);
        if (mainButton.hide) mainButton.hide();
      }
    };
  }, [step, handleSave, handleBack, handleNext]);

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

  if (loading) {
    return (
      <Layout title="Оценка дня" showNav={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="l" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={step === 1 ? 'Оценка' : 'Примечание'} showNav={false}>
      <div className="flex flex-col gap-6 h-full">
        {step === 1 ? (
          <>
            <div className="card-lg flex-1 flex items-center justify-center">
              <MoodSlider value={score} onChange={setScore} />
            </div>
              <button
                onClick={handleNext}
                className="btn-primary w-full"
                onTouchStart={() => hapticFeedback('selection')}
              >
                Далее
              </button>
          </>
        ) : (
          <>
            <div className="card-lg flex-1">
              <h3 className="text-h2 text-gray-0 dark:text-gray-100 mb-4">
                Добавьте заметку о дне (необязательно)
              </h3>
              <textarea
                placeholder="Что произошло сегодня? Какие события или чувства повлияли на ваше настроение?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                rows={8}
                className="input w-full min-h-[200px]"
              />
              <p className="text-caption text-right mt-2">
                {note.length}/500
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSave}
                className="btn-primary w-full"
              >
                Сохранить
              </button>
              <button
                onClick={handleBack}
                className="btn-secondary w-full"
                onTouchStart={() => hapticFeedback('selection')}
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
