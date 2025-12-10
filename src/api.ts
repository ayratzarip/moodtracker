// Вставьте сюда ваш URL от Google Apps Script
const GOOGLE_SCRIPT_URL: string = 'https://script.google.com/macros/s/AKfycbxxWNb99Q8iejXHZmXVdvjd2V-tMJVZlAeTpE9IHT0nvQYn72_UO3M6OkOGO73kIOJVFA/exec;';

// Мы указываем типы входящих данных:
// chatId — число, text — строка, dateObj — объект даты
export const setReminder = (chatId: number, text: string, dateObj: Date): Promise<Response> => {
  const time = dateObj.getTime();

  return fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      time: time,
    }),
  });
};