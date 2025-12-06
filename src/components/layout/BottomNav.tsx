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
    <nav 
      className="fixed bottom-0 left-0 right-0 tg-bg-secondary border-t" 
      style={{ 
        borderColor: 'var(--border)', 
        boxShadow: '0 -2px 8px var(--shadow)' 
      }}
    >
      <div className="flex justify-around items-center h-16 max-w-screen-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                isActive ? 'tg-link' : 'tg-hint'
              }`}
              style={{
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
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
