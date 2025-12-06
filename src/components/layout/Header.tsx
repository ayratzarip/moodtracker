interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-gray-5 border-b border-gray-90 dark:border-gray-35 shadow-sm">
      <div className="max-w-screen-lg mx-auto px-4 py-4">
        <h1 className="text-h1 text-gray-0 dark:text-gray-100 text-center">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
