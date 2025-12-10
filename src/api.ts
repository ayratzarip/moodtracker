// URL от Google Apps Script
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycby2U9wd2WUtJWGFcg0joCayHowm4tzUn1c61eA5rKf9B3fi8p8XvuC_ioHW_kX9W8smEw/exec';

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

  // Превращаем дату в timestamp (миллисекунды)
  const time = dateObj.getTime();

  const payload = {
    chat_id: chatId,
    text: text,
    time: time
  };

  console.log('Sending reminder to Google Apps Script:', {
    url: GOOGLE_SCRIPT_URL,
    payload: payload,
    date: dateObj.toISOString(),
    timestamp: time
  });

  return fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // Важно для Google Apps Script (не позволяет читать ответ, но отправляет данные)
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })
  .then(() => {
    console.log('Напоминание отправлено в Google Apps Script:', {
      chatId,
      text,
      time: dateObj.toISOString(),
      timestamp: time
    });
    // При mode: 'no-cors' мы не можем проверить ответ, но запрос отправлен
  })
  .catch(err => {
    console.error('Ошибка при отправке напоминания в Google Apps Script:', err);
    throw err;
  });
}