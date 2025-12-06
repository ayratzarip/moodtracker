import { useState, useEffect } from 'react';
import { Button, Section, Spinner, Placeholder } from '@telegram-apps/telegram-ui';
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
          <Spinner size="l" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={isOnboarding ? 'Добро пожаловать' : 'Напоминания'} showNav={!isOnboarding}>
      <div className="flex flex-col justify-between min-h-[calc(100vh-140px)] py-8 px-6">
        <div className="w-full">
          {isOnboarding && (
            <Placeholder
              header="Настройка напоминаний"
              description="Выберите время, когда вы хотите получать ежедневное напоминание об оценке настроения"
            />
          )}

          <Section
            header="Время напоминания"
            footer="Вы будете получать сообщение каждый день в это время"
          >
            <TimePicker value={time} onChange={setTime} />
          </Section>

          <Section>
            <div style={{ padding: '12px', color: 'var(--tgui--hint_color)', fontSize: '14px' }}>
              💡 <strong>Совет:</strong> Выбирайте время вечером, когда вы можете
              спокойно оценить прошедший день.
            </div>
          </Section>
        </div>

        <div className="w-full px-6" style={{ paddingBottom: '20px' }}>
          <Button
            size="l"
            mode="filled"
            stretched
            onClick={handleSave}
            loading={saving}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
