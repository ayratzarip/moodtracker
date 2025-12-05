import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
      .catch(() => {
        setIsOnboarded(false);
      });
  }, []);

  if (isOnboarded === null) {
    return (
      <div className="flex items-center justify-center min-h-screen tg-bg">
        <div className="text-center">
          <p className="tg-text">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
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
    </Router>
  );
}

export default App;
