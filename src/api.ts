// URL от Google Apps Script
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxxWNb99Q8iejXHZmXVdvjd2V-tMJVZlAeTpE9IHT0nvQYn72_UO3M6OkOGO73kIOJVFA/exec';

/**
 * Устанавливает напоминание через Google Apps Script
 * @param chatId - ID чата пользователя в Telegram
 * @param text - Текст напоминания
 * @param dateObj - Дата и время напоминания
 */
export function setReminder(chatId: number, text: string, dateObj: Date): Promise<void> {
  // Проверяем, что URL настроен
  if (!GOOGLE_SCRIPT_URL) {
    console.warn('Google Apps Script URL is not configured. Skipping reminder setup.');
    return Promise.reject(new Error('Google Apps Script URL is not configured'));
  }

  // Превращаем дату в timestamp
  const time = dateObj.getTime();

  return fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // Важно для Google Apps Script
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      time: time
    })
  })
  .then(() => {
    console.log('Напоминание установлено!');
  })
  .catch(err => {
    console.error('Ошибка при установке напоминания:', err);
    throw err;
  });
}