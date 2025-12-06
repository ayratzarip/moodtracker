import { useState, useEffect } from 'react';
import { Spinner } from '@telegram-apps/telegram-ui';
import Layout from '../components/layout/Layout';
import ChartMobile from '../components/ui/ChartMobile';
import ChartDesktop from '../components/ui/ChartDesktop';
import { storageService } from '../services/storage';
import { generateAIExport, downloadAIExport, copyAIExportToClipboard } from '../services/aiExport';
import { MoodEntry } from '../types';

const ChartPage = () => {
  const [data, setData] = useState<Record<string, MoodEntry>>({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    loadData();
    checkPlatform();
  }, []);

  const checkPlatform = () => {
    const tg = window.Telegram?.WebApp;
    const platform = tg?.platform || 'unknown';
    setIsDesktop(['macos', 'tdesktop', 'web', 'webk', 'weba'].includes(platform));
  };

  const loadData = async () => {
    try {
      const allData = await storageService.getAllData();
      setData(allData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const exportContent = generateAIExport(data);

      // Try to copy to clipboard first
      try {
        await copyAIExportToClipboard(exportContent);
        alert('Данные скопированы в буфер обмена! Вставьте их в ChatGPT или другой AI-инструмент.');
      } catch {
        // If clipboard fails, download as file
        downloadAIExport(exportContent);
        alert('Данные экспортированы в файл! Откройте файл и скопируйте содержимое в ChatGPT или другой AI-инструмент.');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Ошибка при экспорте данных');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <Layout title="График настроения">
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="l" />
        </div>
      </Layout>
    );
  }

  const hasData = Object.keys(data).length > 0;

  return (
    <Layout title="График настроения">
      <div className="flex flex-col gap-6">
        {!hasData ? (
          <div className="card-lg text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-h2 text-gray-0 dark:text-gray-100 mb-2">
              Нет данных для отображения
            </h2>
            <p className="text-caption">
              Начните оценивать свое настроение, чтобы увидеть график
            </p>
          </div>
        ) : (
          <>
            <div className="card-lg">
              {isDesktop ? (
                <ChartDesktop data={data} />
              ) : (
                <ChartMobile data={data} />
              )}
            </div>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-primary w-full"
            >
              {exporting ? 'Экспорт...' : '🤖 Анализ AI (Экспорт данных)'}
            </button>
            <p className="text-caption text-center">
              Экспортируйте данные для анализа с помощью ChatGPT или другого AI-инструмента
            </p>

            <div className="card">
              <p className="text-body text-gray-0 dark:text-gray-100 mb-2">
                <strong>Всего записей:</strong> {Object.keys(data).length}
              </p>
              <p className="text-caption">
                График показывает динамику вашего настроения за последнее время.
                {isDesktop
                  ? ' Наведите курсор на точку, чтобы увидеть детали и примечания.'
                  : ' Откройте на компьютере для детального просмотра с примечаниями.'}
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ChartPage;
