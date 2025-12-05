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
    <div className="flex flex-col min-h-screen tg-bg">
      <Header title={title} />
      <main className="flex-1 pb-20 overflow-y-auto">
        <div className="max-w-screen-lg mx-auto">
          {children}
        </div>
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};

export default Layout;
