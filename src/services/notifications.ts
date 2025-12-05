// Google Apps Script webhook integration
// Set this to your actual Google Apps Script URL or leave empty to disable
const GAS_WEBHOOK_URL = import.meta.env.VITE_GAS_WEBHOOK_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

export interface NotificationSettings {
  chatId: number;
  time: string; // "HH:MM"
  timezone: string;
}

export async function setupReminder(settings: NotificationSettings): Promise<void> {
  // Skip if URL is not configured (contains placeholder)
  if (!GAS_WEBHOOK_URL || GAS_WEBHOOK_URL.includes('YOUR_SCRIPT_ID')) {
    console.warn('Google Apps Script webhook URL is not configured. Skipping reminder setup.');
    return;
  }

  try {
    const response = await fetch(GAS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      // Log error but don't throw - allow app to continue working
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Failed to setup reminder:', response.status, errorText);
      // Don't throw error - app should work even if notifications fail
      return;
    }

    return await response.json();
  } catch (error) {
    // Log error but don't throw - allow app to continue working
    console.error('Error setting up reminder:', error);
    // Don't throw error - app should work even if notifications fail
  }
}
