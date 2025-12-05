// Google Apps Script webhook integration
const GAS_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

export interface NotificationSettings {
  chatId: number;
  time: string; // "HH:MM"
  timezone: string;
}

export async function setupReminder(settings: NotificationSettings): Promise<void> {
  try {
    const response = await fetch(GAS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Failed to setup reminder');
    }

    return await response.json();
  } catch (error) {
    console.error('Error setting up reminder:', error);
    throw error;
  }
}
