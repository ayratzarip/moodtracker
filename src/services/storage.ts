import { MoodEntry, MonthData, UserSettings } from '../types';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        CloudStorage: {
          getItem: (key: string, callback: (error: string | null, value?: string) => void) => void;
          setItem: (key: string, value: string, callback: (error: string | null, success?: boolean) => void) => void;
          getItems: (keys: string[], callback: (error: string | null, values?: Record<string, string>) => void) => void;
        };
        ready: () => void;
        platform: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
          };
        };
      };
    };
  }
}

const tg = window.Telegram?.WebApp;

class CloudStorageService {
  private getMonthKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `mood_${year}_${month}`;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getMonthData(date: Date): Promise<MonthData> {
    return new Promise((resolve, reject) => {
      const key = this.getMonthKey(date);
      tg.CloudStorage.getItem(key, (error, value) => {
        if (error) {
          reject(error);
        } else {
          try {
            const data = value ? JSON.parse(value) : {};
            resolve(data);
          } catch (e) {
            reject('Failed to parse month data');
          }
        }
      });
    });
  }

  async setMonthData(date: Date, data: MonthData): Promise<void> {
    return new Promise((resolve, reject) => {
      const key = this.getMonthKey(date);
      const value = JSON.stringify(data);
      tg.CloudStorage.setItem(key, value, (error, success) => {
        if (error || !success) {
          reject(error || 'Failed to save data');
        } else {
          resolve();
        }
      });
    });
  }

  async getEntry(date: Date): Promise<MoodEntry | null> {
    const monthData = await this.getMonthData(date);
    const dateKey = this.formatDate(date);
    return monthData[dateKey] || null;
  }

  async saveEntry(date: Date, entry: MoodEntry): Promise<void> {
    const monthData = await this.getMonthData(date);
    const dateKey = this.formatDate(date);
    monthData[dateKey] = entry;
    await this.setMonthData(date, monthData);
  }

  async getTodayEntry(): Promise<MoodEntry | null> {
    return this.getEntry(new Date());
  }

  async saveTodayEntry(entry: MoodEntry): Promise<void> {
    return this.saveEntry(new Date(), entry);
  }

  async getAllData(): Promise<Record<string, MoodEntry>> {
    // Get all month keys (we'll need to track which months have data)
    // For now, we'll get last 12 months
    const allData: Record<string, MoodEntry> = {};
    const promises: Promise<void>[] = [];

    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      promises.push(
        this.getMonthData(date).then(monthData => {
          Object.assign(allData, monthData);
        }).catch(() => {
          // Ignore errors for months with no data
        })
      );
    }

    await Promise.all(promises);
    return allData;
  }

  async getUserSettings(): Promise<UserSettings> {
    return new Promise((resolve, reject) => {
      tg.CloudStorage.getItem('user_settings', (error, value) => {
        if (error) {
          reject(error);
        } else {
          try {
            const settings = value ? JSON.parse(value) : { reminderTime: '20:00', onboarded: false };
            resolve(settings);
          } catch (e) {
            reject('Failed to parse user settings');
          }
        }
      });
    });
  }

  async saveUserSettings(settings: UserSettings): Promise<void> {
    return new Promise((resolve, reject) => {
      const value = JSON.stringify(settings);
      tg.CloudStorage.setItem('user_settings', value, (error, success) => {
        if (error || !success) {
          reject(error || 'Failed to save settings');
        } else {
          resolve();
        }
      });
    });
  }
}

export const storageService = new CloudStorageService();
