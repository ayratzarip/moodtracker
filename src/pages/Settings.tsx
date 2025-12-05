import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { storageService } from '../services/storage';
import { setupReminder } from '../services/notifications';

interface SettingsProps {
  isOnboarding?: boolean;
  onComplete?: () => void;
}

const Settings = ({ isOnboarding = false, onComplete }: SettingsProps) => {
  const [time, setTime] = useState('20:00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await storageService.getUserSettings();
      setTime(settings.reminderTime);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tg = window.Telegram?.WebApp;
      const userId = tg?.initDataUnsafe?.user?.id || 0;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Save settings to CloudStorage
      await storageService.saveUserSettings({
        reminderTime: time,
        onboarded: true,
      });

      // Send to Google Apps Script
      try {
        await setupReminder({
          chatId: userId,
          time: time,
          timezone: timezone,
        });
      } catch (error) {
        console.error('Error setting up reminder:', error);
        // Continue anyway - user can retry later
      }

      if (isOnboarding && onComplete) {
        onComplete();
      } else {
        alert('Настройки сохранены!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Напоминания" showNav={!isOnboarding}>
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
          <p className="tg-text">Загрузка...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isOnboarding ? 'Добро пожаловать' : 'Напоминания'} showNav={!isOnboarding}>
      <div className="flex flex-col items-center justify-between min-h-[calc(100vh-140px)] py-8 px-6">
        <div className="w-full max-w-md">
          {isOnboarding && (
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tg-text mb-4">
                Настройка напоминаний
              </h2>
              <p className="tg-hint">
                Выберите время, когда вы хотите получать ежедневное напоминание
                об оценке настроения
              </p>
            </div>
          )}

          <div className="tg-bg-secondary rounded-lg p-6 mb-6">
            <label className="block mb-3">
              <span className="tg-text font-medium">Время напоминания</span>
              <p className="tg-hint text-sm mt-1 mb-3">
                Вы будете получать сообщение каждый день в это время
              </p>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg tg-bg border border-gray-300 tg-text text-lg focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="tg-bg-secondary rounded-lg p-4 mb-6">
            <p className="text-sm tg-hint">
              💡 <strong>Совет:</strong> Выбирайте время вечером, когда вы можете
              спокойно оценить прошедший день.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full tg-button py-4 rounded-lg text-lg font-medium shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
