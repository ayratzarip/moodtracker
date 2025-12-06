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
    if (tg) {
      tg.ready();
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
  );
}

export default App;
