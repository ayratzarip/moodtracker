import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Settings from './pages/Settings';
import ChartPage from './pages/ChartPage';
import Help from './pages/Help';
import InputWizard from './pages/InputWizard';
import { storageService } from './services/storage';

function App() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
    let cleanup: (() => void) | null = null;

    if (tg) {
      tg.ready();
      // Разворачиваем WebApp на весь экран для лучшего UX
      if (typeof tg.expand === 'function') {
        tg.expand();
      }

      // Подписываемся на события HomeScreen (Bot API 8.0+)
      if (tg.onEvent) {
        // Событие успешного добавления на главный экран
        const handleHomeScreenAdded = () => {
          console.log('Mini App успешно добавлена на главный экран');
        };

        // Событие проверки статуса главного экрана
        const handleHomeScreenChecked = (data: { status: string }) => {
          console.log('Статус главного экрана:', data.status);
        };

        tg.onEvent('homeScreenAdded', handleHomeScreenAdded);
        tg.onEvent('homeScreenChecked', handleHomeScreenChecked);

        // Сохраняем функцию очистки
        cleanup = () => {
          if (tg.offEvent) {
            tg.offEvent('homeScreenAdded', handleHomeScreenAdded);
            tg.offEvent('homeScreenChecked', handleHomeScreenChecked);
          }
        };
      }
    }

    // Check onboarding status
    storageService.getUserSettings()
      .then(settings => {
        setIsOnboarded(settings.onboarded);
      })
      .catch((error) => {
        console.error('Error loading user settings:', error);
        // If Telegram WebApp is not available, show error message
        if (error?.message?.includes('Telegram WebApp is not available')) {
          console.error('This app requires Telegram WebApp to run. Please open it in Telegram.');
        }
        setIsOnboarded(false);
      });

    // Возвращаем функцию очистки из useEffect
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  if (isOnboarded === null) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-95 dark:bg-brand-10">
        <div className="text-center">
          <p className="text-body text-gray-0 dark:text-gray-100">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Routes>
        {!isOnboarded ? (
          <>
            <Route path="/settings" element={<Settings isOnboarding={true} onComplete={() => setIsOnboarded(true)} />} />
            <Route path="*" element={<Navigate to="/settings" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chart" element={<ChartPage />} />
            <Route path="/help" element={<Help />} />
            <Route path="/input" element={<InputWizard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
