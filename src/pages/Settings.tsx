import { useState, useEffect } from 'react';
import { Spinner } from '@telegram-apps/telegram-ui';
import Layout from '../components/layout/Layout';
import TimePicker from '../components/ui/TimePicker';
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
      const userId = tg?.initDataUnsafe?.user?.id;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Проверяем, что userId получен
      if (!userId) {
        console.error('User ID not available. Telegram WebApp may not be initialized.');
        alert('Ошибка: не удалось получить ID пользователя. Убедитесь, что приложение открыто в Telegram.');
        return;
      }

      console.log('Setting up reminders for user:', userId, 'at time:', time);

      // Save settings to CloudStorage
      await storageService.saveUserSettings({
        reminderTime: time,
        onboarded: true,
      });

      // Отправка настроек напоминаний в Yandex Cloud
      try {
        await setupReminder({
          chatId: userId,
          time: time,
          timezone: timezone,
        });
        console.log('Reminders setup completed successfully');
      } catch (error) {
        console.error('Error setting up reminder:', error);
        // Показываем предупреждение, но продолжаем работу
        alert('Настройки сохранены, но возникла проблема с установкой напоминаний. Попробуйте сохранить еще раз.');
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
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="l" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isOnboarding ? 'Добро пожаловать' : 'Напоминания'} showNav={!isOnboarding}>
      <div className="flex flex-col gap-6">
        {isOnboarding && (
          <div className="card">
            <h2 className="text-h2 text-gray-0 dark:text-gray-100 mb-2">
              Настройка напоминаний
            </h2>
            <p className="text-caption">
              Выберите время, когда вы хотите получать ежедневное напоминание об оценке настроения
            </p>
          </div>
        )}

        <div className="card-lg">
          <h3 className="text-h2 text-gray-0 dark:text-gray-100 mb-2">
            Время напоминания
          </h3>
          <p className="text-caption mb-6">
            Вы будете получать сообщение каждый день в это время
          </p>
          <TimePicker value={time} onChange={setTime} />
        </div>

        <div className="card">
          <p className="text-caption">
            💡 <strong>Совет:</strong> Выбирайте время вечером, когда вы можете
            спокойно оценить прошедший день.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </Layout>
  );
};

export default Settings;
