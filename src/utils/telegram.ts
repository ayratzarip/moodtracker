/**
 * Утилиты для работы с Telegram WebApp API
 */

/**
 * Проверяет, поддерживает ли клиент Telegram указанную версию Bot API
 * @param version - Минимальная версия Bot API (например, "6.0", "8.0")
 * @returns true, если версия поддерживается, false в противном случае
 */
export function isVersionSupported(version: string): boolean {
  const tg = window.Telegram?.WebApp;
  if (tg?.isVersionAtLeast) {
    return tg.isVersionAtLeast(version);
  }
  // Если метод не доступен, предполагаем старую версию
  return false;
}

/**
 * Выполняет тактильную обратную связь
 * @param type - Тип тактильной обратной связи
 */
export function hapticFeedback(type: 'impact' | 'notification' | 'selection', params?: {
  style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
  notificationType?: 'error' | 'success' | 'warning';
}): void {
  const tg = window.Telegram?.WebApp;
  if (!tg?.HapticFeedback) return;

  switch (type) {
    case 'impact':
      if (tg.HapticFeedback.impactOccurred) {
        tg.HapticFeedback.impactOccurred(params?.style || 'medium');
      }
      break;
    case 'notification':
      if (tg.HapticFeedback.notificationOccurred && params?.notificationType) {
        tg.HapticFeedback.notificationOccurred(params.notificationType);
      }
      break;
    case 'selection':
      if (tg.HapticFeedback.selectionChanged) {
        tg.HapticFeedback.selectionChanged();
      }
      break;
  }
}

/**
 * Получает объект BackButton для управления кнопкой назад
 */
export function getBackButton() {
  return window.Telegram?.WebApp?.BackButton;
}

/**
 * Получает объект MainButton для управления главной кнопкой
 */
export function getMainButton() {
  return window.Telegram?.WebApp?.MainButton;
}
