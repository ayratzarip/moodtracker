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
  let scheduledCount = 0;
  
  // Планируем напоминания на каждый день
  for (let i = 0; i < daysAhead; i++) {
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + i);
    reminderDate.setHours(hours, minutes, 0, 0);
    
    // Пропускаем прошедшие даты
    if (reminderDate <= new Date()) {
      continue;
    }
    
    try {
      await setReminder(chatId, reminderText, reminderDate);
      scheduledCount++;
      // Небольшая задержка между запросами, чтобы не перегружать сервер
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Ошибка при планировании напоминания на ${reminderDate.toLocaleString()}:`, error);
      // Продолжаем планировать остальные напоминания даже при ошибке
    }
  }
  
  console.log(`Запланировано ${scheduledCount} ежедневных напоминаний`);
}

/**
 * Настраивает ежедневные напоминания для пользователя
 * Планирует напоминания на ближайшие 14 дней
 * Примечание: Google Apps Script должен сам управлять повторяющимися напоминаниями
 * или эта функция должна вызываться периодически для обновления расписания
 * 
 * @param settings - Настройки напоминаний
 */
export async function setupReminder(settings: NotificationSettings): Promise<void> {
  try {
    // Планируем напоминания на 14 дней вперед
    // Google Apps Script должен обрабатывать эти напоминания и отправлять их в Telegram
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
