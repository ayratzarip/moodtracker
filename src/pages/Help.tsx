import Layout from '../components/layout/Layout';
import VimeoEmbed from '../components/ui/VimeoEmbed';

const Help = () => {
  return (
    <Layout title="Инструкция">
      <div className="py-6 px-4 space-y-6">
        {/* Video Section */}
        <div className="tg-bg-secondary rounded-lg p-4">
          <h2 className="text-lg font-semibold tg-text mb-4">
            Видео-инструкция
          </h2>
          <VimeoEmbed videoId="76979871" />
        </div>

        {/* Instructions Section */}
        <div className="tg-bg-secondary rounded-lg p-6">
          <h2 className="text-lg font-semibold tg-text mb-4">
            Как пользоваться приложением
          </h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full tg-button flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold tg-text mb-1">
                  Настрой время напоминаний
                </h3>
                <p className="text-sm tg-hint">
                  Выбери удобное время для ежедневной оценки настроения.
                  Рекомендуется вечернее время, когда можно спокойно оценить день.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full tg-button flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold tg-text mb-1">
                  Каждый день оценивай состояние
                </h3>
                <p className="text-sm tg-hint">
                  Используй шкалу от -5 до +5: отрицательные значения для депрессии,
                  положительные для приподнятого настроения. Добавляй примечания
                  о событиях дня.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full tg-button flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold tg-text mb-1">
                  Используй десктоп для анализа графика
                </h3>
                <p className="text-sm tg-hint">
                  Открой приложение на компьютере для детального просмотра графика
                  с возможностью наведения на точки и чтения примечаний.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full tg-button flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold tg-text mb-1">
                  Используй кнопку AI для экспорта данных
                </h3>
                <p className="text-sm tg-hint">
                  Экспортируй свои данные для анализа с помощью ChatGPT или
                  для предоставления врачу. Данные включают готовый промпт
                  для AI-анализа.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Bipolar Disorder */}
        <div className="tg-bg-secondary rounded-lg p-6">
          <h2 className="text-lg font-semibold tg-text mb-3">
            О биполярном расстройстве
          </h2>
          <p className="text-sm tg-hint mb-3">
            Биполярное аффективное расстройство (БАР) характеризуется чередованием
            фаз депрессии и мании/гипомании. Регулярное отслеживание настроения
            помогает:
          </p>
          <ul className="text-sm tg-hint space-y-2 list-disc list-inside">
            <li>Выявлять паттерны и триггеры изменений настроения</li>
            <li>Предсказывать наступление фаз</li>
            <li>Оценивать эффективность лечения</li>
            <li>Улучшать коммуникацию с врачом</li>
          </ul>
        </div>

        {/* Tips */}
        <div className="tg-bg-secondary rounded-lg p-6">
          <h2 className="text-lg font-semibold tg-text mb-3">
            💡 Советы
          </h2>
          <ul className="text-sm tg-hint space-y-2">
            <li>• Будьте честны в оценках - это помогает точнее отслеживать состояние</li>
            <li>• Записывайте события дня в примечаниях для выявления триггеров</li>
            <li>• Регулярность важнее точности - не пропускайте дни</li>
            <li>• Делитесь графиком с врачом для корректировки лечения</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
