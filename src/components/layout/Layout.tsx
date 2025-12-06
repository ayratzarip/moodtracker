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
    <div className="flex flex-col h-full w-full bg-gray-95 dark:bg-brand-10">
      <Header title={title} />
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-screen-lg mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};

export default Layout;
