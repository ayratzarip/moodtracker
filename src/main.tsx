import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { AppRoot } from '@telegram-apps/telegram-ui';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Регистрация Service Worker для PWA
if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      // Уведомление пользователя о доступном обновлении
      console.log('Доступно обновление приложения');
      // Можно добавить UI уведомление для пользователя
    },
    onOfflineReady() {
      // Приложение готово к работе offline
      console.log('Приложение готово к работе offline');
    },
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <AppRoot>
        <App />
      </AppRoot>
    </HashRouter>
  </React.StrictMode>,
);
