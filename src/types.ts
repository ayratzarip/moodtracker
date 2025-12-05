export interface MoodEntry {
  score: number; // -5 to +5
  note: string;
  timestamp: number;
}

export interface MonthData {
  [date: string]: MoodEntry; // date format: "YYYY-MM-DD"
}

export interface UserSettings {
  reminderTime: string; // "HH:MM"
  onboarded: boolean;
}

export type Platform = 'android' | 'ios' | 'macos' | 'tdesktop' | 'web' | 'weba' | 'webk' | 'unknown';
