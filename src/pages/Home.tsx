import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Placeholder, Spinner } from '@telegram-apps/telegram-ui';
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
        {loading ? (
          <Spinner size="l" />
        ) : (
          <>
            <Placeholder
              header="Как прошел сегодняшний день?"
              description="Оцените ваше состояние от -5 до +5"
              action={
                <Button
                  size="l"
                  mode="filled"
                  stretched
                  onClick={handleButtonClick}
                >
                  {hasEntry ? 'Изменить оценку' : 'Оценить день'}
                </Button>
              }
            />

            {hasEntry && (
              <p className="mt-4 text-center" style={{ color: 'var(--tgui--hint_color)' }}>
                Оценка за сегодня уже стоит
              </p>
            )}
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
        <div style={{ padding: '16px' }}>
          <p style={{ marginBottom: '16px', color: 'var(--tgui--hint_color)' }}>
            Оценка за сегодня уже стоит. Хотите изменить?
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              mode="outline"
              stretched
              onClick={() => setShowModal(false)}
            >
              Отмена
            </Button>
            <Button
              mode="filled"
              stretched
              onClick={handleEditConfirm}
            >
              Изменить
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Home;
