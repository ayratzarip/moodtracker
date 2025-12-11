// URL функции Yandex Cloud
const YANDEX_CLOUD_FUNCTION_URL = 'https://functions.yandexcloud.net/d4e9hhkjomcv7i65lmqn';

/**
 * Устанавливает напоминание через Yandex Cloud Function
 * @param chatId - ID чата пользователя в Telegram
 * @param text - Текст напоминания
 * @param dateObj - Дата и время напоминания
 */
export function setReminder(chatId: number, text: string, dateObj: Date): Promise<void> {
  // Преобразуем дату в ISO строку (формат YYYY-MM-DDTHH:mm:ssZ)
  const remindAt = dateObj.toISOString();

  const reminderData = {
    chat_id: chatId,
    remind_at: remindAt,
    text: text
  };

  console.log('Sending reminder to Yandex Cloud:', {
    url: YANDEX_CLOUD_FUNCTION_URL,
    payload: reminderData,
    date: remindAt
  });

  return fetch(YANDEX_CLOUD_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reminderData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log('Напоминание отправлено в Yandex Cloud:', {
      chatId,
      text,
      remindAt
    });
  })
  .catch(err => {
    console.error('Ошибка при отправке напоминания в Yandex Cloud:', err);
    throw err;
  });
}