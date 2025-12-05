import { useState, useEffect } from 'react';
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
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)]">
          <p className="tg-text">Загрузка данных...</p>
        </div>
      </Layout>
    );
  }

  const hasData = Object.keys(data).length > 0;

  return (
    <Layout title="График настроения">
      <div className="py-6 px-4">
        {!hasData ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4">📊</p>
            <p className="tg-text text-lg mb-2">Нет данных для отображения</p>
            <p className="tg-hint text-sm">
              Начните оценивать свое настроение, чтобы увидеть график
            </p>
          </div>
        ) : (
          <>
            {isDesktop ? (
              <ChartDesktop data={data} />
            ) : (
              <ChartMobile data={data} />
            )}

            <div className="mt-6">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full tg-button py-4 rounded-lg text-lg font-medium shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                {exporting ? 'Экспорт...' : '🤖 Анализ AI (Экспорт данных)'}
              </button>
              <p className="text-xs tg-hint text-center mt-3">
                Экспортируйте данные для анализа с помощью ChatGPT или другого AI-инструмента
              </p>
            </div>

            <div className="mt-6 tg-bg-secondary rounded-lg p-4">
              <p className="text-sm tg-text mb-2">
                <strong>Всего записей:</strong> {Object.keys(data).length}
              </p>
              <p className="text-sm tg-hint">
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
