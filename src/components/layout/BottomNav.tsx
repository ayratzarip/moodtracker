import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Главная' },
    { path: '/settings', icon: '⏰', label: 'Напоминания' },
    { path: '/chart', icon: '📈', label: 'График' },
    { path: '/help', icon: 'ℹ️', label: 'Инструкция' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 tg-bg-secondary border-t border-border-muted">
      <div className="flex justify-around items-center h-16 max-w-screen-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'tg-link' : 'tg-hint'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
