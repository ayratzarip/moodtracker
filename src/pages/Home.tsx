import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { storageService } from '../services/storage';

const Home = () => {
  const navigate = useNavigate();
  const [hasEntry, setHasEntry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkTodayEntry();
  }, []);

  const checkTodayEntry = async () => {
    try {
      const entry = await storageService.getTodayEntry();
      setHasEntry(!!entry);
    } catch (error) {
      console.error('Error checking today entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (hasEntry) {
      setShowModal(true);
    } else {
      navigate('/input');
    }
  };

  const handleEditConfirm = () => {
    setShowModal(false);
    navigate('/input');
  };

  return (
    <Layout title="Bipolar Mood Tracker">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tg-text mb-2">
            Как прошел сегодняшний день?
          </h2>
          <p className="tg-hint text-sm">
            Оцените ваше состояние от -5 до +5
          </p>
        </div>

        <button
          onClick={handleButtonClick}
          disabled={loading}
          className="tg-button px-8 py-4 rounded-lg text-lg font-medium shadow-lg transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : hasEntry ? 'Изменить оценку' : 'Оценить день'}
        </button>

        {hasEntry && (
          <p className="mt-4 tg-hint text-sm">
            Оценка за сегодня уже стоит
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="tg-bg rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold tg-text mb-3">
              Изменить оценку?
            </h3>
            <p className="tg-hint text-sm mb-6">
              Оценка за сегодня уже стоит. Хотите изменить?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg tg-bg-secondary tg-text font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleEditConfirm}
                className="flex-1 px-4 py-2 rounded-lg tg-button font-medium"
              >
                Изменить
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
