import { MoodEntry } from '../types';

const AI_PROMPT_TEMPLATE = `Я веду дневник настроения для контроля биполярного расстройства. Ниже приведены данные в формате JSON (Дата, Оценка от -5 до +5, Заметка). Проанализируй эти данные. Найди закономерности, триггеры (основываясь на заметках), длительность фаз и дай рекомендации.

Данные:`;

export function generateAIExport(data: Record<string, MoodEntry>): string {
  const sortedEntries = Object.entries(data).sort((a, b) =>
    new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  const formattedData = sortedEntries.map(([date, entry]) => ({
    date,
    score: entry.score,
    note: entry.note,
    timestamp: entry.timestamp,
  }));

  const jsonData = JSON.stringify(formattedData, null, 2);

  return `${AI_PROMPT_TEMPLATE}\n\n${jsonData}`;
}

export function downloadAIExport(content: string, filename: string = 'mood-data-for-ai.txt'): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyAIExportToClipboard(content: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(content);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
}
