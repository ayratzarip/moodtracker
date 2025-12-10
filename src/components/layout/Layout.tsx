import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title: string;
  showNav?: boolean;
}

const Layout = ({ children, title, showNav = true }: LayoutProps) => {
  return (
    <div 
      className="w-full bg-gray-95 dark:bg-brand-10" 
      style={{ 
        height: '100vh', 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Header title={title} />
      <main 
        className="overflow-y-auto" 
        style={{ 
          position: 'absolute',
          top: '64px', // Header height
          bottom: showNav ? '64px' : '0', // BottomNav height if shown
          left: 0,
          right: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '20px'
        }}
      >
        <div className="max-w-screen-lg mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};

export default Layout;
