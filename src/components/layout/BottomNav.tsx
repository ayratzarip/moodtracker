import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Главная' },
    { path: '/settings', icon: '⏰', label: 'Напоминания' },
    { path: '/chart', icon: '📈', label: 'График' },
    { path: '/help', icon: 'ℹ️', label: 'Инструкция' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-5 border-t border-gray-90 dark:border-gray-35 shadow-sm">
      <div className="flex justify-around items-center h-16 max-w-screen-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200',
                isActive 
                  ? 'text-brand-70 dark:text-brand-70' 
                  : 'text-gray-60 dark:text-gray-60'
              )}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-caption">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
