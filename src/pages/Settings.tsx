import { useState, useEffect } from 'react';
import { Spinner } from '@telegram-apps/telegram-ui';
import Layout from '../components/layout/Layout';
import TimePicker from '../components/ui/TimePicker';
import { storageService } from '../services/storage';
import { setupReminder } from '../services/notifications';
import type { HomeScreenStatus } from '../services/storage';
import { hapticFeedback, getBackButton, getMainButton } from '../utils/telegram';

interface SettingsProps {
  isOnboarding?: boolean;
  onComplete?: () => void;
}

const Settings = ({ isOnboarding = false, onComplete }: SettingsProps) => {
  const [time, setTime] = useState('20:00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homeScreenStatus, setHomeScreenStatus] = useState<HomeScreenStatus | null>(null);

  useEffect(() => {
    loadSettings();
    checkHomeScreenStatus();
    
    // Скрываем BackButton и MainButton на странице настроек
    const backButton = getBackButton();
    const mainButton = getMainButton();
    if (backButton?.hide) backButton.hide();
    if (mainButton?.hide) mainButton.hide();
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

  const checkHomeScreenStatus = () => {
    const tg = window.Telegram?.WebApp;
    if (tg?.checkHomeScreenStatus) {
      tg.checkHomeScreenStatus((status: HomeScreenStatus) => {
        setHomeScreenStatus(status);
        console.log('HomeScreen status:', status);
      });
    }
  };

  const handleAddToHomeScreen = () => {
    hapticFeedback('impact', { style: 'medium' });
    const tg = window.Telegram?.WebApp;
    if (tg?.addToHomeScreen) {
      tg.addToHomeScreen();
    } else {
      hapticFeedback('notification', { notificationType: 'error' });
      alert('Функция добавления на главный экран недоступна в вашей версии Telegram.');
    }
  };

  // Подписываемся на событие успешного добавления
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.onEvent) {
      const handleHomeScreenAdded = () => {
        setHomeScreenStatus('added');
        console.log('Mini App успешно добавлена на главный экран');
      };

      tg.onEvent('homeScreenAdded', handleHomeScreenAdded);

      return () => {
        if (tg.offEvent) {
          tg.offEvent('homeScreenAdded', handleHomeScreenAdded);
        }
      };
    }
  }, []);

  const handleSave = async () => {
    hapticFeedback('impact', { style: 'medium' });
    setSaving(true);
    try {
      const tg = window.Telegram?.WebApp;
      const userId = tg?.initDataUnsafe?.user?.id;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Проверяем, что userId получен
      if (!userId) {
        console.error('User ID not available. Telegram WebApp may not be initialized.');
        hapticFeedback('notification', { notificationType: 'error' });
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
        hapticFeedback('notification', { notificationType: 'success' });
      } catch (error) {
        console.error('Error setting up reminder:', error);
        hapticFeedback('notification', { notificationType: 'warning' });
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
      hapticFeedback('notification', { notificationType: 'error' });
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

        {/* Кнопка добавления на главный экран */}
        {homeScreenStatus !== null && homeScreenStatus !== 'added' && homeScreenStatus !== 'unsupported' && (
          <div className="card-lg">
            <h3 className="text-h2 text-gray-0 dark:text-gray-100 mb-2">
              Добавить на главный экран
            </h3>
            <p className="text-caption mb-4">
              Добавьте приложение на главный экран для быстрого доступа
            </p>
            <button
              onClick={handleAddToHomeScreen}
              className="btn-secondary w-full"
            >
              📱 Добавить на главный экран
            </button>
          </div>
        )}

        {homeScreenStatus === 'added' && (
          <div className="card">
            <p className="text-caption text-center">
              ✅ Приложение уже добавлено на главный экран
            </p>
          </div>
        )}

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
