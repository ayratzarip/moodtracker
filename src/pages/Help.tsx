import Layout from '../components/layout/Layout';

const Help = () => {
  return (
    <Layout title="Инструкция">
      <div className="flex flex-col gap-6">
        {/* Instructions Section */}
        <div className="card-lg">
          <h2 className="text-h2 text-gray-0 dark:text-gray-100 mb-6">
            Как пользоваться приложением
          </h2>

          <div className="space-y-6">
            {[
              {
                num: 1,
                title: 'Настрой время напоминаний',
                text: 'Выбери удобное время для ежедневной оценки настроения. Рекомендуется вечернее время, когда можно спокойно оценить день.',
              },
              {
                num: 2,
                title: 'Каждый день оценивай состояние',
                text: 'Используй шкалу от -5 до +5: отрицательные значения для депрессии, положительные для приподнятого настроения. Добавляй примечания о событиях дня.',
              },
              {
                num: 3,
                title: 'Используй десктоп для анализа графика',
                text: 'Открой приложение на компьютере для детального просмотра графика с возможностью наведения на точки и чтения примечаний.',
              },
              {
                num: 4,
                title: 'Используй кнопку AI для экспорта данных',
                text: 'Экспортируй свои данные для анализа с помощью ChatGPT или для предоставления врачу. Данные включают готовый промпт для AI-анализа.',
              },
            ].map((item) => (
              <div key={item.num} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-70 text-white flex items-center justify-center font-bold text-body">
                  {item.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-h2 text-gray-0 dark:text-gray-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-caption">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Rating Instructions */}
        <div className="card-lg">
          <h2 className="text-h2 text-gray-0 dark:text-gray-100 mb-4">
            ИНСТРУКЦИЯ ПО ОЦЕНКЕ НАСТРОЕНИЯ
          </h2>
          <p className="text-body text-gray-0 dark:text-gray-100 mb-6">
            Используйте эту шкалу, чтобы ежедневно фиксировать уровень энергии и настроение. Будьте честны с собой — это поможет отследить динамику.
          </p>

          {/* ЗОНА ПОДЪЕМА */}
          <div className="mb-8">
            <h3 className="text-h2 text-gray-0 dark:text-gray-100 mb-3">
              ЗОНА ПОДЪЕМА (МАНИЯ/ГИПОМАНИЯ)
            </h3>
            <p className="text-caption mb-4">
              Оцениваем: энергию, скорость мыслей, сон, импульсивность.
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-brand-70 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-h2 text-brand-70 font-bold">+5:</span>
                  <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Тяжелая мания</span>
                </div>
                <p className="text-caption">
                  Полная потеря контроля, бред, галлюцинации. Отсутствие сна. Агрессия или опасное поведение.
                </p>
                <p className="text-caption font-semibold text-red-600 dark:text-red-400 mt-1">
                  Требуется экстренная помощь.
                </p>
              </div>

              <div className="border-l-4 border-brand-70 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-h2 text-brand-70 font-bold">+4:</span>
                  <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Выраженная мания</span>
                </div>
                <p className="text-caption">
                  Ощущение «на вершине мира», быстрая речь, рискованные поступки (траты, гонки). Сон 1–2 часа, усталости нет.
                </p>
              </div>

              <div className="border-l-4 border-brand-70 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-h2 text-brand-70 font-bold">+3:</span>
                  <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Умеренная мания</span>
                </div>
                <p className="text-caption">
                  Мысли скачут, много начатых и брошенных дел. Сильная раздражительность или эйфория. Сна меньше нормы на 2–3 часа.
                </p>
              </div>

              <div className="border-l-4 border-brand-70 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-h2 text-brand-70 font-bold">+2:</span>
                  <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Гипомания (Продуктивность)</span>
                </div>
                <p className="text-caption">
                  Вы — душа компании. Креативность на пике, уверенность в себе. Сна нужно меньше, но вы высыпаетесь.
                </p>
              </div>

              <div className="border-l-4 border-brand-70 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-h2 text-brand-70 font-bold">+1:</span>
                  <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Легкий подъем</span>
                </div>
                <p className="text-caption">
                  Жизнь кажется легкой и приятной. Чуть больше энергии, чем обычно. Просто хороший день.
                </p>
              </div>
            </div>
          </div>

          {/* ЗОНА РАВНОВЕСИЯ */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">➖</span>
              <h3 className="text-h2 text-gray-0 dark:text-gray-100">
                ЗОНА РАВНОВЕСИЯ
              </h3>
            </div>
            
            <div className="border-l-4 border-gray-60 dark:border-gray-60 pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-h2 text-gray-60 dark:text-gray-60 font-bold">0:</span>
                <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Эутимия (Норма)</span>
              </div>
              <p className="text-caption">
                Ровное состояние. Эмоции адекватны ситуации. Нет проблем со сном и делами.
              </p>
            </div>
          </div>

          {/* ЗОНА СПАДА */}
          <div>
            <h3 className="text-h2 text-gray-0 dark:text-gray-100 mb-3">
              ЗОНА СПАДА (ДЕПРЕССИЯ)
            </h3>
            <p className="text-caption mb-4">
              Оцениваем: апатию, тоску, заторможенность.
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-gray-60 dark:border-gray-60 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-h2 text-gray-60 dark:text-gray-60 font-bold">-1:</span>
                  <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Легкий спад</span>
                </div>
                <p className="text-caption">
                  Ощущение, что «батарейка садится». Дела делаются без энтузиазма. Желание побыть одному.
                </p>
              </div>

              <div className="border-l-4 border-gray-60 dark:border-gray-60 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-h2 text-gray-60 dark:text-gray-60 font-bold">-2:</span>
                  <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Умеренная депрессия</span>
                </div>
                <p className="text-caption">
                  Дела «через не хочу». Тревога, чувство вины. Не хочется отвечать на звонки. Трудно концентрироваться.
                </p>
              </div>

              <div className="border-l-4 border-gray-60 dark:border-gray-60 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-h2 text-gray-60 dark:text-gray-60 font-bold">-3:</span>
                  <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Средне-тяжелая депрессия</span>
                </div>
                <p className="text-caption">
                  Сил хватает только на еду и гигиену. Учеба/работа страдают. Бессонница или сонливость. Чувство никчемности.
                </p>
              </div>

              <div className="border-l-4 border-gray-60 dark:border-gray-60 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-h2 text-gray-60 dark:text-gray-60 font-bold">-4:</span>
                  <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Тяжелая депрессия</span>
                </div>
                <p className="text-caption">
                  С трудом встаете с постели. Душевная боль или пустота. Навязчивые мысли о смерти, потеря интереса ко всему.
                </p>
              </div>

              <div className="border-l-4 border-gray-60 dark:border-gray-60 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-h2 text-gray-60 dark:text-gray-60 font-bold">-5:</span>
                  <span className="text-h2 text-gray-0 dark:text-gray-100 font-bold">Крайне тяжелая депрессия</span>
                </div>
                <p className="text-caption">
                  Полная обездвиженность или невыносимое возбуждение от боли. Отказ от еды. Конкретные суицидальные планы.
                </p>
                <p className="text-caption font-semibold text-red-600 dark:text-red-400 mt-1">
                  Требуется немедленная госпитализация.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="card-lg">
          <h2 className="text-h2 text-gray-0 dark:text-gray-100 mb-4">
            💡 Советы
          </h2>
          <ul className="text-caption space-y-3">
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
