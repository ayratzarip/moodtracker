import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Section } from '@telegram-apps/telegram-ui';
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
          <Spinner size="l" />
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
              <Button
                size="l"
                mode="filled"
                stretched
                onClick={handleNext}
              >
                Далее
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-full flex-1 px-6">
              <Section header="Добавьте заметку о дне (необязательно)">
                <textarea
                  placeholder="Что произошло сегодня? Какие события или чувства повлияли на ваше настроение?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={500}
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    backgroundColor: 'var(--tgui--field_background)',
                    color: 'var(--tgui--text_color)',
                    border: 'none',
                    borderRadius: '12px',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <p className="text-xs text-right mt-2" style={{ color: 'var(--tgui--hint_color)' }}>
                  {note.length}/500
                </p>
              </Section>
            </div>
            <div className="w-full px-6 space-y-3">
              <Button
                size="l"
                mode="filled"
                stretched
                onClick={handleSave}
              >
                Сохранить
              </Button>
              <Button
                size="m"
                mode="outline"
                stretched
                onClick={() => setStep(1)}
              >
                Назад
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default InputWizard;
