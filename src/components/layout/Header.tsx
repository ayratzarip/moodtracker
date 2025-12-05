interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="tg-bg-secondary border-b border-gray-200">
      <div className="max-w-screen-lg mx-auto px-4 py-4">
        <h1 className="text-xl font-semibold tg-text text-center">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
