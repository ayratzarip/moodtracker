import { setReminder } from '../api';

export interface NotificationSettings {
  chatId: number;
  time: string; // "HH:MM"
  timezone: string;
}

/**
 * Планирует ежедневные напоминания на указанное количество дней вперед
 * @param chatId - ID чата пользователя
 * @param timeString - Время в формате "HH:MM"
 * @param daysAhead - Количество дней для планирования (по умолчанию 14)
 * @param reminderText - Текст напоминания
 */
async function scheduleDailyReminders(
  chatId: number,
  timeString: string,
  daysAhead: number = 14,
  reminderText: string = 'Напоминание: оцените ваше настроение за сегодня'
): Promise<void> {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Проверяем корректность времени
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Некорректное время: ${timeString}`);
  }
  
  let scheduledCount = 0;
  const errors: string[] = [];
  
  console.log(`Начинаем планирование напоминаний для chatId: ${chatId}, время: ${timeString}, дней: ${daysAhead}`);
  
  // Планируем напоминания на каждый день
  for (let i = 0; i < daysAhead; i++) {
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + i);
    reminderDate.setHours(hours, minutes, 0, 0);
    
    // Пропускаем прошедшие даты
    if (reminderDate <= new Date()) {
      console.log(`Пропускаем прошедшую дату: ${reminderDate.toISOString()}`);
      continue;
    }
    
    try {
      await setReminder(chatId, reminderText, reminderDate);
      scheduledCount++;
      console.log(`Напоминание запланировано на ${reminderDate.toLocaleString('ru-RU')}`);
      // Небольшая задержка между запросами, чтобы не перегружать сервер
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      const errorMsg = `Ошибка при планировании напоминания на ${reminderDate.toLocaleString('ru-RU')}: ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
      // Продолжаем планировать остальные напоминания даже при ошибке
    }
  }
  
  console.log(`Запланировано ${scheduledCount} из ${daysAhead} ежедневных напоминаний`);
  if (errors.length > 0) {
    console.warn(`Было ${errors.length} ошибок при планировании:`, errors);
  }
}

/**
 * Настраивает ежедневные напоминания для пользователя
 * Планирует напоминания на ближайшие 14 дней
 * Отправляет запросы в Yandex Cloud Function для установки напоминаний
 * 
 * @param settings - Настройки напоминаний
 */
export async function setupReminder(settings: NotificationSettings): Promise<void> {
  try {
    // Планируем напоминания на 14 дней вперед
    // Yandex Cloud Function обрабатывает эти напоминания и отправляет их в Telegram
    await scheduleDailyReminders(
      settings.chatId,
      settings.time,
      14,
      'Напоминание: оцените ваше настроение за сегодня'
    );
  } catch (error) {
    // Log error but don't throw - allow app to continue working
    console.error('Error setting up reminder:', error);
    // Don't throw error - app should work even if notifications fail
  }
}
