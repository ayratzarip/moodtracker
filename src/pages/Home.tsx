import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Spinner } from '@telegram-apps/telegram-ui';
import Layout from '../components/layout/Layout';
import { storageService } from '../services/storage';
import { hapticFeedback, getBackButton, getMainButton } from '../utils/telegram';

const Home = () => {
  const navigate = useNavigate();
  const [hasEntry, setHasEntry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkTodayEntry();
    
    // Скрываем BackButton и MainButton на главной странице
    const backButton = getBackButton();
    const mainButton = getMainButton();
    if (backButton?.hide) backButton.hide();
    if (mainButton?.hide) mainButton.hide();
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
    hapticFeedback('impact', { style: 'medium' });
    if (hasEntry) {
      setShowModal(true);
    } else {
      navigate('/input');
    }
  };

  const handleEditConfirm = () => {
    hapticFeedback('impact', { style: 'light' });
    setShowModal(false);
    navigate('/input');
  };

  return (
    <Layout title="Трекер настроения">
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size="l" />
          </div>
        ) : (
          <>
            {/* Main Action Card */}
            <div className="card-lg">
              <h2 className="text-h2 text-gray-0 dark:text-gray-100 mb-2">
                Как прошел сегодняшний день?
              </h2>
              <p className="text-caption mb-6">
                Оцените ваше состояние от -5 до +5
              </p>
              <button
                onClick={handleButtonClick}
                className="btn-primary w-full"
              >
                {hasEntry ? 'Изменить оценку' : 'Оценить день'}
              </button>
              {hasEntry && (
                <p className="text-caption text-center mt-4">
                  Оценка за сегодня уже стоит
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <Modal
        open={showModal}
        onOpenChange={setShowModal}
        header={
          <Modal.Header>
            Изменить оценку?
            <Modal.Close />
          </Modal.Header>
        }
      >
        <div className="p-6">
          <p className="text-body text-gray-0 dark:text-gray-100 mb-6">
            Оценка за сегодня уже стоит. Хотите изменить?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="btn-secondary flex-1"
            >
              Отмена
            </button>
            <button
              onClick={handleEditConfirm}
              className="btn-primary flex-1"
            >
              Изменить
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Home;
